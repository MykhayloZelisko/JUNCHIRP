import { forwardRef, Module } from '@nestjs/common';
import { ProjectRolesService } from './project-roles.service';
import { ProjectRolesController } from './project-roles.controller';
import { UsersModule } from '../users/users.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [forwardRef(() => UsersModule), DiscordModule],
  controllers: [ProjectRolesController],
  providers: [ProjectRolesService],
  exports: [ProjectRolesService],
})
export class ProjectRolesModule {}
