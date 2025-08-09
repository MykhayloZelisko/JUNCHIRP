import { PickType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateStatusTaskDto extends PickType(CreateTaskDto, [
  'taskStatusId',
]) {}
