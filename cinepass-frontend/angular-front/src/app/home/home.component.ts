import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service'; 
import { SubsidiaryService } from '../subsidiary.service';
import { Router } from '@angular/router';
import { MovieI } from '../interfaces/movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'Bienvenido a nuestro Cine';
  movies: MovieI[] = [];

  constructor(
    private homeService: HomeService,
    private subsidiaryService: SubsidiaryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMoviesInTheaters();
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
      console.log('Movies:', this.movies);
    } catch (error) {
      console.error('Error fetching movies in theaters:', error);
    }
  }

  loadPosterPreview(movieId: number): string {
    return this.homeService.getMoviePosterUrl(movieId);
  }
}