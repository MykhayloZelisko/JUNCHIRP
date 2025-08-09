import { OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends OmitType(CreateTaskDto, ['taskStatusId']) {}
