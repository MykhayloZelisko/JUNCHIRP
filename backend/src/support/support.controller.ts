import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';

@Controller('support')
export class SupportController {
  public constructor(private supportService: SupportService) {}

  @ApiOperation({ summary: 'Create support request' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('')
  public async updateTaskStatus(
    @Body(ValidationPipe) createSupportDto: CreateSupportDto,
  ): Promise<MessageResponseDto> {
    return this.supportService.createSupportRequest(createSupportDto);
  }
}
