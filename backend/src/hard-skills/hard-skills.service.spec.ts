import { Test, TestingModule } from '@nestjs/testing';
import { HardSkillsService } from './hard-skills.service';

describe('HardSkillsService', () => {
  let service: HardSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HardSkillsService],
    }).compile();

    service = module.get<HardSkillsService>(HardSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
