import { ProjectRoleResponseDto } from './project-role.response-dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectCardResponseDto } from '../../projects/dto/project-card.response-dto';

export class ProjectRoleWithProjectResponseDto extends ProjectRoleResponseDto {
  @ApiProperty({ type: () => ProjectCardResponseDto })
  public readonly project: ProjectCardResponseDto;
}
