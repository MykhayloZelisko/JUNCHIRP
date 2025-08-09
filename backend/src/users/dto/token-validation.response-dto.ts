import { ApiProperty } from '@nestjs/swagger';

export class TokenValidationResponseDto {
  @ApiProperty({ example: true, description: 'Token is valid' })
  public readonly isValid: boolean;

  @ApiProperty({
    required: false,
    example: 'John',
    description: 'User first name',
  })
  public readonly firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: 'User last name',
  })
  public readonly lastName?: string;
}
