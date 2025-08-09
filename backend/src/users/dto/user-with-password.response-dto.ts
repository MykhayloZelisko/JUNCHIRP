import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.response-dto';

export class UserWithPasswordResponseDto extends UserResponseDto {
  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  public readonly password: string;
}
