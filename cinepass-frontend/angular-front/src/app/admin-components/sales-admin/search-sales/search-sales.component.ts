import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)]
import { SaleI } from '../../../interfaces/sale';
import { SalesService } from '../sales.service';
import { LoadingService } from '../../../shared-components/loading-screen/loading.service';
import { ShowI } from '../../../interfaces/show';
import { PaymentMethodI } from '../../../interfaces/paymentMethod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-sales',
  templateUrl: './search-sales.component.html',
  styleUrls: ['./search-sales.component.css']
})
export class SearchSalesComponent implements OnInit {
  sales: SaleI[] = []; // Lista de ventas inicializada como vacía
  filteredSales: SaleI[] = []; // Ventas filtradas inicializada como vacía
  showModal: boolean = false;
  canceledSaleId: number | null = null; // Almacena el ID de la venta cancelada
  searchCriteria = {
    purchaseCode: '',
    date: '',
    canceled: '',
    paymentMethod: ''
  }; // Criterios de búsqueda
  selectedSale: SaleI | null = null; // Venta seleccionada para mostrar en el modal
  showDetails: ShowI | null = null; // Detalles del show
  paymentMethods: PaymentMethodI[] = []; // Métodos de pago

  constructor(
    private salesService: SalesService,
    private loadingService: LoadingService, // Inyecta el servicio de pantalla de carga
    private router: Router,
  ) {} // Inyecta el servicio

  ngOnInit(): void {
    this.fetchSales(); // Llama a la función fetchSales al inicializar el componente
  }

  fetchSales(): void {
    this.salesService.getSales().subscribe({
      next: (sales) => {
        this.sales = sales; // Asigna las ventas obtenidas
        console.log('Sales fetched:', this.sales); // Muestra las ventas en la consola
      },
      error: (err) => {
        console.error('Error fetching sales:', err);
      }
    });
  }

  onSearch(): void {
    console.log(this.searchCriteria);
    if (this.searchCriteria.purchaseCode || this.searchCriteria.date || this.searchCriteria.canceled || this.searchCriteria.paymentMethod) {
      this.filteredSales = this.sales.filter(sale => {
        // Extrae solo la parte del día de la fecha de la venta (formato yyyy-MM-dd)
        const saleDate = this.formatDate(new Date(sale.dateAndTime));
        return (
          (!this.searchCriteria.purchaseCode || this.comparePurchaseCode(sale, this.searchCriteria.purchaseCode)) &&
          (!this.searchCriteria.date || saleDate === this.searchCriteria.date));
      });
    } else {
      this.filteredSales = [];
    }
  }
  
  /**
   * Formatea una fecha en el formato dd-mm-yyyy.
   */
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  resetFilters(): void {
    this.searchCriteria = {
      purchaseCode: '',
      date: '',
      canceled: '',
      paymentMethod: ''
    };
    this.onSearch()
  }

  openDetails(sale: SaleI): void {
    console.log(sale.show)
    this.loadingService.show(); // Muestra la pantalla de carga
    this.salesService.getShowDetails(sale.show.id).subscribe({
      next: (details) => {
        this.showDetails = details; // Asigna los detalles del show
        this.selectedSale = sale; // Asigna la venta seleccionada
        this.loadingService.hide(); // Oculta la pantalla de carga
      },
      error: (err) => {
        console.error('Error fetching show details:', err);
        this.loadingService.hide(); // Oculta la pantalla de carga incluso si hay un error
      }
    });
  }

  closeDetails(): void {
    this.selectedSale = null;
    this.showDetails = null; // Limpia los detalles del show
  }

  cancelSale(saleId: number): void {
    this.loadingService.show(); // Muestra la barra de carga

    this.salesService.cancelSale(saleId).subscribe({
      next: () => {
        this.loadingService.hide(); // Oculta la barra de carga
        this.canceledSaleId = saleId; // Almacena el ID de la venta cancelada
        this.showModal=true; // Muestra el modal de éxito
        //this.fetchSales(); // Actualiza la lista de ventas
      },
      error: (err) => {
        console.error('Error canceling sale:', err);
        this.loadingService.hide(); // Oculta la barra de carga incluso si hay un error
      }
    });

  }

  closeModal() {
    this.showModal = false;
    this.canceledSaleId = null; // Limpia el ID de la venta cancelada
    this.router.navigate(['admin/dashboard']);
  }

  comparePurchaseCode(sale: SaleI, purchaseCode: string): boolean {
    // Verifica que el código de compra comience con "CINEPASS-"
    if (!purchaseCode.startsWith('CINEPASS-')) {
      console.error('El código de compra no comienza con "CINEPASS-":', purchaseCode);
      return false;
    }
  
    // Divide el código de compra en partes usando el guion como separador
    const parts = purchaseCode.split('-');
  
    // Verifica que el código tenga exactamente tres partes
    if (parts.length !== 3) {
      console.error('Formato de código de compra inválido:', purchaseCode);
      return false;
    }
  
    // Asigna las partes correspondientes
    const purchaseCodeSaleId = parts[1]; // Número posterior al primer guion
    const purchaseCodeIdNumber = parts[2]; // Número posterior al segundo guion
  
    // Compara los valores con los datos de la venta
    return (
      sale.id.toString() === purchaseCodeSaleId &&
      sale.paymentData.IDNumber.toString() === purchaseCodeIdNumber
    );
  }
}
