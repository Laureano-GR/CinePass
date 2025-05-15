import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3001';
  constructor() { }
  
  async generateSubsidiaryMonthlyReport(subsidiaryId: number, month: string, year: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/reports-generator/subsidiary-monthly-report`, {
        params: {
          subsidiaryId,
          month,
          year
        }
      });
      console.log('Response from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async generateCinemaYearlyReport(year: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/reports-generator/cinema-yearly-report`, {
        params: {
          year
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async exportReportToExcel(reportData: any, filename: string): Promise<void> {
    try {
      const response = await axios.post(`${this.apiUrl}/reports-generator/export`, reportData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'blob', // Asegura que la respuesta sea tratada como un archivo binario
      });
  
      // Crear un blob con los datos recibidos del backend
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Crear una URL temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.xlsx`; // Nombre del archivo con extensión
      a.click();
  
      // Revocar la URL temporal después de la descarga
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report to Excel:', error);
      throw error;
    }
  }

}