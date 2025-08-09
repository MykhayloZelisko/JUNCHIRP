import { ApiProperty } from '@nestjs/swagger';
import { ProjectRoleTypeResponseDto } from './project-role-type.response-dto';

export class ProjectRoleResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({ type: () => ProjectRoleTypeResponseDto })
  public readonly roleType: ProjectRoleTypeResponseDto;
}
