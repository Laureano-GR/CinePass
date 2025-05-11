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

}
