import { Injectable } from '@angular/core';
import axios from 'axios';
import { MovieI } from '../interfaces/movie';
import { Observable } from 'rxjs';
import { GenreI } from '../interfaces/genre';
import { ContentRatingI } from '../interfaces/contentRating';
import { LanguageI } from '../interfaces/language';

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

  getMoviePosterUrl(movieId: number): string {
    return `${this.url}/movies/${movieId}/poster`;
  }

  getMoviesWithShowsInNextTwoWeeks(movies: MovieI[]): MovieI[] {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    return movies.filter(movie => 
      movie.shows && movie.shows.some(show => {
        const showDate = new Date(show.dateAndTime);
        return showDate >= today && showDate <= twoWeeksFromNow;
      })
    );
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