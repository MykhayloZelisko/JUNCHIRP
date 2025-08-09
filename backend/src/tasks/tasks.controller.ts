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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
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
import { Member } from '../auth/decorators/member.decorator';
import { TaskWithStatusResponseDto } from './dto/task-with-status.response-dto';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
import { User } from '../auth/decorators/user.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
export class TasksController {
  public constructor(private tasksService: TasksService) {}

  @Member('body', 'taskStatusId', 'taskStatus')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({
    description: 'Task status not found',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Post('')
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id')
  public async getTaskById(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.getTaskById(id);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateTask(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Delete task' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({
    description: 'Task or status not found',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id/status')
  public async updateTaskStatus(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateStatusTaskDto: UpdateStatusTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.updateTaskStatus(id, updateStatusTaskDto);
  }
}
