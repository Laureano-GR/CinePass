import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from './reports.service';
import { LoadingService } from '../../shared-components/loading-screen/loading.service';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartDataset
} from 'chart.js';

// Registrar los componentes necesarios
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-reports-visualizer',
  templateUrl: './reports-visualizer.component.html',
  styleUrl: './reports-visualizer.component.css'
})
export class ReportsVisualizerComponent implements OnInit {
  reportType: string | null = null;
  modalData: any = {
    title: 'Error',
    message: 'Report type not recognized.'
  };
  isModalVisible: boolean = false;
  showCharts = false;
  reportData: any[] = []; // Almacena los datos del reporte para mostrarlos en tablas
  reportParameters: string[] = []; // Asegúrate de que esta propiedad esté definida

  constructor(
    private route: ActivatedRoute,
    private reportsService: ReportsService,
    private loadingService: LoadingService 
  ) {}

  ngOnInit(): void {
    // Extraer el valor después del último '/' en la URL
    const url = this.route.snapshot.url.map(segment => segment.path).join('/');
    this.reportType = url.split('/').pop() || null;

    // Mostrar el modal basado en el valor de reportType
    this.showModal();
  }

  showModal(): void {
    switch (this.reportType) {
      case 'subsidiary-monthly': {
        const subsidiaryId = sessionStorage.getItem('subsidiaryId');
        if (!subsidiaryId) {
          console.error('No subsidiaryId found in sessionStorage');
          return;
        }

        // Asignar el valor directamente al campo
        this.modalData = {
          title: 'Reporte mensual de la sucursal',
          fields: [
            { label: 'Subsidiary ID', type: 'number', name: 'subsidiaryId', value: subsidiaryId, hidden: true },
            { label: 'Mes (MM)', type: 'text', name: 'month', value: '' },
            { label: 'Año (YYYY)', type: 'text', name: 'year', value: '' }
          ]
        };

        break;
      }

      case 'cinema-yearly': {
        this.modalData = {
          title: 'Reporte anual del cine',
          fields: [
            { label: 'Year (YYYY)', type: 'text', name: 'year', value: '' }
          ]
        };
        break;
      }

      default: {
        this.modalData = {
          title: 'Error',
          message: 'Tipo de reporte no reconocido.'
        };
        break;
      }
    }

    this.isModalVisible = true;
  }

