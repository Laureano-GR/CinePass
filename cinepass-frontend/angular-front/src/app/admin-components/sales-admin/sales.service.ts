import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { SaleI } from '../../interfaces/sale';
import { ShowI } from '../../interfaces/show';
import { MovieI } from '../../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:3001';

  constructor() {}

  /*getSales(): Observable<SaleI[]> {
    return from(
      axios.get<SaleI[]>(`${this.apiUrl}/sales`).then(response => response.data)
    );
  }*/

  getShowDetails(showId: number): Observable<ShowI> {
    return from(
      axios.get<ShowI>(`${this.apiUrl}/shows/${showId}`).then(response => response.data)
    );
  } 

  getPaymentMethods(): Observable<any[]> {
    return from(
      axios.get<any[]>(`${this.apiUrl}/payment-methods`).then(response => response.data)
    );
  }

  cancelSale(saleId: number): Observable<void> {
    return from(
      axios.put<void>(`${this.apiUrl}/sales/cancel/${saleId}`).then(response => response.data)
    );
  }

  findSales(purchaseId?: number, documentNumber?: string, dateFrom?: string, dateTo?: string): Observable<SaleI[]> {
    return from(
      axios.post<SaleI[]>(`${this.apiUrl}/sales/find`, { purchaseId, documentNumber, dateFrom, dateTo }).then(response => response.data)
    );
  }

  async getUpcomingMovies(subsidiaryId: number): Promise<MovieI[]> {
    try {
      const response = await axios.get<MovieI[]>(`${this.apiUrl}/subsidiaries/${subsidiaryId}/upcoming-movies`);
      if (!response.data) {
        throw new Error('No upcoming movies found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  async getShow(showId: number): Promise<ShowI> {
    try {
      const response = await axios.get<ShowI>(`${this.apiUrl}/shows/${showId}`);
      if (!response.data) {
        throw new Error('Show not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching show details:', error);
      throw error;
    }
  }

  async getShowsByMovieAndSubsidiary(movieId: number, subsidiaryId: number): Promise<ShowI[]> { //Este metodo obtiene las funciones de una pelicula dentro de las proximas dos semanas para esa sucursal
    try {
      const response = await axios.get<ShowI[]>(`${this.apiUrl}/shows/filter-shows/${movieId}/${subsidiaryId}`);
      if (!response.data) {
        throw new Error('Shows not found');
      }

      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

      // Filtrar los shows con fecha dentro de las próximas dos semanas
      const filteredShows = response.data.filter((show) => {
        const showDate = new Date(show.dateAndTime);
        return showDate >= new Date() && showDate <= twoWeeksFromNow;
      });

      // Ordenar los shows por fecha
      const sortedShows = filteredShows.sort((a, b) => {
        const dateA = new Date(a.dateAndTime).getTime();
        const dateB = new Date(b.dateAndTime).getTime();
        return dateA - dateB; // Orden ascendente
      });

      return sortedShows;
    } catch (error) {
      console.error('Error fetching shows by movie and subsidiary:', error);
      throw error;
    }
  }

  async getMovie(id: number): Promise<MovieI> {
    try {
      const response = await axios.get<MovieI>(`${this.apiUrl}/movies/${id}`);
      if (!response.data) {
        throw new Error('Movie not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

}