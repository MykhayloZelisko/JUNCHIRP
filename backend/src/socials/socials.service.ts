import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { SocialResponseDto } from './dto/social.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SocialMapper } from '../shared/mappers/social.mapper';

@Injectable()
export class SocialsService {
  public constructor(private prisma: PrismaService) {}

  public async addSocialNetwork(
    userId: string,
    createSocialDto: CreateSocialDto,
  ): Promise<SocialResponseDto> {
    const userProfilesCount = await this.prisma.social.count({
      where: { userId },
    });

    if (userProfilesCount >= 5) {
      throw new BadRequestException(
        'You can only add up to 5 social networks.',
      );
    }

    try {
      const social = await this.prisma.social.create({
        data: { ...createSocialDto, userId },
      });

      return SocialMapper.toResponse(social);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You have already added a profile in this social network',
        );
      }
      throw error;
    }
  }

  public async updateSocialNetwork(
    id: string,
    updateSocialDto: UpdateSocialDto,
  ): Promise<SocialResponseDto> {
    try {
      const social = await this.prisma.social.update({
        where: { id },
        data: {
          ...updateSocialDto,
        },
      });

      return SocialMapper.toResponse(social);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Profile not found');
          case 'P2002':
            throw new ConflictException(
              'Profile with this network already exists',
            );
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteSocialNetwork(id: string): Promise<string> {
    try {
      await this.prisma.social.delete({
        where: { id },
      });
      return id;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Profile not found');
      }
      throw error;
    }
  }
}
