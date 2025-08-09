import { ApiProperty } from '@nestjs/swagger';
import { ProjectRoleWithProjectResponseDto } from '../../project-roles/dto/project-role-with-project.response-dto';

export class ProjectParticipationResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly userId: string;

  @ApiProperty({ type: () => ProjectRoleWithProjectResponseDto })
  public readonly projectRole: ProjectRoleWithProjectResponseDto;
}
