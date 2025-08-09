import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { UserGuard } from '../guards/user/user.guard';

export const USER_GUARD_KEY = 'user-verify';

export type UserCheckType = 'email' | 'discord';

export const User = (
  check: UserCheckType = 'email',
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SetMetadata(USER_GUARD_KEY, check),
    Auth(),
    UseGuards(UserGuard),
  );
