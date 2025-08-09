import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Board name', description: 'Board name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @IsNotEmpty({ message: 'Board name is required' })
  public readonly boardName: string;

  @ApiProperty({
    example: '47989942-0d09-4834-90c4-3c2954f46d73',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'ID is required' })
  public readonly projectId: string;
}
