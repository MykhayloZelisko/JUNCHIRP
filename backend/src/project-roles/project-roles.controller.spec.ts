import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRolesController } from './project-roles.controller';
import { ProjectRolesService } from './project-roles.service';

describe('ProjectRolesController', () => {
  let controller: ProjectRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectRolesController],
      providers: [ProjectRolesService],
    }).compile();

    controller = module.get<ProjectRolesController>(ProjectRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
