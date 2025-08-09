import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MessageResponseDto } from './dto/message.response-dto';
import { EmailDto } from './dto/email.dto';
import { UserResponseDto } from './dto/user.response-dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';
import { Request, Response } from 'express';
import { UserWithPasswordResponseDto } from './dto/user-with-password.response-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProjectsListResponseDto } from '../projects/dto/projects-list.response-dto';
import { UserProjectsFilterDto } from './dto/user-projects-filter.dto';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { UsersFilterDto } from './dto/users-filter.dto';
import { ProjectParticipationResponseDto } from '../participations/dto/project-participation.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { EmailValidationResponseDto } from './dto/email-validation.response-dto';
import { TokenValidationResponseDto } from './dto/token-validation.response-dto';

@Controller('users')
export class UsersController {
  public constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Send confirmation email' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiBadRequestResponse({ description: 'Email is confirmed' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('send-confirmation-email')
  public async sendConfirmationEmail(
    @Ip() ip: string,
    @Body() body: EmailDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.sendVerificationUrl(ip, body.email);
  }

  @ApiOperation({ summary: 'Confirm email' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse({
    description:
      'Invalid or expired verification token / Email does not match token',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('confirm')
  public async confirmEmail(
    @Ip() ip: string,
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    return this.usersService.confirmEmail(ip, confirmEmailDto, req, res);
  }

  @Auth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  public async getCurrentUser(@Req() req: Request): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ summary: 'Check email' })
  @ApiOkResponse({ type: EmailValidationResponseDto })
  @Get('check-email')
  public async checkEmailAvailable(
    @Query('email') email: string,
  ): Promise<EmailValidationResponseDto> {
    return this.usersService.checkEmailAvailable(email);
  }

  @ApiOperation({ summary: 'Password recovery token verification' })
  @ApiOkResponse({ type: TokenValidationResponseDto })
  @Get('validate-password-token')
  public async validateToken(
    @Query('token') token: string,
  ): Promise<TokenValidationResponseDto> {
    return this.usersService.validateToken(token);
  }

  @ApiOperation({ summary: 'Send email to reset your password' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('request-password-reset')
  public async sendPasswordResetUrl(
    @Ip() ip: string,
    @Body() body: EmailDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.sendPasswordResetUrl(ip, body.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('reset-password')
  public async resetPassword(
    @Ip() ip: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.resetPassword(ip, resetPasswordDto);
  }

  @Auth()
  @ApiOperation({
    summary: 'Update current user (first name, last name, email)',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'Email is already in use' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Patch('me')
  public async updateUser(
    @Req() req: Request,
    @Ip() ip: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.updateUser(user.id, ip, updateUserDto);
  }

  @User()
  @ApiOperation({
    summary: 'Get projects of current user',
  })
  @ApiOkResponse({ type: ProjectsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UsePipes(ValidationPipe)
  @Get('me/projects')
  public async getMyProjects(
    @Req() req: Request,
    @Query() query: UserProjectsFilterDto,
  ): Promise<ProjectsListResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.getUserProjects(
      user.id,
      query.page,
      query.limit,
      query.status,
    );
  }

  @User()
  @ApiOperation({
    summary: 'Get user projects',
  })
  @ApiOkResponse({ type: ProjectsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id/projects')
  public async getUserProjects(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Query(ValidationPipe) query: UserProjectsFilterDto,
  ): Promise<ProjectsListResponseDto> {
    return this.usersService.getUserProjects(
      id,
      query.page,
      query.limit,
      query.status,
    );
  }

  @User()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  public async getUserById(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.getUserById(id);
  }

  @User()
  @ApiOperation({
    summary: 'Get list of users with filters and pagination',
  })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UsePipes(ValidationPipe)
  @Get('')
  public async getUsers(
    @Query() query: UsersFilterDto,
  ): Promise<UsersListResponseDto> {
    return this.usersService.getUsers(query);
  }

  @User()
  @ApiOperation({
    summary: 'Get current user invites',
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/invites')
  public async getInvites(
    @Req() req: Request,
  ): Promise<ProjectParticipationResponseDto[]> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.getInvites(user.id);
  }

  @User()
  @ApiOperation({
    summary: 'Get current user requests',
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/requests')
  public async getRequests(
    @Req() req: Request,
  ): Promise<ProjectParticipationResponseDto[]> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.getRequests(user.id);
  }

  @ApiOperation({ summary: 'Delete password recovery token' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Token not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('password-token')
  public async deletePasswordToken(
    @Query('token') token: string,
  ): Promise<void> {
    return this.usersService.cancelResetPassword(token);
  }

  @User()
  @ApiOperation({
    summary: `Get requests by user id in current user's projects`,
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id/requests')
  public async getRequestsByUserId(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Req() req: Request,
  ): Promise<ProjectParticipationResponseDto[]> {
    const owner: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.usersService.getRequests(id, owner.id);
  }
}
