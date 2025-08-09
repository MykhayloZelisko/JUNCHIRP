import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectRoleType } from '@prisma/client';
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { ProjectRoleResponseDto } from './dto/project-role.response-dto';
import { ProjectRoleMapper } from '../shared/mappers/project-role.mapper';
import { CreateProjectRoleDto } from './dto/create-project-role.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ProjectRoleWithUserResponseDto } from './dto/project-role-with-user.response-dto';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class ProjectRolesService {
  public constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  public async getProjectRoleTypes(): Promise<ProjectRoleTypeResponseDto[]> {
    return this.prisma.projectRoleType.findMany({
      where: {
        roleName: {
          not: 'Project owner',
        },
      },
    });
  }

  public async findOrCreateRole(roleName: string): Promise<ProjectRoleType> {
    return this.prisma.projectRoleType.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    });
  }

  public async createProjectRole(
    createProjectRoleDto: CreateProjectRoleDto,
  ): Promise<ProjectRoleResponseDto> {
    try {
      await this.prisma.project.findUniqueOrThrow({
        where: { id: createProjectRoleDto.projectId },
      });

      await this.prisma.projectRoleType.findUniqueOrThrow({
        where: { id: createProjectRoleDto.roleTypeId },
      });

      const role = await this.prisma.projectRole.create({
        data: createProjectRoleDto,
        include: { roleType: true },
      });

      return ProjectRoleMapper.toBaseResponse(role);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project or role type not found');
      }
      throw error;
    }
  }

  public async deleteProjectRole(id: string): Promise<void> {
    const role = await this.prisma.projectRole.findUnique({
      where: { id },
      include: { roleType: true },
    });

    if (role?.roleType.roleName.toLowerCase() === 'project owner') {
      throw new MethodNotAllowedException(
        'You cannot delete the project owner role',
      );
    }

    await this.prisma.$transaction(async (prisma) => {
      try {
        const projectRole = await prisma.projectRole.delete({
          where: { id },
        });
        if (projectRole.userId) {
          await prisma.project.update({
            where: { id: projectRole.projectId },
            data: {
              participantsCount: {
                decrement: 1,
              },
            },
          });
        }
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Project role not found');
        }
        throw error;
      }
    });
  }

  private async handleUserRemovalFromProject(
    roleId: string,
    userId: string,
    returnUpdated: true,
  ): Promise<ProjectRoleWithUserResponseDto>;

  private async handleUserRemovalFromProject(
    roleId: string,
    userId: string,
    returnUpdated: false,
  ): Promise<void>;

  private async handleUserRemovalFromProject(
    roleId: string,
    userId: string,
    returnUpdated: boolean,
  ): Promise<ProjectRoleWithUserResponseDto | void> {
    return this.prisma.$transaction(async (prisma) => {
      const role = await prisma.projectRole.findFirst({
        where: {
          id: roleId,
          userId,
        },
        include: {
          user: true,
          roleType: true,
          project: true,
        },
      });

      if (!role) {
        throw new NotFoundException('User is not assigned to this role');
      }

      if (role.project.ownerId === userId) {
        if (returnUpdated) {
          throw new MethodNotAllowedException(
            'You cannot delete the project owner',
          );
        } else {
          throw new MethodNotAllowedException(
            'You cannot exit from the project',
          );
        }
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          projectRoles: {
            disconnect: { id: role.id },
          },
          activeProjectsCount: {
            decrement: 1,
          },
        },
      });

      if (user.discordId && role.project.discordMemberRoleId) {
        await this.discordService.removeRoleFromUser(
          user.discordId,
          role.project.discordMemberRoleId,
        );
      }

      try {
        const updatedRole = await prisma.projectRole.findUniqueOrThrow({
          where: { id: role.id },
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
        });

        await prisma.project.update({
          where: { id: role.projectId },
          data: {
            participantsCount: {
              decrement: 1,
            },
          },
        });

        if (returnUpdated) {
          return ProjectRoleMapper.toUserResponse(updatedRole);
        }
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Role not found');
        }
        throw error;
      }
    });
  }

  public removeUserFromProject(
    roleId: string,
    userId: string,
  ): Promise<ProjectRoleWithUserResponseDto> {
    return this.handleUserRemovalFromProject(roleId, userId, true);
  }

  public exitFromProject(roleId: string, userId: string): Promise<void> {
    return this.handleUserRemovalFromProject(roleId, userId, false);
  }
}
