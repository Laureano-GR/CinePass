import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import axios from 'axios';
import { MovieI } from '../interfaces/movie';
import { ShowI } from '../interfaces/show';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://localhost:3001'; // Reemplaza con la URL de tu backend

  constructor() { }

  async getMovies(subsidiaryId: number) {
    try {
      const response = await axios.get(`${this.url}/subsidiaries/movies/${subsidiaryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }
  // Agrega más métodos según necesites para diferentes endpoints
}