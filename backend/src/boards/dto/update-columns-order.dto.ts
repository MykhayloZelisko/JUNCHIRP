import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ColumnOrderItemDto } from './column-order-item.dto';

export class UpdateColumnsOrderDto {
  @ApiProperty({
    description: 'Array of columns with new order',
    type: [ColumnOrderItemDto],
  })
  @IsArray({ message: 'Columns must be an array' })
  @ArrayNotEmpty({ message: 'Columns array must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => ColumnOrderItemDto)
  public columns: ColumnOrderItemDto[];
}
