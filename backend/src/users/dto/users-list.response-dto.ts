import { ApiProperty } from '@nestjs/swagger';
import { UserCardResponseDto } from './user-card.response-dto';

export class UsersListResponseDto {
  @ApiProperty({
    example: 43,
    description: 'Total number of users',
  })
  public readonly total: number;

  @ApiProperty({ type: () => [UserCardResponseDto] })
  public readonly users: UserCardResponseDto[];
}
