import { UserHardSkill } from '@prisma/client';
import { HardSkillResponseDto } from '../../hard-skills/dto/hard-skill.response-dto';

export class HardSkillMapper {
  public static toResponse(skill: UserHardSkill): HardSkillResponseDto {
    return {
      id: skill.id,
      hardSkillName: skill.hardSkillName,
    };
  }
}
