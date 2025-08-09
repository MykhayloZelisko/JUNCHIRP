import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserParticipationResponseDto } from './dto/user-participation.response-dto';
import { UserParticipationMapper } from '../shared/mappers/user-participation.mapper';
import { ProjectParticipationResponseDto } from './dto/project-participation.response-dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ProjectParticipationMapper } from '../shared/mappers/project-participation.mapper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateRequestDto } from './dto/create-request.dto';
import { DiscordService } from '../discord/discord.service';
import { UserCardResponseDto } from '../users/dto/user-card.response-dto';
import { UserMapper } from '../shared/mappers/user.mapper';
import { UsersService } from '../users/users.service';

@Injectable()
export class ParticipationsService {
  public constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
    private discordService: DiscordService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  public async createInvite(
    createInviteDto: CreateInviteDto,
  ): Promise<UserParticipationResponseDto> {
    const user = await this.usersService.getUserById(createInviteDto.userId);

    if (user.activeProjectsCount === 2) {
      throw new BadRequestException(
        'User cannot have more than 2 active projects',
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const [existingParticipation, existingRequest] = await Promise.all([
        prisma.projectRole.findFirst({
          where: {
            projectId: createInviteDto.projectId,
            userId: createInviteDto.userId,
          },
        }),
        prisma.participationRequest.findFirst({
          where: {
            userId: createInviteDto.userId,
            projectRole: { projectId: createInviteDto.projectId },
          },
        }),
      ]);

      if (existingParticipation) {
        throw new ConflictException('User is already in the project team');
      }

      if (existingRequest) {
        throw new ConflictException(
          'User has already requested participation in this project',
        );
      }

      try {
        const invite = await prisma.participationInvite.create({
          data: {
            userId: createInviteDto.userId,
            projectRoleId: createInviteDto.projectRoleId,
          },
          include: {
            user: {
              include: {
                educations: { include: { specialization: true } },
              },
            },
            projectRole: {
              include: {
                roleType: true,
                project: true,
              },
            },
          },
        });

        this.mailService
          .sendParticipationInvite(
            `${this.configService.get<string>('BASE_FRONTEND_URL')}/invited-project-card`,
            invite,
          )
          .catch((err) => {
            console.error('Error sending email:', err);
          });

        return UserParticipationMapper.toResponse(invite);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2003':
              throw new NotFoundException('User or project role not found');
            case 'P2002':
              throw new ConflictException(
                'User has already been invited to this role',
              );
            default:
              throw new InternalServerErrorException('Database error');
          }
        } else {
          throw error;
        }
      }
    });
  }

  public async createRequest(
    createRequestDto: CreateRequestDto,
    userId: string,
  ): Promise<ProjectParticipationResponseDto> {
    const user = await this.usersService.getUserById(userId);

    if (user.activeProjectsCount === 2) {
      throw new BadRequestException(
        'User cannot have more than 2 active projects',
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const [existingParticipation, existingInvite] = await Promise.all([
        prisma.projectRole.findFirst({
          where: {
            projectId: createRequestDto.projectId,
            userId,
          },
        }),
        prisma.participationInvite.findFirst({
          where: {
            userId,
            projectRole: {
              projectId: createRequestDto.projectId,
            },
          },
        }),
      ]);

      if (existingParticipation) {
        throw new ConflictException('You are already in the project team');
      }

      if (existingInvite) {
        throw new ConflictException(
          'You have already been invited to this project',
        );
      }

      try {
        const request = await prisma.participationRequest.create({
          data: {
            userId,
            projectRoleId: createRequestDto.projectRoleId,
          },
          include: {
            projectRole: {
              include: {
                roleType: true,
                project: {
                  include: {
                    category: true,
                    roles: {
                      include: {
                        roleType: true,
                      },
                    },
                    owner: true,
                  },
                },
              },
            },
          },
        });

        this.mailService
          .sendParticipationRequest(
            `${this.configService.get<string>('BASE_FRONTEND_URL')}/users/${request.userId}`,
            request,
          )
          .catch((err) => {
            console.error('Error sending email:', err);
          });

        return ProjectParticipationMapper.toResponse(request);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2003':
              throw new NotFoundException('Project role not found');
            case 'P2002':
              throw new ConflictException(
                'You have already sent a request to this project',
              );
            default:
              throw new InternalServerErrorException('Database error');
          }
        } else {
          throw error;
        }
      }
    });
  }

  public async acceptInvite(
    id: string,
    userId: string,
  ): Promise<UserCardResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      try {
        const invite = await prisma.participationInvite.findUniqueOrThrow({
          where: { id, userId },
          include: {
            projectRole: {
              include: {
                project: true,
              },
            },
            user: true,
          },
        });

        if (invite.user.activeProjectsCount >= 2) {
          throw new BadRequestException(
            'User cannot have more than 2 active projects',
          );
        }

        if (invite.projectRole.userId !== null) {
          throw new ConflictException(
            'The role is already occupied by another user',
          );
        }

        await prisma.projectRole.update({
          where: { id: invite.projectRoleId },
          data: {
            user: {
              connect: { id: invite.userId },
            },
          },
        });

        await prisma.project.update({
          where: { id: invite.projectRole.projectId },
          data: {
            participantsCount: {
              increment: 1,
            },
          },
        });

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            activeProjectsCount: {
              increment: 1,
            },
          },
          include: {
            educations: {
              include: {
                specialization: true,
              },
            },
          },
        });

        await prisma.participationInvite.delete({
          where: { id },
        });

        if (invite.user?.discordId) {
          await this.discordService.addRoleToUser(
            invite.user.discordId,
            invite.projectRole.project.discordMemberRoleId,
          );
        }

        return UserMapper.toCardResponse(user);
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Invite not found');
        }
        throw error;
      }
    });
  }

  public async rejectInvite(id: string, userId: string): Promise<void> {
    try {
      await this.prisma.participationInvite.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Invite not found');
      }
      throw error;
    }
  }

  public async acceptRequest(id: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      try {
        const request = await prisma.participationRequest.findUniqueOrThrow({
          where: { id },
          include: {
            projectRole: {
              include: {
                project: true,
              },
            },
            user: true,
          },
        });

        if (request.projectRole.userId !== null) {
          throw new ConflictException(
            'The role is already occupied by another user',
          );
        }

        if (request.user.activeProjectsCount >= 2) {
          throw new BadRequestException(
            'User cannot have more than 2 active projects',
          );
        }

        await prisma.projectRole.update({
          where: { id: request.projectRoleId },
          data: {
            user: {
              connect: { id: request.userId },
            },
          },
        });

        await prisma.project.update({
          where: { id: request.projectRole.projectId },
          data: {
            participantsCount: {
              increment: 1,
            },
          },
        });

        await prisma.user.update({
          where: { id: request.userId },
          data: {
            activeProjectsCount: {
              increment: 1,
            },
          },
        });

        await prisma.participationRequest.delete({
          where: { id },
        });

        if (request.user?.discordId) {
          await this.discordService.addRoleToUser(
            request.user.discordId,
            request.projectRole.project.discordMemberRoleId,
          );
        }
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Request not found');
        }
        throw error;
      }
    });
  }

  public async rejectRequest(id: string): Promise<void> {
    try {
      await this.prisma.participationRequest.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Request not found');
      }
      throw error;
    }
  }

  public async cancelRequest(id: string, userId: string): Promise<void> {
    try {
      await this.prisma.participationRequest.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Request not found');
      }
      throw error;
    }
  }

  public async cancelInvite(id: string): Promise<void> {
    try {
      await this.prisma.participationInvite.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Invite not found');
      }
      throw error;
    }
  }

  public async getInvitesWithProjects(
    userId: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    const invites = await this.prisma.participationInvite.findMany({
      where: { userId },
      include: {
        projectRole: {
          include: {
            roleType: true,
            project: {
              include: {
                category: true,
                roles: {
                  include: {
                    roleType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return invites.map((invite) =>
      ProjectParticipationMapper.toResponse(invite),
    );
  }

  public async getRequestsWithProjects(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    const requests = await this.prisma.participationRequest.findMany({
      where: {
        userId,
        ...(ownerId && {
          projectRole: {
            project: {
              ownerId,
            },
          },
        }),
      },
      include: {
        projectRole: {
          include: {
            roleType: true,
            project: {
              include: {
                category: true,
                roles: {
                  include: {
                    roleType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return requests.map((request) =>
      ProjectParticipationMapper.toResponse(request),
    );
  }

  public async getInvitesWithUsers(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const invites = await this.prisma.participationInvite.findMany({
      where: { projectRole: { projectId } },
      include: {
        user: {
          include: {
            educations: {
              include: {
                specialization: true,
              },
            },
          },
        },
        projectRole: {
          include: {
            roleType: true,
          },
        },
      },
    });

    return invites.map((invite) => UserParticipationMapper.toResponse(invite));
  }

  public async getRequestsWithUsers(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const requests = await this.prisma.participationRequest.findMany({
      where: { projectRole: { projectId } },
      include: {
        user: {
          include: {
            educations: {
              include: {
                specialization: true,
              },
            },
          },
        },
        projectRole: {
          include: {
            roleType: true,
          },
        },
      },
    });

    return requests.map((request) =>
      UserParticipationMapper.toResponse(request),
    );
  }
}
