import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Req,
  Put,
} from '@nestjs/common';
import { SoftSkillsService } from './soft-skills.service';
import { CreateSoftSkillDto } from './dto/create-soft-skill.dto';
import { UpdateSoftSkillDto } from './dto/update-soft-skill.dto';
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
import { SoftSkillResponseDto } from './dto/soft-skill.response-dto';
import { ParseUUIDv4Pipe } from '../shared/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { User } from '../auth/decorators/user.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({
  description: 'Access denied: email not confirmed / Invalid CSRF token',
})
@Controller('soft-skills')
export class SoftSkillsController {
  public constructor(private softSkillsService: SoftSkillsService) {}

  @ApiOperation({ summary: 'Add soft skill' })
  @ApiCreatedResponse({ type: SoftSkillResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 20 soft skills',
  })
  @ApiConflictResponse({ description: 'Soft skill is already in list' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @UsePipes(ValidationPipe)
  @Post('')
  public async addSoftSkill(
    @Req() req: Request,
    @Body() createSoftSkillDto: CreateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.softSkillsService.addSoftSkill(user.id, createSoftSkillDto);
  }

  @ApiOperation({ summary: 'Update soft skill' })
  @ApiOkResponse({ type: SoftSkillResponseDto })
  @ApiNotFoundResponse({ description: 'Soft skill not found' })
  @ApiConflictResponse({ description: 'Soft skill is already in list' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateSoftSkill(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateSoftSkillDto: UpdateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    return this.softSkillsService.updateSoftSkill(id, updateSoftSkillDto);
  }

  @ApiOperation({ summary: 'Delete soft skill' })
  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse({ description: 'Soft skill not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Delete(':id')
  public async deleteSoftSkill(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<string> {
    return this.softSkillsService.deleteSoftSkill(id);
  }
}
