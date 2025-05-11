import { Module } from '@nestjs/common';
import { ReportsGeneratorController } from './reports-generator.controller';
import { ReportsGeneratorService } from './reports-generator.service';

@Module({
  providers: [ReportsGeneratorService],
  controllers: [ReportsGeneratorController]
})
export class ReportsGeneratorModule {}
