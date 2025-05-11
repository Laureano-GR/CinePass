import { Controller, Get, Query } from '@nestjs/common';
import { ReportsGeneratorService } from './reports-generator.service';

@Controller('reports-generator')
export class ReportsGeneratorController {
  constructor(private service: ReportsGeneratorService) {}
  
  @Get('subsidiary-monthly-report/')
  async generateSubsidiaryMonthlyReport(
    @Query('subsidiaryId') subsidiaryId: number, // Formato: #
    @Query('month') month: string, // Formato: MM
    @Query('year') year: string // Formato: YYYY
  ) {
    return await this.service.generateSubsidiaryMonthlyReport(subsidiaryId, month, year);
  }

  @Get('cinema-yearly-report/')
  async generateCinemaYearlyReport(
    @Query('year') year: string //Formato: YYYY
  ) { 
    return await this.service.generateCinemaYearlyReport(year);
  }
}
