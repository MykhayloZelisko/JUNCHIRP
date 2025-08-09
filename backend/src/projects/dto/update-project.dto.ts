import { PickType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PickType(CreateProjectDto, [
  'projectName',
  'description',
  'categoryId',
]) {}
