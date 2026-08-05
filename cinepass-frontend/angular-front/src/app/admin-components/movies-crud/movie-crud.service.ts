import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { MovieI } from '../../interfaces/movie';
import { LanguageI } from '../../interfaces/language';
import { ContentRatingI } from '../../interfaces/contentRating';
import { GenreI } from '../../interfaces/genre';
import { CreateMovieDto } from '../../interfaces/createMovieDTO';
import { UpdateMovieDto } from '../../interfaces/updateMovieDTO';
import { ShowTypeI } from '../../interfaces/showType';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:3001';
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    });
  }

  getMoviesBySubsidiary(subsidiaryId: number): Observable<MovieI[]> {
    return from(this.axiosInstance.get<MovieI[]>(`/subsidiaries/movies/${subsidiaryId}`).then(res => res.data));
  }

  getUpcomingMovies(subsidiaryId: number): Observable<MovieI[]> {
    return from(this.axiosInstance.get<MovieI[]>(`/subsidiaries/${subsidiaryId}/upcoming-movies`).then(res => res.data));
  }

  getMovies(): Observable<MovieI[]> {
    return from(this.axiosInstance.get<MovieI[]>('/movies').then(res => res.data));
  }

  getMovieById(id: number): Observable<MovieI> {
    return from(this.axiosInstance.get<MovieI>(`/movies/${id}`).then(res => res.data));
  }

  createMovie(movie: CreateMovieDto): Observable<CreateMovieDto> {
    return from(this.axiosInstance.post<CreateMovieDto>('/movies', movie).then(res => res.data));
  }

  updateMovie(id: number, movie: UpdateMovieDto): Observable<UpdateMovieDto> {
    return from(this.axiosInstance.put<UpdateMovieDto>(`/movies/update/${id}`, movie).then(res => res.data));
  }

  getLanguages(): Observable<LanguageI[]> {
    return from(this.axiosInstance.get<LanguageI[]>('/languages').then(res => res.data));
  }

  getContentRatings(): Observable<ContentRatingI[]> {
    return from(this.axiosInstance.get<ContentRatingI[]>('/content-ratings').then(res => res.data));
  }

  getGenres(): Observable<GenreI[]> {
    return from(this.axiosInstance.get<GenreI[]>('/genres').then(res => res.data));
  }

  getShowTypes(): Observable<any[]> {
    return from(this.axiosInstance.get<ShowTypeI[]>('/show-types').then(res => res.data));
  }

  uploadPoster(file: File, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);
    return from(this.axiosInstance.post<any>('/upload/poster', formData).then(res => res.data));
  }

  getPosterUrl(movieId: number): string {
    return `${this.apiUrl}/movies/${movieId}/poster`;
  }
}