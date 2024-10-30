import { Test, TestingModule } from '@nestjs/testing';
import { CinemaController } from './cinema.controller';

describe('CinemaController', () => {
  let controller: CinemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CinemaController],
    }).compile();

    controller = module.get<CinemaController>(CinemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});