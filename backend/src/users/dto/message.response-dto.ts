import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: 'message', description: 'Response message' })
  public readonly message: string;
}
