import { Module } from '@nestjs/common';
import { TaskStatusesService } from './task-statuses.service';
import { TaskStatusesController } from './task-statuses.controller';
import { UsersModule } from '../users/users.module';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [UsersModule, BoardsModule],
  controllers: [TaskStatusesController],
  providers: [TaskStatusesService],
})
export class TaskStatusesModule {}
