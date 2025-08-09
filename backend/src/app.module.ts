import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTasksService } from './shared/services/cron-tasks/cron-tasks.service';
import { RolesModule } from './roles/roles.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CsrfModule } from './csrf/csrf.module';
import { SocialsModule } from './socials/socials.module';
import { EducationsModule } from './educations/educations.module';
import { SoftSkillsModule } from './soft-skills/soft-skills.module';
import { HardSkillsModule } from './hard-skills/hard-skills.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectRolesModule } from './project-roles/project-roles.module';
import { DocumentsModule } from './documents/documents.module';
import { ParticipationsModule } from './participations/participations.module';
import { BoardsModule } from './boards/boards.module';
import { TaskStatusesModule } from './task-statuses/task-statuses.module';
import { TasksModule } from './tasks/tasks.module';
import { SupportModule } from './support/support.module';
import { LoggerModule } from './logger/logger.module';
import { DiscordModule } from './discord/discord.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `../.env.${process.env.NODE_ENV}.local`,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    ScheduleModule.forRoot(),
    RolesModule,
    RedisModule,
    CsrfModule,
    SocialsModule,
    EducationsModule,
    SoftSkillsModule,
    HardSkillsModule,
    CloudinaryModule,
    ProjectsModule,
    ProjectRolesModule,
    DocumentsModule,
    ParticipationsModule,
    BoardsModule,
    TaskStatusesModule,
    TasksModule,
    SupportModule,
    LoggerModule,
    DiscordModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [
    CronTasksService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
