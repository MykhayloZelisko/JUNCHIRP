import { Test, TestingModule } from '@nestjs/testing';
import { HardSkillsController } from './hard-skills.controller';
import { HardSkillsService } from './hard-skills.service';

describe('HardSkillsController', () => {
  let controller: HardSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HardSkillsController],
      providers: [HardSkillsService],
    }).compile();

    controller = module.get<HardSkillsController>(HardSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
