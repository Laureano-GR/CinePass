import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from './movie.service';
import { ShowService } from './show.service';
import { MovieI } from '../interfaces/movie';
import { ShowI } from '../interfaces/show';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: any | MovieI;
  shows: ShowI[] = [];
  loading: boolean = true;
  error: any | string ;
  showMatrix: any = {}; // Matriz para almacenar las funciones por día y hora
  selectedDay: string | null = null; // Día seleccionado para mostrar los shows

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private showService: ShowService // Inyectar el servicio ShowService
  ) {}

  ngOnInit() {
    console.log('ngOnInit called');
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      console.log('Movie ID:', movieId);
      if (movieId) {
        this.loadMovie(+movieId);
        const storedSubsidiaryId = sessionStorage.getItem('subsidiaryId');
        const subsidiaryId = storedSubsidiaryId ? +storedSubsidiaryId : 0;
        this.loadShows(+movieId, subsidiaryId);
      } else {
        this.error = 'No se proporcionó un ID de película válido.';
        this.loading = false;
      }
    });
  }

  async loadMovie(id: number) {
    try {
      console.log('loadMovie called with ID:', id);
      this.loading = true;
      this.movie = await this.movieService.getMovie(id);
      console.log('Movie loaded:', this.movie); // Agregar log para verificar los datos
      this.loading = false;
    } catch (error) {
      console.error('Error loading movie:', error);
      this.error = 'Hubo un error al cargar los detalles de la película. Por favor, intente de nuevo más tarde.';
      this.loading = false;
    }
  }

  async loadShows(movieId: number, subsidiaryId: number) {
    try {
      console.log('loadShows called with movieId:', movieId, 'and subsidiaryId:', subsidiaryId);
      this.loading = true;
      this.shows = await this.showService.getShowsByMovieAndSubsidiary(movieId, subsidiaryId);
      console.log('Shows loaded:', this.shows); // Agregar log para verificar los datos
      this.showMatrix = this.showService.createShowMatrix(this.shows);
      console.log('Show Matrix:', this.showMatrix); // Agregar log para verificar la matriz de shows
      this.loading = false;
    } catch (error) {
      console.error('Error loading shows:', error);
      this.error = 'Hubo un error al cargar las funciones. Por favor, intente de nuevo más tarde.';
      this.loading = false;
    }
  }

  getLanguages(): string {
    return this.movie.languages.map((language: { name: string }) => language.name).join(', ');
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
}