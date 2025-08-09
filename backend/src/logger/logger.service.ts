import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoggerService {
  public constructor(private prisma: PrismaService) {}

  public async log(
    ip: string,
    email: string,
    eventType: string,
    details: string,
  ): Promise<void> {
    await this.prisma.logEvent.create({
      data: { ip, email, eventType, details },
    });
  }
}
