import { Test, TestingModule } from '@nestjs/testing';
import { SoftSkillsService } from './soft-skills.service';

describe('SoftSkillsService', () => {
  let service: SoftSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoftSkillsService],
    }).compile();

    service = module.get<SoftSkillsService>(SoftSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
