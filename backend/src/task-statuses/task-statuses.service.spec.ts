import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatusesService } from './task-statuses.service';

describe('TaskStatusesService', () => {
  let service: TaskStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskStatusesService],
    }).compile();

    service = module.get<TaskStatusesService>(TaskStatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
