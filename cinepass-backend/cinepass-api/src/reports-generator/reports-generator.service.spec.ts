import { Test, TestingModule } from '@nestjs/testing';
import { ReportsGeneratorService } from './reports-generator.service';

describe('ReportsGeneratorService', () => {
  let service: ReportsGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsGeneratorService],
    }).compile();

    service = module.get<ReportsGeneratorService>(ReportsGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
