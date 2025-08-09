import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class ColumnOrderItemDto {
  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Column id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'ID is required' })
  public id: string;

  @ApiProperty({
    example: 2,
    description: 'Column index on the board',
  })
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Number must be positive integer' })
  @IsNotEmpty({ message: 'Column index is required' })
  public readonly columnIndex: number;
}
