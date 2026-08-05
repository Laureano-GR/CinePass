import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ReportsGeneratorService } from './reports-generator.service';
import { ReportsExporterService } from './reports-exporter.service';

@Controller('reports-generator')
export class ReportsGeneratorController {
  constructor(
    private service: ReportsGeneratorService,
    private exporterService: ReportsExporterService,
  ) {}
  
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

  @Post('export')
  async exportReport(
    @Body('reportData') reportData: any[][],
    @Res() response: Response,
  ): Promise<void> {
    if (!reportData || reportData.length === 0) {
      response.status(400).send('Invalid report data');
      return;
    }

    // La primera fila se asume como encabezados
    const headers = reportData[0];
    const data = reportData.slice(1);

    const buffer = await this.exporterService.exportToExcel([headers, ...data]);

    // Configurar los encabezados HTTP para la descarga
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      "attachment; filename=reporte.xlsx",
    );

    response.send(buffer); // Enviar el archivo al frontend
  }
}
