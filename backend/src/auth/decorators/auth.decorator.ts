import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

export const Auth = (): MethodDecorator & ClassDecorator =>
  applyDecorators(UseGuards(JwtAuthGuard));
