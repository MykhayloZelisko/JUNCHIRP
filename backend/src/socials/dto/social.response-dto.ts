import { ApiProperty } from '@nestjs/swagger';

export class SocialResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'LinkedIn',
    description: 'Social network name',
  })
  public readonly network: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/user-125478',
    description: 'Profile url',
  })
  public readonly url: string;
}
