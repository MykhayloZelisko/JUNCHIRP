import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailService } from '../mail/mail.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';

@Injectable()
export class SupportService {
  public constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  public async createSupportRequest(
    createSupportDto: CreateSupportDto,
  ): Promise<MessageResponseDto> {
    try {
      const request = await this.prisma.supportRequest.create({
        data: createSupportDto,
      });

      this.mailService.sendSupportRequest(request).catch((err) => {
        console.error('Error sending email:', err);
      });

      return {
        message: 'Support request created successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error');
      }
      throw error;
    }
  }
}