  async submitForm(formData: any): Promise<void> {
    this.loadingService.show();
    try {
      let reportResult;

      if (this.reportType === 'subsidiary-monthly') {
        const { subsidiaryId, month, year } = formData;
        reportResult = await this.reportsService.generateSubsidiaryMonthlyReport(subsidiaryId, month, year);
      } else if (this.reportType === 'cinema-yearly') {
        const { year } = formData;
        reportResult = await this.reportsService.generateCinemaYearlyReport(year);
      } else {
        console.error('Tipo de reporte no reconocido.');
        return;
      }

      // Guardar el primer array de la primera matriz en reportParameters
      if (Array.isArray(reportResult) && Array.isArray(reportResult[0])) {
        this.reportParameters = reportResult[0][0]; // Guardar el primer array
        reportResult.shift(); // Eliminar la primera matriz
      }

      // Almacena los datos del reporte
      this.reportData = reportResult;

      
      // Cierra el modal
      this.loadingService.hide();
      this.isModalVisible = false;
    } catch (error) {
      this.loadingService.hide();
      console.error('Error al generar el reporte:', error);
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  renderAllCharts() {
    const container = document.querySelectorAll('.report-chart');
    container.forEach((canvas, index) => {
      const table = this.reportData[index];
      if (!table || table.length < 2) return;

      const headers = table[1];
      const dataRows = table.slice(2);

      let labels: string[] = [];
      let datasets: any[] = [];

      // Detectar el tipo de tabla y configurar los datos del gráfico
      if (headers.includes('Película') && headers.includes('Total recaudado')) {
        // Ventas de películas por mes por sucursal o 10 películas con más recaudación
        const movieIndex = headers.findIndex((h: string) => h === 'Película');
        const totalIndex = headers.findIndex((h: string) => h === 'Total recaudado');
        const quantityIndex = headers.findIndex((h: string) => h.includes('Cantidad de entradas'));

        labels = dataRows.map((row: string[]) => row[movieIndex]);
        datasets = [
          {
            label: 'Total recaudado',
            data: dataRows.map((row: string[]) => Number(row[totalIndex]) || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
          },
          {
            label: 'Cantidad de entradas',
            data: dataRows.map((row: string[]) => Number(row[quantityIndex]) || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          }
        ] as ChartDataset<'bar'>[];
      } else if (headers.includes('Mes') && headers.includes('Cantidad de entradas vendidas')) {
        // Meses con más ventas
        const monthIndex = headers.findIndex((h: string) => h === 'Mes');
        const quantityIndex = headers.findIndex((h: string) => h === 'Cantidad de entradas vendidas');
        const totalIndex = headers.findIndex((h: string) => h === 'Total recaudado');

        labels = dataRows.map((row: string[]) => row[monthIndex]);
        datasets = [
          {
            label: 'Cantidad de entradas vendidas',
            data: dataRows.map((row: string[]) => Number(row[quantityIndex]) || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.7)'
          },
          {
            label: 'Total recaudado',
            data: dataRows.map((row: string[]) => Number(row[totalIndex]) || 0),
            backgroundColor: 'rgba(255, 206, 86, 0.7)'
          }
        ];
      } else if (headers.includes('Método de pago') && headers.includes('Cantidad de ventas')) {
        // Métodos de pago del mes
        const methodIndex = headers.findIndex((h: string) => h === 'Método de pago');
        const salesIndex = headers.findIndex((h: string) => h === 'Cantidad de ventas');
        const totalIndex = headers.findIndex((h: string) => h === 'Recaudación total');

        labels = dataRows.map((row: string[]) => row[methodIndex]);
        datasets = [
          {
            label: 'Cantidad de ventas',
            data: dataRows.map((row: string[]) => Number(row[salesIndex]) || 0),
            backgroundColor: 'rgba(153, 102, 255, 0.7)'
          },
          {
            label: 'Recaudación total',
            data: dataRows.map((row: string[]) => Number(row[totalIndex]) || 0),
            backgroundColor: 'rgba(255, 159, 64, 0.7)'
          }
        ];
      } else if (headers.includes('Total recaudado') && headers.includes('Cantidad de entradas vendidas')) {
        // General (mensual o anual)
        const totalIndex = headers.findIndex((h: string) => h === 'Total recaudado');
        const quantityIndex = headers.findIndex((h: string) => h === 'Cantidad de entradas vendidas');

        labels = ['General'];
        datasets = [
          {
            label: 'Total recaudado',
            data: [Number(dataRows[0][totalIndex]) || 0],
            backgroundColor: 'rgba(255, 206, 86, 0.7)'
          },
          {
            label: 'Cantidad de entradas vendidas',
            data: [Number(dataRows[0][quantityIndex]) || 0],
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          }
        ];
      }

      // Crear el gráfico
      new Chart(canvas as HTMLCanvasElement, {
        type: 'bar',
        data: {
          labels,
          datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: table[0] // título del informe
            }
          }
        }
      });
    });
  }

  toggleChartView(): void {
  this.showCharts = !this.showCharts;

    if (this.showCharts) {
      // Esperar a que se rendericen los canvas
      setTimeout(() => this.renderAllCharts(), 100);
    }
  }

  getSubsidiaryName(): string {
    try {
      const storedSubsidiary = sessionStorage.getItem('subsidiary');
      if (storedSubsidiary) {
        const subsidiary = JSON.parse(storedSubsidiary);
        return subsidiary.name || 'Sucursal no encontrada';
      }
      return 'Sucursal no encontrada';
    } catch (error) {
      console.error('Error al obtener el nombre de la sucursal desde sessionStorage:', error);
      return 'Error al obtener la sucursal';
    }
  }

  downloadReport(): void {
    // Lógica para descargar el reporte (vacía por ahora)
    console.log('Descargar reporte');
  }
}