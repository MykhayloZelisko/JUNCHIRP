import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class RolesService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findOrCreateRole(
    roleName: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    > = this.prisma,
  ): Promise<Role> {
    return prisma.role.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    });
  }
}
