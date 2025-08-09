import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
  Req,
} from '@nestjs/common';
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';
import { Request } from 'express';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password.response-dto';
import { EducationResponseDto } from './dto/education.response-dto';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { User } from '../auth/decorators/user.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('educations')
export class EducationsController {
  public constructor(private educationsService: EducationsService) {}

  @ApiOperation({ summary: 'Get list of institution names' })
  @ApiOkResponse({ type: [String] })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed',
  })
  @Get('autocomplete')
  public async getInstitutionsAutocomplete(
    @Query('institution') query: string,
  ): Promise<string[]> {
    return this.educationsService.getInstitutionsAutocomplete(query);
  }

  @ApiOperation({ summary: 'Add education' })
  @ApiCreatedResponse({ type: EducationResponseDto })
  @ApiBadRequestResponse({
    description:
      'You can only add up to 5 educations / Specialization not found',
  })
  @ApiConflictResponse({ description: 'Education is already in list' })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Post('')
  public async addEducation(
    @Req() req: Request,
    @Body() createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.educationsService.addEducation(user.id, createEducationDto);
  }

  @ApiOperation({ summary: 'Update education' })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiNotFoundResponse({ description: 'Education not found' })
  @ApiConflictResponse({ description: 'Education is already in list' })
  @ApiBadRequestResponse({ description: 'Specialization not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @Put(':id')
  public async updateEducation(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.educationsService.updateEducation(id, updateEducationDto);
  }

  @ApiOperation({ summary: 'Delete education' })
  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse({ description: 'Education not found' })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Delete(':id')
  public async deleteEducation(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<string> {
    return this.educationsService.deleteEducation(id);
  }
}
