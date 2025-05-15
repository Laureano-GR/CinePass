import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesService } from '../sales.service';
import { MovieI } from '../../../interfaces/movie';
import { ShowI } from '../../../interfaces/show';

@Component({
  selector: 'app-select-sale-data',
  templateUrl: './select-sale-data.component.html',
  styleUrls: ['./select-sale-data.component.css']
})
export class SelectSaleDataComponent {
  movies: MovieI[] = [] as MovieI[]; // Lista de películas disponibles
  shows: ShowI[] = [] as ShowI[]; // Lista de funciones disponibles
  selectedMovieId: number | null = null; // ID de la película seleccionada
  selectedShowId: number | null = null; // ID del show seleccionado
  ticketQuantity: number = 1; // Cantidad de entradas seleccionadas
  ticketPrice: number = 0; // Precio por entrada
  availableTickets: number = 0; // Entradas disponibles para el show seleccionado
  show: ShowI = {} as ShowI; // Detalles del show seleccionado
  movie: MovieI = {} as MovieI; // Detalles de la película seleccionada
  loading: boolean = false; // Controla el estado de carga
  error: string | null = null; // Mensaje de error
  subsidiaryId: number | null = null; // ID de la sucursal actual

  constructor(
    private router: Router, 
    private service:SalesService
  ) {}

  ngOnInit(): void {
    this.loadSubsidiaryIdFromSession(); // Carga el subsidiaryId desde el sessionStorage
    this.fetchMoviesInTheaters(); // Carga las películas en cartelera al iniciar
  }
  
  loadSubsidiaryIdFromSession(): void {
    const storedSubsidiaryId = sessionStorage.getItem('subsidiaryId');
    if (storedSubsidiaryId) {
      this.subsidiaryId = +storedSubsidiaryId; // Convierte el valor a número
    } else {
      console.error('No se encontró el subsidiaryId en el sessionStorage.');
      this.error = 'No se pudo cargar la sucursal actual. Por favor, intente de nuevo.';
    }
  }

  async fetchMoviesInTheaters(): Promise<void> {
    if (!this.subsidiaryId) {
      console.error('El subsidiaryId no está definido.');
      this.error = 'No se pudo cargar la sucursal actual. Por favor, intente de nuevo.';
      return;
    }

    try {
      this.movies = await this.service.getUpcomingMovies(this.subsidiaryId);
    } catch (error) {
      console.error('Error fetching movies in theaters:', error);
      this.error = 'Hubo un error al cargar las películas. Por favor, intente de nuevo más tarde.';
    }
  }

  async loadShows(movieId: number | null): Promise<void> {
    if (movieId === null || !this.subsidiaryId) return; // Verifica que el ID no sea null y que subsidiaryId esté definido
    try {
      this.selectedShowId = null; // Reinicia el show seleccionado
      this.ticketQuantity = 1; // Reinicia la cantidad de entradas
      this.shows = await this.service.getShowsByMovieAndSubsidiary(movieId, this.subsidiaryId);
    } catch (error) {
      console.error('Error loading shows:', error);
      this.error = 'Hubo un error al cargar las funciones. Por favor, intente de nuevo más tarde.';
    }
  }

  async loadMovieDetails(movieId: number | null): Promise<void> {
    if (movieId === null) return; // Verifica que el ID no sea null
    try {
      this.loading = true; // Activa el estado de carga
      this.movie = await this.service.getMovie(movieId); // Obtiene los detalles de la película
      this.loading = false; // Desactiva el estado de carga
    } catch (error) {
      console.error('Error loading movie details:', error);
      this.error = 'Hubo un error al cargar los detalles de la película. Por favor, intente de nuevo más tarde.';
      this.loading = false; // Asegura que el estado de carga se desactive incluso en caso de error
    }
  }

  async loadShowDetails(showId: number | null): Promise<void> {
    if (showId === null) return; // Verifica que el ID no sea null
    try {
      this.loading = true;
      this.show = await this.service.getShow(showId);
      this.availableTickets = this.show.room.capacity - this.show.tickets.length;
      this.ticketPrice = this.show.showType.ticketPrice;
      this.loading = false;
    } catch (error) {
      console.error('Error loading show details:', error);
      this.error = 'Hubo un error al cargar los detalles del show. Por favor, intente de nuevo más tarde.';
      this.loading = false;
    }
  }

  onSubmit(): void {
    // Validación del formulario
    if (!this.selectedMovieId || !this.selectedShowId || this.ticketQuantity <= 0) {
      console.error('Formulario incompleto o inválido');
      return;
    }
  
    // Navegación a la página de creación de ventas
    this.router.navigate(['admin/sales/create', this.show?.id], {
      queryParams: {
        quantity: this.ticketQuantity,
        totalPrice: this.ticketQuantity * this.ticketPrice
      }
    });
  }

  onMovieChange(event: Event): void {
    const movieId = +(event.target as HTMLSelectElement).value; // Obtiene el ID de la película seleccionada
    this.selectedMovieId = movieId; // Actualiza el ID de la película seleccionada
    this.loadMovieDetails(movieId); // Llama al método para cargar los detalles de la película
    this.loadShows(movieId); // Llama al método para cargar las funciones de la película
  }

  getMovieLanguages(): string {
    return this.movie.languages.map((language: { name: string }) => language.name).join(', ');
  }

  getMovieShowTypes(): string {
    return this.movie.showTypes.map((showType: { name: string }) => showType.name).join(', ');
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}