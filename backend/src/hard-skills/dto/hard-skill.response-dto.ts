import { ApiProperty } from '@nestjs/swagger';

export class HardSkillResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'TypeScript',
    description: 'Hard skill name',
  })
  public readonly hardSkillName: string;
}
