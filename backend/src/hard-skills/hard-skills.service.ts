import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHardSkillDto } from './dto/create-hard-skill.dto';
import { UpdateHardSkillDto } from './dto/update-hard-skill.dto';
import { HardSkillResponseDto } from './dto/hard-skill.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HardSkillMapper } from '../shared/mappers/hard-skill.mapper';

@Injectable()
export class HardSkillsService {
  public constructor(private prisma: PrismaService) {}

  public async addHardSkill(
    userId: string,
    createHardSkillDto: CreateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    const userHardSkillsCount = await this.prisma.userHardSkill.count({
      where: { userId },
    });

    if (userHardSkillsCount >= 20) {
      throw new BadRequestException('You can only add up to 20 hard skills.');
    }

    try {
      const hardSkill = await this.prisma.userHardSkill.create({
        data: {
          ...createHardSkillDto,
          userId,
        },
      });

      return HardSkillMapper.toResponse(hardSkill);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Hard skill is already in list');
      }
      throw error;
    }
  }

  public async updateHardSkill(
    id: string,
    updateHardSkillDto: UpdateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    try {
      const hardSkill = await this.prisma.userHardSkill.update({
        where: { id },
        data: {
          ...updateHardSkillDto,
        },
      });

      return HardSkillMapper.toResponse(hardSkill);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Hard skill not found');
          case 'P2002':
            throw new ConflictException('Hard skill is already in list');
          default:
            throw new InternalServerErrorException('Database error');
        }
      } else {
        throw error;
      }
    }
  }

  public async deleteHardSkill(id: string): Promise<string> {
    try {
      await this.prisma.userHardSkill.delete({
        where: { id },
      });
      return id;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Hard skill not found');
      }
      throw error;
    }
  }
}
