import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_GUARD_KEY, UserCheckType } from '../../decorators/user.decorator';

@Injectable()
export class UserGuard implements CanActivate {
  public constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const check: UserCheckType =
      this.reflector.get(USER_GUARD_KEY, context.getHandler()) ?? 'email';
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Access denied: email not confirmed');
    }

    if (check === 'discord' && !user.discordId) {
      throw new ForbiddenException('Access denied: discord not confirmed');
    }

    return true;
  }
}
