import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    example: '762140ef-5c57-4209-bdb8-d3764e6b95f9',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Project ID is required' })
  public readonly projectId: string;

  @ApiProperty({
    example: '283816d8-c5f3-45c4-b757-bd1f0357fcc1',
    description: 'Project role id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Project role ID is required' })
  public readonly projectRoleId: string;
}
