import { Component, OnInit } from '@angular/core';
import { ShowService } from './show.service';
import { ShowI } from '../interfaces/show';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrl: './show-details.component.css',
  providers: [DatePipe]
})
export class ShowDetailsComponent {
  show: any | ShowI;
  loading: boolean = true;
  error: any | string ;
  ticketQuantity: number = 1;
  ticketsSold: number = 0;
  ticketPrice: number = 0;
  availableTickets: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const showId = params['id'];
      if (showId) {
        this.loadShow(+showId);
      } else {
        this.error = 'No se proporcionó un ID de show válido.';
        this.loading = false;
      }
    });
  }

  async loadShow(id: number) {
    try {
      this.loading = true;
      this.show = await this.showService.getShow(id);

      // Calcular la cantidad de entradas vendidas y disponibles
      this.ticketsSold = this.show.tickets.length; // Suponiendo que `tickets` es un array de entradas vendidas
      this.availableTickets = this.show.room.capacity - this.ticketsSold;

      // Asignar el precio de la entrada
      this.ticketPrice = this.show.showType.ticketPrice;
      
      this.loading = false;
    } catch (error) {
      console.error('Error loading show:', error);
      this.error = 'Hubo un error al cargar los detalles del show. Por favor, intente de nuevo más tarde.';
      this.loading = false;
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'EEEE, d MMMM', 'es-ES') || date;
  }

  buyTickets() {
    this.router.navigate(['/purchase', this.show?.id], {
      queryParams: {
        quantity: this.ticketQuantity,
        totalPrice: this.ticketQuantity * this.ticketPrice
      }
    });
  }

  loadPosterPreview(movieId: number): string {
    return this.showService.getMoviePosterUrl(movieId!);
  }
}