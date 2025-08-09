import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';
import { Owner } from '../auth/decorators/owner.decorator';
import { Member } from '../auth/decorators/member.decorator';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { UpdateColumnsOrderDto } from './dto/update-columns-order.dto';
import { BoardWithColumnsResponseDto } from './dto/board-with-columns.response-dto';
import { User } from '../auth/decorators/user.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('boards')
export class BoardsController {
  public constructor(private boardsService: BoardsService) {}

  @Owner('body', 'projectId', 'project')
  @ApiOperation({ summary: 'Add board' })
  @ApiCreatedResponse({ type: BoardWithColumnsResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 5 boards in the project',
  })
  @ApiConflictResponse({ description: 'Board with this name already exists' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Post('')
  public async addBoard(
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardWithColumnsResponseDto> {
    return this.boardsService.addBoard(createBoardDto);
  }

  @Member('params', 'id', 'board')
  @ApiOperation({ summary: 'Get board by id' })
  @ApiOkResponse({ type: BoardWithColumnsResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id')
  public async getBoardById(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<BoardWithColumnsResponseDto> {
    return this.boardsService.getBoardById(id);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Update board name' })
  @ApiOkResponse({ type: BoardWithColumnsResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiConflictResponse({ description: 'Board with this name already exists' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateBoard(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ): Promise<BoardWithColumnsResponseDto> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Delete board' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteBoard(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Update board columns order' })
  @ApiOkResponse({ type: BoardWithColumnsResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiBadRequestResponse({
    description: `Column with id does not belong to the board / 
                  Columns list must match existing columns exactly / 
                  Indices must not be repeated / 
                  Indices must be between 1 and max`,
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch(':id/reorder-columns')
  public async updateColumnsOrder(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateColumnsOrderDto: UpdateColumnsOrderDto,
  ): Promise<BoardWithColumnsResponseDto> {
    return this.boardsService.updateColumnsOrder(id, updateColumnsOrderDto);
  }
}
