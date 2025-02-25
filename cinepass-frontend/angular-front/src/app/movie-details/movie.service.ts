import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieI } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3001/movies';  // URL de la API

  constructor(private http: HttpClient) {} // Inyectar el servicio ShowService

  getMovie(id: number): Promise<MovieI> {
    return this.http.get<MovieI>(`${this.apiUrl}/${id}`).toPromise().then(movie => {
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    });
  }

  getMoviePosterUrl(movieId: number): string {
    return `${this.apiUrl}/${movieId}/poster`;
  }
}