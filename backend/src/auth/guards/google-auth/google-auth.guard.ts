import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuidV4 } from 'uuid';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  public constructor(private redisService: RedisService) {
    super({
      accessType: 'offline',
      prompt: 'select_account',
    });
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const state = uuidV4();
    const returnUrl = request.query.returnUrl ?? '/';

    await this.redisService.set(state, JSON.stringify({ returnUrl }), 300);

    request.state = state;

    return super.canActivate(context) as Promise<boolean>;
  }

  public getAuthenticateOptions(context: ExecutionContext): {
    scope: string[];
    state: string;
  } {
    const request = context.switchToHttp().getRequest();
    return {
      scope: ['profile', 'email'],
      state: request.state,
    };
  }
}
