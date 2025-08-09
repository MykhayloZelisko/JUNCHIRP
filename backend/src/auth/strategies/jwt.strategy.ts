import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { UserResponseDto } from '../../users/dto/user.response-dto';
import { RedisService } from '../../redis/redis.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => req.cookies?.['accessToken'],
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    { id }: { id: string },
  ): Promise<UserResponseDto> {
    const accessToken = req.cookies?.['accessToken'];
    const isBlacklisted = await this.redisService.isBlacklisted(accessToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is invalid');
    }

    return await this.userService.getUserById(id);
  }
}
