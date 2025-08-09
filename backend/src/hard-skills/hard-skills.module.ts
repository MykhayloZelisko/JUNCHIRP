import { Module } from '@nestjs/common';
import { HardSkillsService } from './hard-skills.service';
import { HardSkillsController } from './hard-skills.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [HardSkillsController],
  providers: [HardSkillsService],
})
export class HardSkillsModule {}
