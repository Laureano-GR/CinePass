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
  availableTickets: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    console.log('ngOnInit called');
    this.route.params.subscribe(params => {
      const showId = params['id'];
      console.log('Show ID:', showId);
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
      console.log('loadShow called with ID:', id);
      this.loading = true;
      this.show = await this.showService.getShow(id);
      console.log('Show loaded:', this.show); // Agregar log para verificar los datos

      // Calcular la cantidad de entradas vendidas y disponibles
      this.ticketsSold = this.show.tickets.length; // Suponiendo que `tickets` es un array de entradas vendidas
      this.availableTickets = this.show.room.capacity - this.ticketsSold;

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
    console.log('Comprar entradas para el show:', this.show?.id, 'Cantidad:', this.ticketQuantity);
    this.router.navigate(['/buy-tickets', this.show?.id, { quantity: this.ticketQuantity }]);
  }
}


