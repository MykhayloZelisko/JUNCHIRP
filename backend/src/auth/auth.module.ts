import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RedisModule } from '../redis/redis.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { LoggerModule } from '../logger/logger.module';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [
    MailModule,
    UsersModule,
    DiscordModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    DiscordStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
