import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTaskStatusDto {
  @ApiProperty({ example: 'To Do', description: 'Status name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Document name is required' })
  public readonly statusName: string;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Board id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Board ID is required' })
  public readonly boardId: string;
}
