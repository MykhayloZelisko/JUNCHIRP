import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { RolesModule } from '../roles/roles.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProjectsModule } from '../projects/projects.module';
import { ParticipationsModule } from '../participations/participations.module';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    MailModule,
    RolesModule,
    CloudinaryModule,
    ProjectsModule,
    ParticipationsModule,
    LoggerModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
