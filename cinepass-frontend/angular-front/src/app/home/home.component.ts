import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service'; 
import { SubsidiaryService } from '../subsidiary.service';
import { Router } from '@angular/router';
import { MovieI } from '../interfaces/movie';
import { GenreI } from '../interfaces/genre';
import { ContentRatingI } from '../interfaces/contentRating';
import { LanguageI } from '../interfaces/language';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  banners: string[] = [];
  movies: MovieI[] = [];
  filteredMovies: MovieI[] = [];
  genres: GenreI[] = [];
  contentRatings: ContentRatingI[] = []; // Ejemplo de clasificaciones precargadas
  languages: LanguageI[] = []; // Ejemplo de idiomas precargados
  searchCriteria = {
    name: '',
    genre: '',
    contentRating: '',
    duration: '',
    language: '',
  };

  constructor(
    private homeService: HomeService,
    private subsidiaryService: SubsidiaryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchBanners();
    this.fetchMoviesInTheaters();
    this.fetchContentRatings();
    this.fetchGenres();
    this.fetchLanguages();
  }

  onSearch(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesName = this.searchCriteria.name ? movie.name.includes(this.searchCriteria.name) : true;
      const matchesGenre = this.searchCriteria.genre ? movie.genre.name === this.searchCriteria.genre : true;
      const matchesContentRating = this.searchCriteria.contentRating ? movie.contentRating.name === this.searchCriteria.contentRating : true;
      const matchesDuration = this.searchCriteria.duration ? this.filterByDuration(Number(movie.duration), this.searchCriteria.duration) : true;
      const matchesLanguage = this.searchCriteria.language ? movie.languages.some(language => language.name === this.searchCriteria.language) : true;
      return matchesName && matchesGenre && matchesContentRating && matchesDuration && matchesLanguage;
    });
  }

  filterByDuration(movieDuration: number, criteria: string): boolean {
    const [type, value] = criteria.split('-');
    const duration = parseInt(value, 10);
    if (type === 'less') {
      return movieDuration < duration;
    } else if (type === 'more') {
      return movieDuration > duration;
    }
    return true;
  }

  navigateToMovieDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  async fetchMoviesInTheaters() {
    try {
      const subsidiaryId = this.subsidiaryService.getSubsidiaryId();
      const subsidiaryMovies = await this.homeService.getMovies(subsidiaryId);
      console.log(subsidiaryMovies)
      this.movies = this.homeService.getMoviesWithShowsInNextTwoWeeks(subsidiaryMovies);
      this.filteredMovies = this.movies;
      console.log('Movies:', this.movies);
    } catch (error) {
      console.error('Error fetching movies in theaters:', error);
    }
  }

  loadPosterPreview(movieId: number): string {
    return this.homeService.getMoviePosterUrl(movieId);
  }

  async fetchGenres() {
    try {
      this.genres = await this.homeService.getGenres();
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }

  async fetchContentRatings() {
    try {
      this.contentRatings = await this.homeService.getContentRatings();
    } catch (error) {
      console.error('Error fetching content ratings:', error);
    }
  }

  async fetchLanguages() {
    try {
      this.languages = await this.homeService.getLanguages();
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }

  async fetchBanners() {
    try {
      this.banners = await this.homeService.getBanners();
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  }
}