import { Test, TestingModule } from '@nestjs/testing';
import { CsrfController } from './csrf.controller';
import { CsrfService } from './csrf.service';

describe('CsrfController', () => {
  let controller: CsrfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrfController],
      providers: [CsrfService],
    }).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
