import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateRequestDto } from './create-request.dto';

export class CreateInviteDto extends CreateRequestDto {
  @ApiProperty({
    example: '60868381-4593-4463-9336-75d4b4690297',
    description: 'User id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'User ID is required' })
  public readonly userId: string;
}
