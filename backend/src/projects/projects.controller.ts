import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UsePipes,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectCategoryResponseDto } from './dto/project-category.response-dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiMethodNotAllowedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectsListResponseDto } from './dto/projects-list.response-dto';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';
import { ProjectsFilterDto } from './dto/projects-filter.dto';
import { ProjectResponseDto } from './dto/project.response-dto';
import { Request } from 'express';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password.response-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseImageFilePipe } from '../shared/pipes/parse-image-file/parse-image-file.pipe';
import { Owner } from '../auth/decorators/owner.decorator';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { Member } from '../auth/decorators/member.decorator';
import { UserParticipationResponseDto } from '../participations/dto/user-participation.response-dto';
import { User } from '../auth/decorators/user.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('projects')
export class ProjectsController {
  public constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get array of project categories' })
  @ApiOkResponse({ type: [ProjectCategoryResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @Get('categories')
  public async getCategories(): Promise<ProjectCategoryResponseDto[]> {
    return this.projectsService.getCategories();
  }

  @ApiOperation({
    summary: 'Get list of projects with filters and pagination',
  })
  @ApiOkResponse({ type: ProjectsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @UsePipes(ValidationPipe)
  @Get('')
  public async getProjects(
    @Query() query: ProjectsFilterDto,
  ): Promise<ProjectsListResponseDto> {
    return this.projectsService.getProjects(query);
  }

  @User('discord')
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  @ApiBadRequestResponse({
    description:
      'You have reached the limit of active projects / Some role type IDs or category ID are invalid',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async createProject(
    @Req() req: Request,
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.projectsService.createProject(user.id, createProjectDto);
  }

  @Owner()
  @ApiOperation({ summary: 'Update project' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({ description: 'Project category ID not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateProject(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @Owner()
  @ApiOperation({ summary: 'Close project' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project or user in team not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch(':id/close')
  public async closeProject(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.closeProject(id);
  }

  @Member()
  @ApiOperation({ summary: 'Get project by id' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id')
  public async getProjectById(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.getProjectById(id);
  }

  @Owner()
  @ApiOperation({ summary: 'Delete project' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Project or user in team not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiMethodNotAllowedResponse({
    description: 'Cannot delete a completed project',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteProject(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

  @Owner()
  @ApiOperation({ summary: 'Update project logo' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put(':id/logo')
  public async updateProjectLogo(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @UploadedFile(ParseImageFilePipe) file: Express.Multer.File,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.updateProjectLogo(id, file);
  }

  @Owner()
  @ApiOperation({ summary: 'Delete project logo' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Delete(':id/logo')
  public async deleteProjectLogo(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.deleteProjectLogo(id);
  }

  @Member()
  @ApiOperation({
    summary: 'Get current project invites',
  })
  @ApiOkResponse({ type: [UserParticipationResponseDto] })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id/invites')
  public async getInvites(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.projectsService.getInvites(id);
  }

  @Member()
  @ApiOperation({
    summary: 'Get current project requests',
  })
  @ApiOkResponse({ type: [UserParticipationResponseDto] })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id/requests')
  public async getRequests(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.projectsService.getRequests(id);
  }
}
