import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectCategoryResponseDto } from './dto/project-category.response-dto';
import { ProjectResponseDto } from './dto/project.response-dto';
import { ProjectsListResponseDto } from './dto/projects-list.response-dto';
import { ProjectMapper } from '../shared/mappers/project.mapper';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProjectRolesService } from '../project-roles/project-roles.service';
import { ParticipationsService } from '../participations/participations.service';
import { UserParticipationResponseDto } from '../participations/dto/user-participation.response-dto';
import { DiscordService } from '../discord/discord.service';
import { UsersService } from '../users/users.service';

interface GetProjectsOptionsInterface {
  userId: string;
  status: ProjectStatus;
  categoryId: string;
  minParticipants: number;
  maxParticipants: number;
  page: number;
  limit: number;
}

@Injectable()
export class ProjectsService {
  public constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private projectRolesService: ProjectRolesService,
    private participationsService: ParticipationsService,
    private discordService: DiscordService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  public async getCategories(): Promise<ProjectCategoryResponseDto[]> {
    return this.prisma.projectCategory.findMany();
  }

  public async getProjects(
    options: Partial<GetProjectsOptionsInterface>,
  ): Promise<ProjectsListResponseDto> {
    const {
      userId,
      status,
      categoryId,
      minParticipants,
      maxParticipants,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(minParticipants || maxParticipants
        ? {
            participantsCount: {
              ...(minParticipants && { gte: minParticipants }),
              ...(maxParticipants && { lte: maxParticipants }),
            },
          }
        : {}),
      ...(userId && {
        roles: {
          some: {
            userId,
          },
        },
      }),
    };

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          roles: {
            where: {
              userId: null,
            },
            include: {
              roleType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      total,
      projects: projects.map((project) =>
        ProjectMapper.toCardResponse(project),
      ),
    };
  }

  public async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const user = await this.usersService.getUserById(userId);

    if (user.activeProjectsCount >= 2) {
      throw new BadRequestException(
        'You have reached the limit of active projects',
      );
    }

    const { channelId, adminRoleId, memberRoleId } =
      await this.discordService.createProjectChannel(
        createProjectDto.projectName,
      );

    const newProject = await this.prisma.$transaction(async (prisma) => {
      try {
        const project = await prisma.project.create({
          data: {
            ownerId: userId,
            projectName: createProjectDto.projectName,
            description: createProjectDto.description,
            categoryId: createProjectDto.categoryId,
            discordChannelId: channelId,
            discordAdminRoleId: adminRoleId,
            discordMemberRoleId: memberRoleId,
            roles: {
              create: createProjectDto.rolesIds.map((roleTypeId) => ({
                roleType: {
                  connect: { id: roleTypeId },
                },
              })),
            },
          },
          include: {
            category: true,
            roles: {
              include: {
                roleType: true,
                user: {
                  include: {
                    educations: {
                      include: { specialization: true },
                    },
                  },
                },
              },
            },
            documents: true,
            owner: true,
            boards: true,
          },
        });

        const ownerRoleType =
          await this.projectRolesService.findOrCreateRole('Project owner');
        const ownerRole = await prisma.projectRole.create({
          data: {
            roleTypeId: ownerRoleType.id,
            projectId: project.id,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            projectRoles: {
              connect: { id: ownerRole.id },
            },
            activeProjectsCount: { increment: 1 },
          },
        });

        return project;
      } catch (error) {
        await this.discordService.deleteProjectChannel(
          channelId,
          adminRoleId,
          memberRoleId,
        );
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          throw new BadRequestException(
            'Some role type IDs or category ID are invalid',
          );
        }
        throw error;
      }
    });

    if (newProject.owner.discordId) {
      await this.discordService.addRoleToUser(
        newProject.owner.discordId,
        adminRoleId,
      );
    }

