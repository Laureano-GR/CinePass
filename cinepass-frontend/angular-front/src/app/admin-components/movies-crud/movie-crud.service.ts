import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieI } from '../../interfaces/movie';
import { LanguageI } from '../../interfaces/language';
import { ContentRatingI } from '../../interfaces/contentRating';
import { GenreI } from '../../interfaces/genre';
import { CreateMovieDto } from '../../interfaces/createMovieDTO';
import { UpdateMovieDto } from '../../interfaces/updateMovieDTO';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getMoviesBySubsidiary(subsidiaryId: number): Observable<MovieI[]> {
    return this.http.get<MovieI[]>(`${this.apiUrl}/subsidiaries/movies/${subsidiaryId}`);
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

  getMovies(): Observable<MovieI[]> {
    return this.http.get<MovieI[]>(`${this.apiUrl}/movies`);
  }

  getMovieById(id: number): Observable<MovieI> {
    return this.http.get<MovieI>(`${this.apiUrl}/movies/${id}`);
  }

  createMovie(movie: CreateMovieDto): Observable<CreateMovieDto> {
    return this.http.post<CreateMovieDto>(`${this.apiUrl}/movies`, movie);
  }

  updateMovie(id: number, movie: UpdateMovieDto): Observable<UpdateMovieDto> {
    return this.http.put<UpdateMovieDto>(`${this.apiUrl}/movies/update/${id}`, movie);
  }

  getLanguages(): Observable<LanguageI[]> {
    return this.http.get<LanguageI[]>(`${this.apiUrl}/languages`);
  }

  getContentRatings(): Observable<ContentRatingI[]> {
    return this.http.get<ContentRatingI[]>(`${this.apiUrl}/content-ratings`);
  }

  getGenres(): Observable<GenreI[]> {
    return this.http.get<GenreI[]>(`${this.apiUrl}/genres`);
  }

  uploadPoster(file: File, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);
    return this.http.post<any>(`${this.apiUrl}/upload/poster`, formData);
  }

  getPosterUrl(movieId: number): string {
    return `${this.apiUrl}/movies/${movieId}/poster`;
  }
}