import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from '../../roles/dto/role.response-dto';
import { SocialResponseDto } from '../../socials/dto/social.response-dto';
import { SoftSkillResponseDto } from '../../soft-skills/dto/soft-skill.response-dto';
import { HardSkillResponseDto } from '../../hard-skills/dto/hard-skill.response-dto';
import { UserCardResponseDto } from './user-card.response-dto';

export class UserResponseDto extends UserCardResponseDto {
  @ApiProperty({
    example: '113273902301932041645',
    description: 'Google identifier',
    type: String,
  })
  public readonly googleId: string | null;

  @ApiProperty({
    example: '113273902301932041645',
    description: 'Discord identifier',
    type: String,
  })
  public readonly discordId: string | null;

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  public readonly email: string;

  @ApiProperty({ example: false, description: `Is user's email verified?` })
  public readonly isVerified: boolean;

  @ApiProperty({ type: () => RoleResponseDto })
  public readonly role: RoleResponseDto;

  @ApiProperty({ type: () => [SocialResponseDto] })
  public readonly socials: SocialResponseDto[];

  @ApiProperty({ type: () => [SoftSkillResponseDto] })
  public readonly softSkills: SoftSkillResponseDto[];

  @ApiProperty({ type: () => [HardSkillResponseDto] })
  public readonly hardSkills: HardSkillResponseDto[];
}