    return ProjectMapper.toFullResponse(newProject);
  }

  public async getProjectById(id: string): Promise<ProjectResponseDto> {
    try {
      const project = await this.prisma.project.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          roles: {
            include: {
              roleType: true,
              user: {
                include: {
                  educations: {
                    include: { specialization: true },
                  },
                },
              },
            },
          },
          documents: true,
          owner: true,
          boards: true,
        },
      });

      return ProjectMapper.toFullResponse(project);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  public async updateProject(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: dto,
        include: {
          category: true,
          roles: {
            include: {
              roleType: true,
              user: {
                include: {
                  educations: {
                    include: { specialization: true },
                  },
                },
              },
            },
          },
          documents: true,
          owner: true,
          boards: true,
        },
      });

      return ProjectMapper.toFullResponse(updatedProject);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new BadRequestException('Project category ID not found');
          case 'P2025':
            throw new NotFoundException('Project not found');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async closeProject(id: string): Promise<ProjectResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      try {
        const closedProject = await prisma.project.update({
          where: { id },
          data: { status: 'done' },
          include: {
            category: true,
            roles: {
              include: {
                roleType: true,
                user: {
                  include: {
                    educations: {
                      include: { specialization: true },
                    },
                  },
                },
              },
            },
            documents: true,
            owner: true,
            boards: true,
          },
        });

        const usersIds: string[] = closedProject.roles
          .map((role) => role.userId)
          .filter((userId) => userId !== null);

        if (usersIds.length) {
          await prisma.user.updateMany({
            where: {
              id: { in: usersIds },
            },
            data: {
              activeProjectsCount: { decrement: 1 },
            },
          });
        }

        return ProjectMapper.toFullResponse(closedProject);
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Project or user in team not found');
        }
        throw error;
      }
    });
  }

  public async deleteProject(id: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status === ProjectStatus.done) {
      throw new MethodNotAllowedException('Cannot delete a completed project');
    }

    await this.prisma.$transaction(async (prisma) => {
      try {
        const deletedProject = await prisma.project.delete({
          where: { id },
          include: {
            roles: true,
          },
        });

        const usersIds: string[] = deletedProject.roles
          .map((role) => role.userId)
          .filter((userId) => userId !== null);

        if (usersIds.length) {
          await prisma.user.updateMany({
            where: {
              id: { in: usersIds },
            },
            data: {
              activeProjectsCount: { decrement: 1 },
            },
          });
        }

        await this.cloudinaryService.deleteProjectFolder(id);
        await this.discordService.deleteProjectChannel(
          deletedProject.discordChannelId,
          deletedProject.discordAdminRoleId,
          deletedProject.discordMemberRoleId,
        );
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Project or user in team not found');
        }
        throw error;
      }
    });
  }

  public async updateProjectLogo(
    id: string,
    file: Express.Multer.File,
  ): Promise<ProjectResponseDto> {
    try {
      const logoUrl = await this.cloudinaryService.uploadProjectLogo(file, id);
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: { logoUrl },
        include: {
          category: true,
          roles: {
            include: {
              roleType: true,
              user: {
                include: {
                  educations: {
                    include: { specialization: true },
                  },
                },
              },
            },
          },
          documents: true,
          owner: true,
          boards: true,
        },
      });

      return ProjectMapper.toFullResponse(updatedProject);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  public async deleteProjectLogo(id: string): Promise<ProjectResponseDto> {
    try {
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: { logoUrl: null },
        include: {
          category: true,
          roles: {
            include: {
              roleType: true,
              user: {
                include: {
                  educations: {
                    include: { specialization: true },
                  },
                },
              },
            },
          },
          documents: true,
          owner: true,
          boards: true,
        },
      });

      await this.cloudinaryService.deleteProjectLogo(id);

      return ProjectMapper.toFullResponse(updatedProject);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  public async getInvites(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getInvitesWithUsers(projectId);
  }

  public async getRequests(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getRequestsWithUsers(projectId);
  }
}
