import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskStatusesService } from './task-statuses.service';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Owner } from '../auth/decorators/owner.decorator';
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
import { TaskStatusResponseDto } from './dto/task-status.response-dto';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { User } from '../auth/decorators/user.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({
  description:
    'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
})
@Controller('task-statuses')
export class TaskStatusesController {
  public constructor(private taskStatusesService: TaskStatusesService) {}

  @Owner('body', 'boardId', 'board')
  @ApiOperation({ summary: 'Add task status' })
  @ApiCreatedResponse({ type: TaskStatusResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 5 columns on the board',
  })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiConflictResponse({
    description: 'Column name must be unique on the board',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Post('')
  public async addTaskStatus(
    @Body() createTaskStatusDto: CreateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    return this.taskStatusesService.addTaskStatus(createTaskStatusDto);
  }

  @Owner('params', 'id', 'taskStatus')
  @ApiOperation({ summary: 'Update status name' })
  @ApiOkResponse({ type: TaskStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiConflictResponse({
    description: 'Column name must be unique on the board',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateTaskStatus(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    return this.taskStatusesService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Owner('params', 'id', 'taskStatus')
  @ApiOperation({ summary: 'Delete status' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTaskStatus(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.taskStatusesService.deleteTaskStatus(id);
  }
}
