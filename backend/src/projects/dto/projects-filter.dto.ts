import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { IsIn, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class ProjectsFilterDto extends PaginationDto {
  @ApiProperty({
    example: 'active',
    description: 'Project status',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'done'], { message: 'Value must be "active" or "done"' })
  public readonly status?: ProjectStatus;

  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Category identifier',
    required: false,
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsOptional()
  public readonly categoryId?: string;

  @ApiProperty({
    example: 2,
    description: 'Minimal number of participants',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Minimum allowable value is 1' })
  public readonly minParticipants?: number;

  @ApiProperty({
    example: 12,
    description: 'Maximal number of participants',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Minimum allowable value is 1' })
  public readonly maxParticipants?: number;
}
