import { ApiProperty } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'Document name',
    description: 'Document name',
  })
  public readonly documentName: string;

  @ApiProperty({
    example: 'https://document.url',
    description: 'Document url',
  })
  public readonly url: string;
}
