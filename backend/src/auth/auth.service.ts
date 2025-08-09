import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserResponseDto } from '../users/dto/user.response-dto';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password.response-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TooManyRequestsException } from '../shared/exceptions/too-many-requests.exception';
import { RedisService } from '../redis/redis.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import { LoggerService } from '../logger/logger.service';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class AuthService {
  private EXPIRE_DAY_REFRESH_TOKEN = 7;

  private REFRESH_TOKEN_NAME = 'refreshToken';

  private ACCESS_TOKEN_NAME = 'accessToken';

  public constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
    private loggerService: LoggerService,
    private discordService: DiscordService,
  ) {}

  public async validateUser(
    req: Request,
    loginDto: LoginDto,
  ): Promise<UserResponseDto> {
    const user = (await this.usersService.getUserByEmail(
      loginDto.email,
      true,
    )) as UserWithPasswordResponseDto | null;
    const ip =
      req.ip ??
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ??
      req.socket.remoteAddress;

    if (!user) {
      await this.loggerService.log(
        ip ?? 'unknown',
        loginDto.email,
        'login',
        'Email or password is incorrect',
      );
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const loginAttempt = await this.prisma.loginAttempt.findUnique({
      where: { userId: user.id },
    });

    if (loginAttempt) {
      const now = new Date();
      if (loginAttempt.blockedUntil && now < loginAttempt.blockedUntil) {
        await this.loggerService.log(
          ip ?? 'unknown',
          loginDto.email,
          'login',
          'Too many failed attempts. Please try again later',
        );
        throw new TooManyRequestsException(
          'Too many failed attempts. Please try again later',
          loginAttempt.attemptsCount,
        );
      }
    }

    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (passwordEquals) {
      if (loginAttempt) {
        await this.prisma.loginAttempt.delete({
          where: { userId: user.id },
        });
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      if (loginAttempt) {
        const updateData: {
          attemptsCount: number;
          blockedUntil?: Date;
        } = {
          attemptsCount: loginAttempt.attemptsCount + 1,
        };

        if (loginAttempt.attemptsCount + 1 >= 5 && !loginAttempt.blockedUntil) {
          updateData.blockedUntil = new Date(
            new Date().getTime() + 15 * 60 * 1000,
          );
        }

        if (
          loginAttempt.attemptsCount + 1 >= 10 &&
          !loginAttempt.blockedUntil
        ) {
          updateData.blockedUntil = new Date(
            new Date().getTime() + 60 * 60 * 1000,
          );
        }

        if (
          loginAttempt.attemptsCount + 1 >= 15 &&
          !loginAttempt.blockedUntil
        ) {
          updateData.blockedUntil = new Date(
            new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
          );
        }

        await this.prisma.loginAttempt.update({
          where: { userId: user.id },
          data: updateData,
        });

        if ([5, 10, 15].includes(updateData.attemptsCount)) {
          await this.loggerService.log(
            ip ?? 'unknown',
            loginDto.email,
            'login',
            'Too many failed attempts. Please try again later',
          );
          throw new TooManyRequestsException(
            'Too many failed attempts. Please try again later',
            updateData.attemptsCount,
          );
        }
      } else {
        await this.prisma.loginAttempt.create({
          data: {
            userId: user.id,
            attemptsCount: 1,
          },
        });
      }

      await this.loggerService.log(
        ip ?? 'unknown',
        loginDto.email,
        'login',
        'Email or password is incorrect',
      );
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }

  public async login(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    const { accessToken, refreshToken } = this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
    const { password, ...userWithoutPassword } = user;

    await this.loggerService.log(
      ip,
      user.email,
      'login',
      'User login successfully',
    );

    return userWithoutPassword;
  }

  public async registration(
    createUserDto: CreateUserDto,
    ip: string,
    res: Response,
  ): Promise<UserResponseDto> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.createUser(
      {
        ...createUserDto,
        password: hashPassword,
      },
      ip,
    );

    await this.loggerService.log(
      ip,
      createUserDto.email,
      'registration',
      'User registered successfully',
    );

    const { accessToken, refreshToken } = this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
    const record = await this.usersService.createVerificationUrl(
      ip,
      createUserDto.email,
    );
    const params = new URLSearchParams({
      token: record.token,
      email: createUserDto.email,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

    this.mailService
      .sendVerificationMail(createUserDto.email, url)
      .catch((err) => {
        console.error('Error sending verification url:', err);
      });

    return user;
  }

  public createAccessToken(userId: string): string {
    const data = { id: userId };

    return this.jwtService.sign(data, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('EXPIRE_TIME_ACCESS_TOKEN'),
    });
  }

  public createRefreshToken(userId: string): string {
    const data = { id: userId };

    return this.jwtService.sign(data, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
    });
  }

  public createTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.createAccessToken(userId);
    const refreshToken = this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  public addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  public addAccessTokenToResponse(res: Response, accessToken: string): void {
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 15);

    res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  public validateRefreshToken(refreshToken: string): string {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      return payload.id;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public regenerateAccessToken(req: Request, res: Response): void {
    const refreshToken = req.cookies['refreshToken'];
    const userId = this.validateRefreshToken(refreshToken);
    const newAccessToken = this.createAccessToken(userId);
    this.addAccessTokenToResponse(res, newAccessToken);
  }

  public async clearTokens(
    accessToken: string | undefined,
    refreshToken: string | undefined,
    res: Response,
  ): Promise<void> {
    try {
      if (accessToken) {
        const accessPayload = this.jwtService.decode(accessToken) as {
          exp?: number;
        } | null;
        const accessExp = accessPayload?.exp;
        const now = Math.floor(Date.now() / 1000);

        if (accessExp && accessExp > now) {
          await this.redisService.addToBlacklist(accessToken, accessExp - now);
        }
      }

      if (refreshToken) {
        const refreshPayload = this.jwtService.decode(refreshToken) as {
          exp?: number;
        } | null;
        const refreshExp = refreshPayload?.exp;
        const now = Math.floor(Date.now() / 1000);

        if (refreshExp && refreshExp > now) {
          await this.redisService.addToBlacklist(
            refreshToken,
            refreshExp - now,
          );
        }
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    } catch {
      return;
    }
  }

  public async logout(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<MessageResponseDto> {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    const user = req.user as UserResponseDto;

    try {
      await this.clearTokens(accessToken, refreshToken, res);

      await this.loggerService.log(
        ip,
        user.email,
        'logout',
        'Logged out successfully',
      );
      return { message: 'Logged out successfully' };
    } catch (error) {
      await this.loggerService.log(
        ip,
        user.email,
        'logout',
        'Token is invalid',
      );
      throw new UnauthorizedException(`Token is invalid: ${error}`);
    }
  }

  public async googleLogin(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<UserResponseDto> {
    if (!req.user) {
      await this.loggerService.log(
        ip,
        'unknown',
        'google login',
        'Google authentication failed',
      );
      throw new UnauthorizedException('Google authentication failed');
    }

    const reqUser = req.user as {
      googleId: string;
      firstName: string;
      lastName: string;
      email: string;
      picture: string;
      accessToken: string;
      refreshToken: string;
    };

    const user = await this.usersService.createOrUpdateGoogleUser(ip, reqUser);
    const { accessToken, refreshToken } = this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);

    await this.loggerService.log(
      ip,
      'unknown',
      'google login',
      'Google authentication successfully',
    );

    return user;
  }

  public async handleDiscordCallback(
    req: Request,
    res: Response,
    state: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    const fallbackRedirect = `${frontendBaseUrl}/?error=discord_auth_failed`;

    try {
      const data = await this.redisService.get(state);
      if (!data) {
        return res.redirect(fallbackRedirect);
      }

      const { userId, returnUrl } = JSON.parse(data);
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl);
      const redirectBase = `${frontendBaseUrl}${safeReturnUrl}`;

      const { discordId, accessToken } = req.user as {
        discordId: string;
        accessToken: string;
      };

      await this.discordService.addToGuild(discordId, accessToken);
      await this.usersService.linkDiscord(userId, discordId);
      await this.redisService.del(state);

      return res.redirect(redirectBase);
    } catch {
      return res.redirect(fallbackRedirect);
    }
  }

  public async handleGoogleCallback(
    ip: string,
    req: Request,
    res: Response,
    state: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    const redirectWithError = (returnUrl: string): void => {
      const safeUrl = this.getSafeReturnUrl(returnUrl);
      const finalUrl = `${frontendBaseUrl}${safeUrl}?error=google_auth_failed`;
      return res.redirect(finalUrl);
    };

    try {
      const data = await this.redisService.get(state);
      if (!data) {
        return redirectWithError('/');
      }

      const { returnUrl } = JSON.parse(data);
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl);
      const user = await this.googleLogin(ip, req, res);
      let redirectUrl: string;

      if (user.isVerified) {
        redirectUrl = `${frontendBaseUrl}`;
      } else if (safeReturnUrl.startsWith('/auth/login')) {
        redirectUrl = `${frontendBaseUrl}/confirm-email?type=login`;
      } else if (safeReturnUrl.startsWith('/auth/registration')) {
        redirectUrl = `${frontendBaseUrl}/confirm-email?type=registration`;
      } else {
        redirectUrl = `${frontendBaseUrl}`;
      }

      await this.redisService.del(state);

      return res.redirect(redirectUrl);
    } catch {
      try {
        const fallback = await this.redisService.get(state);
        const parsed = fallback ? JSON.parse(fallback) : {};
        const returnUrl = parsed?.returnUrl ?? '/';
        return redirectWithError(returnUrl);
      } catch {
        return redirectWithError('/');
      }
    }
  }

  private getSafeReturnUrl(url: string | undefined): string {
    try {
      const decoded = decodeURIComponent(url ?? '');
      return decoded.startsWith('/') ? decoded : '/';
    } catch {
      return '/';
    }
  }
}
