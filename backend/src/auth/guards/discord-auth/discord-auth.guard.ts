import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuidV4 } from 'uuid';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  public constructor(private redisService: RedisService) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const state = uuidV4();
    const returnUrl = request.query.returnUrl ?? '/';

    await this.redisService.set(
      state,
      JSON.stringify({ userId: user.id, returnUrl }),
      300,
    );

    request.state = state;

    return super.canActivate(context) as Promise<boolean>;
  }

  public getAuthenticateOptions(context: ExecutionContext): {
    scope: string[];
    state: string;
  } {
    const request = context.switchToHttp().getRequest();
    return {
      scope: ['identify', 'guilds.join'],
      state: request.state,
    };
  }
}
