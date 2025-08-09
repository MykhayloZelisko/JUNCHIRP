import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  public constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID') as string,
      clientSecret: configService.get<string>(
        'DISCORD_CLIENT_SECRET',
      ) as string,
      callbackURL: configService.get<string>('DISCORD_REDIRECT_URL') as string,
      scope: ['identify', 'guilds.join'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<unknown> {
    return {
      discordId: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      accessToken,
      refreshToken,
    };
  }
}
