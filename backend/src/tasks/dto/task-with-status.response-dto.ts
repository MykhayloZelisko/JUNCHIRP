import { TaskResponseDto } from './task.response-dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TaskStatusResponseDto } from '../../task-statuses/dto/task-status.response-dto';

export class TaskWithStatusResponseDto extends OmitType(TaskResponseDto, [
  'taskStatusId',
]) {
  @ApiProperty({
    type: () => TaskStatusResponseDto,
  })
  public readonly taskStatus: TaskStatusResponseDto;
}
