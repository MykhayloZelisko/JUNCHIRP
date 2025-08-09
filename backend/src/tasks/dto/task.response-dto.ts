import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';

export class TaskResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'Task name',
    description: 'Task name',
  })
  public readonly taskName: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Task description',
  })
  public readonly description: string;

  @ApiProperty({
    example: 'high',
    description: 'Task priority',
  })
  public readonly priority: TaskPriority;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Task deadline',
  })
  public readonly deadline: Date;

  @ApiProperty({
    type: () => UserCardResponseDto,
  })
  public readonly assignee: UserCardResponseDto | null;

  @ApiProperty({
    example: '6446ff53-d993-46b3-a837-25d55fac1392',
    description: 'Column (Task status) ID',
  })
  public readonly taskStatusId: string;
}
