import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI') as string,
      scope: ['email', 'profile'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<unknown> {
    const { id, name, emails, photos } = profile;

    return {
      googleId: id,
      email: emails ? emails[0].value : '',
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      picture: photos ? photos[0].value : '',
      accessToken,
      refreshToken,
    };
  }
}
