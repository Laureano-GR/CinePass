import { Component } from '@angular/core';
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
export class SearchSalesComponent {
  sales: SaleI[] = []; // Lista de ventas inicializada como vacía
  filteredSales: SaleI[] = []; // Ventas filtradas inicializada como vacía
  showModal: boolean = false;
  canceledSaleId: number | null = null; // Almacena el ID de la venta cancelada
  searchCriteria = {
    purchaseCode: '',
    dateFrom: '',
    dateTo: ''
  }; // Criterios de búsqueda
  selectedSale: SaleI | null = null; // Venta seleccionada para mostrar en el modal
  showDetails: ShowI | null = null; // Detalles del show
  paymentMethods: PaymentMethodI[] = []; // Métodos de pago

  constructor(
    private salesService: SalesService,
    private loadingService: LoadingService, // Inyecta el servicio de pantalla de carga
    private router: Router,
  ) {} // Inyecta el servicio

  onSearch(): void {
    console.log('Buscando ventas con criterios:', this.searchCriteria);
    const { purchaseCode, dateFrom, dateTo } = this.searchCriteria;
    let purchaseId: number | undefined;
    let documentNumber: string | undefined;

    if (purchaseCode) {
      const parts = purchaseCode.split('-');
      if (parts.length === 3 && parts[0] === 'CINEPASS') {
        purchaseId = parseInt(parts[1], 10);
        documentNumber = parts[2];
      } else {
        console.error('Invalid purchase code format');
        return;
      }
    }

    this.salesService.findSales(purchaseId, documentNumber, dateFrom, dateTo).subscribe({
      next: (sales) => {
        this.filteredSales = sales;
      },
      error: (err) => {
        console.error('Error finding sales:', err);
      }
    });
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
      dateFrom: '',
      dateTo: ''
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
    this.closeDetails(); // Limpia la venta seleccionada y los detalles
    this.onSearch(); // Vuelve a buscar las ventas para actualizar la lista
  }

  navigate() {
    this.showModal = false;
    this.canceledSaleId = null; // Limpia el ID de la venta cancelada
    this.router.navigate(['/admin/dashboard']); // Navega a la página de ventas
  }

  confirmCancelSale(saleId: number): void {
    const confirmation = window.confirm('¿Estás seguro de que quieres cancelar esta venta?');
    if (confirmation) {
      this.cancelSale(saleId);
    }
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
