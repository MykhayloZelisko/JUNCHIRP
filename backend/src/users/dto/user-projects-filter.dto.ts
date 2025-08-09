import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { IsIn, IsOptional } from 'class-validator';

export class UserProjectsFilterDto extends PaginationDto {
  @ApiProperty({
    example: 'active',
    description: 'Project status',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'done'], { message: 'Value must be "active" or "done"' })
  public readonly status?: ProjectStatus;
}
