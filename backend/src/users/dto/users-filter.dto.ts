import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { IsArray, IsIn, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UsersFilterDto extends PaginationDto {
  @ApiProperty({
    example: 2,
    description: 'Number of active projects',
    required: false,
  })
  @IsOptional()
  @IsIn([0, 1, 2], { message: 'Value must be 0, 1 or 2' })
  public readonly activeProjectsCount?: number;

  @ApiProperty({
    example: ['a4d4eb0c-1a10-455e-b9e9-1af147a77762'],
    description: 'Specialization identifiers array',
    required: false,
    type: [String],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    return [value];
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format', each: true })
  @IsArray({ message: 'Must be an array of string in UUIDv4 format' })
  @IsOptional()
  public readonly specializationIds?: string[];
}
