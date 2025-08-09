import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSoftSkillDto } from './dto/create-soft-skill.dto';
import { UpdateSoftSkillDto } from './dto/update-soft-skill.dto';
import { SoftSkillResponseDto } from './dto/soft-skill.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SoftSkillMapper } from '../shared/mappers/soft-skill.mapper';

@Injectable()
export class SoftSkillsService {
  public constructor(private prisma: PrismaService) {}

  public async addSoftSkill(
    userId: string,
    createSoftSkillDto: CreateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    const userSoftSkillsCount = await this.prisma.userSoftSkill.count({
      where: { userId },
    });

    if (userSoftSkillsCount >= 20) {
      throw new BadRequestException('You can only add up to 20 soft skills.');
    }

    try {
      const softSkill = await this.prisma.userSoftSkill.create({
        data: {
          ...createSoftSkillDto,
          userId,
        },
      });

      return SoftSkillMapper.toResponse(softSkill);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Soft skill is already in list');
      }
      throw error;
    }
  }

  public async updateSoftSkill(
    id: string,
    updateSoftSkillDto: UpdateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    try {
      const softSkill = await this.prisma.userSoftSkill.update({
        where: { id },
        data: {
          ...updateSoftSkillDto,
        },
      });

      return SoftSkillMapper.toResponse(softSkill);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Soft skill not found');
          case 'P2002':
            throw new ConflictException('Soft skill is already in list');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteSoftSkill(id: string): Promise<string> {
    try {
      await this.prisma.userSoftSkill.delete({
        where: { id },
      });
      return id;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Soft skill not found');
      }
      throw error;
    }
  }
}
