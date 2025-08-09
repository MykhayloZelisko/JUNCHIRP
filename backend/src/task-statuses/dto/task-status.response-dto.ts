import { ApiProperty } from '@nestjs/swagger';

export class TaskStatusResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({ example: 'To Do', description: 'Status name' })
  public readonly statusName: string;

  @ApiProperty({
    example: 2,
    description: 'Column index on the board',
  })
  public readonly columnIndex: number;

  @ApiProperty({
    example: '6446ff53-d993-46b3-a837-25d55fac1392',
    description: 'Board ID',
  })
  public readonly boardId: string;
}
