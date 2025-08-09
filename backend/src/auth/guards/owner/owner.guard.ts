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
export class OwnerGuard implements CanActivate {
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

    const checkOwnershipMap: Record<string, () => Promise<boolean>> = {
      project: async () =>
        !!(await this.prisma.project.findFirst({
          where: { id: resourceId, ownerId: user.id },
        })),

      document: async () =>
        !!(await this.prisma.document.findFirst({
          where: {
            id: resourceId,
            project: { ownerId: user.id },
          },
        })),

      projectRole: async () =>
        !!(await this.prisma.projectRole.findFirst({
          where: {
            id: resourceId,
            project: { ownerId: user.id },
          },
        })),

      participationRequest: async () =>
        !!(await this.prisma.participationRequest.findFirst({
          where: {
            id: resourceId,
            projectRole: { project: { ownerId: user.id } },
          },
        })),

      participationInvite: async () =>
        !!(await this.prisma.participationInvite.findFirst({
          where: {
            id: resourceId,
            projectRole: { project: { ownerId: user.id } },
          },
        })),

      board: async () =>
        !!(await this.prisma.board.findFirst({
          where: {
            id: resourceId,
            project: { ownerId: user.id },
          },
        })),

      taskStatus: async () =>
        !!(await this.prisma.taskStatus.findFirst({
          where: {
            id: resourceId,
            board: { project: { ownerId: user.id } },
          },
        })),
    };

    const check = checkOwnershipMap[model];
    if (!check) {
      throw new BadRequestException(`Unsupported model: ${model}`);
    }

    const exists = await this.resourceExists(model, resourceId);
    if (!exists) {
      throw new NotFoundException('Resource not found');
    }

    const isOwner = await check();
    if (!isOwner) {
      throw new ForbiddenException(
        'Access denied: you are not the project owner',
      );
    }

    return true;
  }

  private async resourceExists(model: string, id: string): Promise<boolean> {
    const findMap: Record<string, () => Promise<unknown>> = {
      project: () => this.prisma.project.findUnique({ where: { id } }),
      document: () => this.prisma.document.findUnique({ where: { id } }),
      projectRole: () => this.prisma.projectRole.findUnique({ where: { id } }),
      participationRequest: () =>
        this.prisma.participationRequest.findUnique({ where: { id } }),
      participationInvite: () =>
        this.prisma.participationInvite.findUnique({ where: { id } }),
      board: () => this.prisma.board.findUnique({ where: { id } }),
      taskStatus: () => this.prisma.taskStatus.findUnique({ where: { id } }),
    };

    const finder = findMap[model];
    if (!finder) {
      return false;
    }

    const result = await finder();
    return !!result;
  }
}
