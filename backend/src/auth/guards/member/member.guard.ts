import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import {
  MODEL_KEY,
  PROJECT_ID_KEY_KEY,
  PROJECT_ID_SOURCE_KEY,
} from '../../../shared/constants/owner-member-metadata';

@Injectable()
export class MemberGuard implements CanActivate {
  public constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const source: 'params' | 'body' | 'query' =
      this.reflector.get(PROJECT_ID_SOURCE_KEY, context.getHandler()) ??
      'params';
    const key: string =
      this.reflector.get(PROJECT_ID_KEY_KEY, context.getHandler()) ?? 'id';
    const model: string =
      this.reflector.get(MODEL_KEY, context.getHandler()) ?? 'project';

    const container = request[source];
    const resourceId = container?.[key];

    if (!resourceId) {
      throw new BadRequestException(`Missing resource ID in ${source}.${key}`);
    }

    const checkMembershipMap: Record<string, () => Promise<boolean>> = {
      project: async () =>
        !!(await this.prisma.project.findFirst({
          where: {
            id: resourceId,
            roles: {
              some: {
                userId: user.id,
              },
            },
          },
        })),

      board: async () =>
        !!(await this.prisma.board.findFirst({
          where: {
            id: resourceId,
            project: {
              roles: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
        })),

      task: async () =>
        !!(await this.prisma.task.findFirst({
          where: {
            id: resourceId,
            taskStatus: {
              board: {
                project: {
                  roles: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
              },
            },
          },
        })),

      taskStatus: async () =>
        !!(await this.prisma.taskStatus.findFirst({
          where: {
            id: resourceId,
            board: {
              project: {
                roles: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        })),

      projectRole: async () =>
        !!(await this.prisma.projectRole.findFirst({
          where: {
            id: resourceId,
            userId: user.id,
          },
        })),
    };

    const check = checkMembershipMap[model];
    if (!check) {
      throw new BadRequestException(`Unsupported model: ${model}`);
    }

    const exists = await this.resourceExists(model, resourceId);
    if (!exists) {
      throw new NotFoundException(`Resource not found`);
    }

    const isParticipant = await check();
    if (!isParticipant) {
      throw new ForbiddenException(
        'Access denied: you are not a participant of this project',
      );
    }

    return true;
  }

  private async resourceExists(model: string, id: string): Promise<boolean> {
    const findMap: Record<string, () => Promise<unknown>> = {
      project: () => this.prisma.project.findUnique({ where: { id } }),
      board: () => this.prisma.board.findUnique({ where: { id } }),
      task: () => this.prisma.task.findUnique({ where: { id } }),
      taskStatus: () => this.prisma.taskStatus.findUnique({ where: { id } }),
      projectRole: () => this.prisma.projectRole.findUnique({ where: { id } }),
    };

    const finder = findMap[model];
    if (!finder) {
      return false;
    }

    const result = await finder();
    return !!result;
  }
}
