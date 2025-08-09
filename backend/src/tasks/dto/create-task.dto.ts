import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../../shared/validators/is-future-date.validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task name', description: 'Task name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 100, { message: 'Must be between 2 and 100 characters' })
  @IsNotEmpty({ message: 'Task name is required' })
  public readonly taskName: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Task description',
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 1000, { message: 'Must be between 2 and 1000 characters' })
  @IsNotEmpty({ message: 'Task description is required' })
  public readonly description: string;

  @ApiProperty({
    example: 'high',
    description: 'Task priority',
  })
  @IsIn(['high', 'normal', 'low'], {
    message: 'Value must be "high", "normal" or "low"',
  })
  @IsNotEmpty({ message: 'Task priority is required' })
  public readonly priority: TaskPriority;

  @ApiProperty({
    example: '2025-04-11T11:51:05.224',
    description: 'Task deadline',
  })
  @IsDate({ message: 'Must be a valid date' })
  @IsFutureDate()
  @IsNotEmpty({ message: 'Task deadline is required' })
  @Type(() => Date)
  public readonly deadline: Date;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Task status id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Column id ID is required' })
  public readonly taskStatusId: string;
}
