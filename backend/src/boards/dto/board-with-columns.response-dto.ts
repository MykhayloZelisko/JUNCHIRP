import { BoardResponseDto } from './board.response-dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusResponseDto } from '../../task-statuses/dto/task-status.response-dto';

export class BoardWithColumnsResponseDto extends BoardResponseDto {
  @ApiProperty({ type: () => [TaskStatusResponseDto] })
  public readonly columns: TaskStatusResponseDto[];
}
