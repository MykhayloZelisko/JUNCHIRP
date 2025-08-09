import { ApiProperty } from '@nestjs/swagger';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';
import { ProjectRoleResponseDto } from '../../project-roles/dto/project-role.response-dto';

export class UserParticipationResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({ type: () => UserCardResponseDto })
  public readonly user: UserCardResponseDto;

  @ApiProperty({ type: () => ProjectRoleResponseDto })
  public readonly projectRole: ProjectRoleResponseDto;
}
