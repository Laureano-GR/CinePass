import { Injectable } from '@angular/core';
import axios from 'axios';
import { MovieI } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3001/movies'; // URL de la API

  constructor() {} // Elimina la inyección de HttpClient

  async getMovie(id: number): Promise<MovieI> {
    try {
      const response = await axios.get<MovieI>(`${this.apiUrl}/${id}`);
      const movie = response.data;
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching movie');
      } else {
        throw new Error('Error fetching movie');
      }
    }
  }

  getMoviePosterUrl(movieId: number): string {
    return `${this.apiUrl}/${movieId}/poster`;
  }
}