import { Test, TestingModule } from '@nestjs/testing';
import { SoftSkillsController } from './soft-skills.controller';
import { SoftSkillsService } from './soft-skills.service';

describe('SoftSkillsController', () => {
  let controller: SoftSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoftSkillsController],
      providers: [SoftSkillsService],
    }).compile();

    controller = module.get<SoftSkillsController>(SoftSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
