import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRolesService } from './project-roles.service';

describe('ProjectRolesService', () => {
  let service: ProjectRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRolesService],
    }).compile();

    service = module.get<ProjectRolesService>(ProjectRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
