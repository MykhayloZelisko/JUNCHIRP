import { UserSoftSkill } from '@prisma/client';
import { SoftSkillResponseDto } from '../../soft-skills/dto/soft-skill.response-dto';

export class SoftSkillMapper {
  public static toResponse(skill: UserSoftSkill): SoftSkillResponseDto {
    return {
      id: skill.id,
      softSkillName: skill.softSkillName,
    };
  }
}
