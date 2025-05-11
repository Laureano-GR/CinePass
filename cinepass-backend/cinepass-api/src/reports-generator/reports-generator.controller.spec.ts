import { Test, TestingModule } from '@nestjs/testing';
import { ReportsGeneratorController } from './reports-generator.controller';

describe('ReportsGeneratorController', () => {
  let controller: ReportsGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsGeneratorController],
    }).compile();

    controller = module.get<ReportsGeneratorController>(ReportsGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
