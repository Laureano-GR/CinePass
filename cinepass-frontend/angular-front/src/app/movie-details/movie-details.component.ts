import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from './movie.service';
import { ShowService } from '../show-details/show.service';
import { MovieI } from '../interfaces/movie';
import { ShowI } from '../interfaces/show';
import { LoadingService } from '../shared-components/loading-screen/loading.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: MovieI = {} as MovieI;
  shows: ShowI[] = [];
  error: any | string ;
  showMatrix: any = {}; // Matriz para almacenar las funciones por día y hora
  selectedDay: string | null = null; // Día seleccionado para mostrar los shows

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private showService: ShowService, // Inyectar el servicio ShowService
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show()
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.loadMovie(+movieId);
        const storedSubsidiaryId = sessionStorage.getItem('subsidiaryId');
        const subsidiaryId = storedSubsidiaryId ? +storedSubsidiaryId : 0;
        this.loadShows(+movieId, subsidiaryId);
        this.loadingService.hide()
      } else {
        this.error = 'No se proporcionó un ID de película válido.';
        this.loadingService.hide();
      }
    });
  }

  async loadMovie(id: number) {
    try {
      this.movie = await this.movieService.getMovie(id);
    } catch (error) {
      console.error('Error loading movie:', error);
      this.error = 'Hubo un error al cargar los detalles de la película. Por favor, intente de nuevo más tarde.';
    }
  }

  async loadShows(movieId: number, subsidiaryId: number) {
    try {
      this.shows = await this.showService.getShowsByMovieAndSubsidiary(movieId, subsidiaryId);
      this.showMatrix = this.showService.createShowMatrix(this.shows);
    } catch (error) {
      console.error('Error loading shows:', error);
      this.error = 'Hubo un error al cargar las funciones. Por favor, intente de nuevo más tarde.';
    }
  }

  getLanguages(): string {
    return this.movie.languages.map((language: { name: string }) => language.name).join(', ');
  }

  getShowTypes(): string {
    return this.movie.showTypes.map((showType: { name: string }) => showType.name).join(', ');
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  formatLanguage(lang: string): string {
    return lang.slice(0, 3).toUpperCase();
  }

  selectDay(day: string) {
    this.selectedDay = this.selectedDay === day ? null : day;
  }

  navigateToShowDetails(showId: number) {
    this.router.navigate(['/show-details', showId]);
  }

  loadPosterPreview(movieId: number): string {
    return this.movieService.getMoviePosterUrl(movieId!);
  }
}