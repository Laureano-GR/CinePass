import { Module } from '@nestjs/common';
import { ReportsGeneratorController } from './reports-generator.controller';
import { ReportsGeneratorService } from './reports-generator.service';
import { ReportsExporterService } from './reports-exporter.service';

@Module({
  providers: [ReportsGeneratorService, ReportsExporterService],
  controllers: [ReportsGeneratorController]
})
export class ReportsGeneratorModule {}
