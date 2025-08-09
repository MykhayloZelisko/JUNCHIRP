import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectRoleDto {
  @ApiProperty({
    example: '47989942-0d09-4834-90c4-3c2954f46d73',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'ID is required' })
  public readonly projectId: string;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Role type id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'ID is required' })
  public readonly roleTypeId: string;
}
