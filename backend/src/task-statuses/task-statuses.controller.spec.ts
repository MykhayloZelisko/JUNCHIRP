import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatusesController } from './task-statuses.controller';
import { TaskStatusesService } from './task-statuses.service';

describe('TaskStatusesController', () => {
  let controller: TaskStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStatusesController],
      providers: [TaskStatusesService],
    }).compile();

    controller = module.get<TaskStatusesController>(TaskStatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
