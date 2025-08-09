import { ApiProperty } from '@nestjs/swagger';

export class CsrfTokenResponseDto {
  @ApiProperty({ example: 'token', description: 'CSRF token' })
  public readonly csrfToken: string;
}
