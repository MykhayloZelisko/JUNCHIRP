import { PickType } from '@nestjs/swagger';
import { CreateTaskStatusDto } from './create-task-status.dto';

export class UpdateTaskStatusDto extends PickType(CreateTaskStatusDto, [
  'statusName',
]) {}
