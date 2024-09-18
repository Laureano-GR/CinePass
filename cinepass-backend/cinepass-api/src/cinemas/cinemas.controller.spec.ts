import { Test, TestingModule } from '@nestjs/testing';
import { CinemasController } from './cinemas.controller';

describe('CinemasController', () => {
  let controller: CinemasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CinemasController],
    }).compile();

    controller = module.get<CinemasController>(CinemasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
