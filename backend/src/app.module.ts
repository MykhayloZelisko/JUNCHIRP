import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { CsrfModule } from './csrf/csrf.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { RolesModule } from './roles/roles.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `../.env.${process.env.NODE_ENV}.local`,
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    CsrfModule,
    AuthModule,
    UsersModule,
    MailModule,
    RolesModule,
    CloudinaryModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
})
export class AppModule {}
