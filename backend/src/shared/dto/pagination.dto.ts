import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Minimum allowable value is 1' })
  public readonly page?: number = 1;

  @ApiProperty({
    example: 20,
    description: 'Number of elements per page',
    default: 20,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  @Min(5, { message: 'Minimum allowable value is 5' })
  public readonly limit?: number = 5;
}
