import { Injectable } from '@angular/core';
import axios from 'axios';
import { MovieI } from '../interfaces/movie';
import { Observable } from 'rxjs';
import { GenreI } from '../interfaces/genre';
import { ContentRatingI } from '../interfaces/contentRating';
import { LanguageI } from '../interfaces/language';
import { ShowTypeI } from '../interfaces/showType';

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

  async getUpcomingMovies(subsidiaryId: number){
    try {
      const response = await axios.get(`${this.url}/subsidiaries/${subsidiaryId}/upcoming-movies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  getMoviePosterUrl(movieId: number): string {
    return `${this.url}/movies/${movieId}/poster`;
  }

  async getGenres(): Promise<GenreI[]> {
    try {
      const response = await axios.get(`${this.url}/genres`);
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }

  async getContentRatings(): Promise<ContentRatingI[]> {
    try {
      const response = await axios.get(`${this.url}/content-ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content ratings:', error);
      throw error;
    }
  }

  async getLanguages(): Promise<LanguageI[]> {
    try {
      const response = await axios.get(`${this.url}/languages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  async getShowTypes(): Promise<ShowTypeI[]> {
    try {
      const response = await axios.get(`${this.url}/show-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching show types:', error);
      throw error;
    }
  }

  async getBanners(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${this.url}/subsidiaries/banners`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los banners:', error);
      return [];
    }
  }
}