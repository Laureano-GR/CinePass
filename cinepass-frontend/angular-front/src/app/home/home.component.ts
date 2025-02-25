import { Component } from '@angular/core';
import { HomeService } from './home.service'; 
import { SubsidiaryService } from '../subsidiary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'Bienvenido a nuestro Cine';
  movies: any[] = [];

  constructor(
    private homeService: HomeService,
    private subsidiaryService: SubsidiaryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMovies();
  }

  navigateToMovieDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  async fetchMovies(){
    const subsidiaryId = this.subsidiaryService.getSubsidiaryId();
    this.movies = await this.homeService.getMovies(subsidiaryId);
  }

  loadPosterPreview(movieId: number): string {
    return this.homeService.getMoviePosterUrl(movieId!);
  }
}