import { ApiProperty } from '@nestjs/swagger';
import { ProjectCardResponseDto } from './project-card.response-dto';

export class ProjectsListResponseDto {
  @ApiProperty({
    example: 43,
    description: 'Total number of projects',
  })
  public readonly total: number;

  @ApiProperty({ type: () => [ProjectCardResponseDto] })
  public readonly projects: ProjectCardResponseDto[];
}
