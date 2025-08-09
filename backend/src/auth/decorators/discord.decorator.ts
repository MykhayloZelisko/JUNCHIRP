import { applyDecorators, UseGuards } from '@nestjs/common';
import { User } from './user.decorator';
import { DiscordAuthGuard } from '../guards/discord-auth/discord-auth.guard';

export const Discord = (): MethodDecorator & ClassDecorator =>
  applyDecorators(User(), UseGuards(DiscordAuthGuard));
