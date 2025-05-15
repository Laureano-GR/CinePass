import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsGeneratorService {
  constructor(private readonly dataSource: DataSource) {}
  //Reporte mensual de una sucursal
  async generateSubsidiaryMonthlyReport(subsidiaryId: number, month: string, year: string) {
    if (typeof month !== 'string' || typeof year !== 'string') {
      throw new Error('Los parámetros month y year deben ser cadenas.');
    }
  
    // Asegurarse de que month tenga dos dígitos
    const formattedMonth = month.padStart(2, '0');
    const formattedYear = year;
  
    const generalReport = await this.calculateGeneralReport(subsidiaryId, formattedMonth, formattedYear);
    const movieSalesReport = await this.calculateMovieSalesReport(subsidiaryId, formattedMonth, formattedYear);
    const paymentMethodsReport = await this.calculatePaymentMethodsReport(subsidiaryId, formattedMonth, formattedYear);

    return [[['Sucursal: ' + subsidiaryId, 'Mes: ' + month, 'Año: ' + year]], generalReport, movieSalesReport, paymentMethodsReport];
  }
  
  private async calculateGeneralReport(subsidiaryId: number, month: string, year: string): Promise<any[][]> {
    const result = await this.dataSource.query(
      `
      SELECT 
        SUM(s.totalPrice) AS totalRevenue,
        SUM(s.ticketsAmount) AS totalTickets,
        COUNT(DISTINCT sh.id) AS totalShows,
        COUNT(DISTINCT s.id) AS totalSales
      FROM sales s
      INNER JOIN shows sh ON s.showId = sh.id
      WHERE sh.subsidiaryId = ? AND strftime('%m', s.dateAndTime) = ? AND strftime('%Y', s.dateAndTime) = ? AND s.canceled=0
      `,
      [subsidiaryId, month, year]
    );
  
    return [
      ['General de ventas del mes'],
      ['Total recaudado', 'Cantidad de ventas', 'Cantidad de entradas vendidas', 'Cantidad de funciones'],
      [result[0].totalRevenue || 0, result[0].totalSales || 0, result[0].totalTickets || 0, result[0].totalShows || 0],
    ];
  }

  private async calculateMovieSalesReport(subsidiaryId: number, month: string, year: string): Promise<any[][]> {
  const result = await this.dataSource.query(
    `
    SELECT 
      m.name AS movieName,
      SUM(s.totalPrice) AS totalRevenue,
      SUM(s.ticketsAmount) AS totalTickets,
      (
        SELECT st.name
        FROM sales s2
        INNER JOIN shows sh2 ON s2.showId = sh2.id
        INNER JOIN showTypes st ON sh2.showTypeId = st.id
        WHERE sh2.movieId = m.id AND sh2.subsidiaryId = ? AND strftime('%m', s2.dateAndTime) = ? AND strftime('%Y', s2.dateAndTime) = ? AND s2.canceled = 0
        GROUP BY st.id
        ORDER BY SUM(s2.ticketsAmount) DESC
        LIMIT 1
      ) AS mostSoldShowType
    FROM sales s
    INNER JOIN shows sh ON s.showId = sh.id
    INNER JOIN movies m ON sh.movieId = m.id
    WHERE sh.subsidiaryId = ? AND strftime('%m', s.dateAndTime) = ? AND strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
    GROUP BY m.id
    ORDER BY totalRevenue DESC
    `,
    [subsidiaryId, month, year, subsidiaryId, month, year]
  );

  const formattedResult = result.map(row => [row.movieName, row.totalRevenue, row.totalTickets, row.mostSoldShowType]);

  return [
    ['Ventas de películas del mes'],
    ['Película', 'Total recaudado', 'Cantidad de entradas vendidas', 'Tipo de función más vendido'],
    ...formattedResult,
  ];
}

  private async calculatePaymentMethodsReport(subsidiaryId: number, month: string, year: string): Promise<any[][]> {
    const result = await this.dataSource.query(
      `
      SELECT 
        pm.name AS paymentMethod,
        COUNT(DISTINCT s.id) AS totalSales,
        SUM(s.totalPrice) AS totalRevenue
      FROM sales s
      INNER JOIN paymentData pd ON s.paymentDataId = pd.id
      INNER JOIN paymentMethods pm ON pd.paymentMethodId = pm.id
      INNER JOIN shows sh ON s.showId = sh.id
      WHERE sh.subsidiaryId = ? AND strftime('%m', s.dateAndTime) = ? AND strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
      GROUP BY pm.name
      ORDER BY totalRevenue DESC
      `,
      [subsidiaryId, month, year]
    );
  
    const formattedResult = result.map(row => [row.paymentMethod, row.totalSales, row.totalRevenue]);
  
    return [
      ['Resumen de métodos de pago del mes'],
      ['Método de pago', 'Cantidad de ventas', 'Recaudación total'], ...formattedResult
    ];
  }

  private getDayName(dayOfWeek: string): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[parseInt(dayOfWeek, 10)];
  }

  //Reporte anual de la cadena de cines
  async generateCinemaYearlyReport(year: string): Promise<any[][]> {
    // Validar que el año sea una cadena
    if (typeof year !== 'string') {
      throw new Error('El parámetro year debe ser una cadena.');
    }
  
    const generalReport = await this.calculateYearlyGeneralReport(year);
    const topMoviesReport = await this.calculateTopMoviesReport(year);
    const topMonthsReport = await this.calculateTopMonthsReport(year);
  
    // Wrap the first element in an array to ensure compatibility with Angular's *ngFor
    return [[['Año: ' + year]], generalReport, topMoviesReport, topMonthsReport];
  }
  
  private async calculateYearlyGeneralReport(year: string): Promise<any[][]> {
    const result = await this.dataSource.query(
      `
      SELECT 
        SUM(s.totalPrice) AS totalRevenue,
        SUM(s.ticketsAmount) AS totalTickets
      FROM sales s
      WHERE strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
      `,
      [year]
    );
  
    return [
      ['General de ventas del año'],
      ['Total recaudado', 'Cantidad de entradas vendidas'],
      [result[0].totalRevenue || 0, result[0].totalTickets || 0],
    ];
  }
  
  private async calculateTopMoviesReport(year: string): Promise<any[][]> {
    const result = await this.dataSource.query(
      `
      SELECT 
        totals.movieName,
        totals.totalRevenue,
        totals.totalTickets,
        mostSoldTypes.mostSoldShowType
      FROM (
        -- Subconsulta: suma total de recaudación y entradas por película
        SELECT 
          m.id AS movieId,
          m.name AS movieName,
          SUM(s.totalPrice) AS totalRevenue,
          SUM(s.ticketsAmount) AS totalTickets
        FROM sales s
        INNER JOIN shows sh ON s.showId = sh.id
        INNER JOIN movies m ON sh.movieId = m.id
        WHERE strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
        GROUP BY m.id
      ) AS totals
      INNER JOIN (
        -- Subconsulta: tipo de función más vendida (por entradas) por película
        SELECT 
          m.id AS movieId,
          st.name AS mostSoldShowType
        FROM sales s
        INNER JOIN shows sh ON s.showId = sh.id
        INNER JOIN movies m ON sh.movieId = m.id
        INNER JOIN showTypes st ON sh.showTypeId = st.id
        WHERE strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
        GROUP BY m.id, st.id
        HAVING SUM(s.ticketsAmount) = (
          -- Subconsulta anidada: obtiene el máximo de entradas vendidas por tipo de función para esa película
          SELECT MAX(ticket_sum) FROM (
            SELECT SUM(s2.ticketsAmount) AS ticket_sum
            FROM sales s2
            INNER JOIN shows sh2 ON s2.showId = sh2.id
            WHERE strftime('%Y', s2.dateAndTime) = ? AND s2.canceled = 0 AND sh2.movieId = m.id
            GROUP BY sh2.showTypeId
          )
        )
      ) AS mostSoldTypes ON totals.movieId = mostSoldTypes.movieId
      ORDER BY totals.totalRevenue DESC
      LIMIT 10;
      `,
      [year, year, year]
    );
  
    const formattedResult = result.map(row => [row.movieName, row.totalRevenue, row.totalTickets, row.mostSoldShowType]);
  
    return [
      ['10 películas con mayor recaudación'],
      ['Película', 'Total recaudado', 'Cantidad de entradas', 'Tipo de función más vendido'], ...formattedResult
    ];
  }
  
  private async calculateTopMonthsReport(year: string): Promise<any[][]> {
    const result = await this.dataSource.query(
      `
      SELECT 
        totals.month,
        COALESCE(topMovies.topMovie, 'N/A') AS topMovie,
        totals.totalTickets,
        totals.totalRevenue
      FROM (
        -- Totales por mes
        SELECT 
          strftime('%m', s.dateAndTime) AS month,
          SUM(s.ticketsAmount) AS totalTickets,
          SUM(s.totalPrice) AS totalRevenue
        FROM sales s
        WHERE strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
        GROUP BY month
      ) AS totals
      LEFT JOIN (
        -- Película más vendida por mes (por entradas)
        SELECT month, name AS topMovie
        FROM (
          SELECT 
            strftime('%m', s.dateAndTime) AS month,
            m.name,
            SUM(s.ticketsAmount) AS totalTickets,
            ROW_NUMBER() OVER (PARTITION BY strftime('%m', s.dateAndTime) ORDER BY SUM(s.ticketsAmount) DESC) AS rn
          FROM sales s
          INNER JOIN shows sh ON s.showId = sh.id
          INNER JOIN movies m ON sh.movieId = m.id
          WHERE strftime('%Y', s.dateAndTime) = ? AND s.canceled = 0
          GROUP BY month, m.name
        )
        WHERE rn = 1
      ) AS topMovies ON totals.month = topMovies.month
      ORDER BY totals.month;
      `,
      [year, year]
    );
  
    // Crear una estructura para los 12 meses
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: (i + 1).toString().padStart(2, '0'), // Mes en formato "01", "02", etc.
      topMovie: 'N/A',
      totalTickets: 0,
      totalRevenue: 0,
    }));
  
    // Mapear los resultados a los meses
    result.forEach(row => {
      const monthIndex = parseInt(row.month, 10) - 1;
      months[monthIndex] = {
        month: row.month,
        topMovie: row.topMovie,
        totalTickets: row.totalTickets || 0,
        totalRevenue: row.totalRevenue || 0,
      };
    });
  
    const formattedResult = months.map(row => [
      this.getMonthName(row.month),
      row.topMovie,
      row.totalTickets,
      row.totalRevenue,
    ]);
  
    return [
      ['Meses con mayor cantidad de ventas'],
      ['Mes', 'Película más vendida', 'Cantidad de entradas vendidas', 'Total recaudado'], ...formattedResult
    ];
  }
  
  private getMonthName(month: string): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[parseInt(month, 10) - 1];
  }

}
