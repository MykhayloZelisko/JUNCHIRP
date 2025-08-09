import { PickType } from '@nestjs/swagger';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PickType(CreateBoardDto, ['boardName']) {}
