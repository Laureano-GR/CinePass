import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ProcessSaleService } from './process-sale.service';
import { PurchaseDTO } from '../interfaces/purchaseDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { IDTypeI } from '../interfaces/idType';
import { ShowI } from '../interfaces/show';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';
import { catchError, Observable, of } from 'rxjs';
import { LoadingService } from '../shared-components/loading-screen/loading.service';
import { PaymentMethodI } from '../interfaces/paymentMethod';

@Component({
  selector: 'app-process-sale',
  templateUrl: './process-sale.component.html',
  styleUrls: ['./process-sale.component.css']
})

export class ProcessSaleComponent implements OnInit {
  purchase: PurchaseDTO = {} as PurchaseDTO;
  paymentData: PaymentDataDTO = {} as PaymentDataDTO;
  idTypes: IDTypeI[] = [];
  show: ShowI = {} as ShowI;
  quantity: number = 0;
  totalPrice: number = 0;
  showModal: boolean = false;
  expiryDateError: string | null = null;
  paymentMethods: PaymentMethodI[] = [];
  showPaymentDetails: number | null = null;
  isOnline: boolean = false; // Variable para determinar si está en modo online
  isCashPayment: boolean = false; // Variable para verificar si es efectivo
  asciiReceipt: string = ''; // Variable para almacenar el recibo ASCII

  constructor(
    private processSaleService: ProcessSaleService,
    private route: ActivatedRoute, 
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    // Determina el modo de operación según la URL
    this.route.url.subscribe(url => {
      this.isOnline = !(url.some(segment => segment.path === 'create'));
    });

    this.loadDocumentTypes();
    
    this.loadPaymentMethods(this.isOnline);
    console.log('es online:',this.isOnline);
    this.route.params.subscribe(params => {
      this.loadShow(+params['showId']).subscribe(show => {
        this.show = show;
      });
    });
  
    this.route.queryParams.subscribe(queryParams => {
      this.quantity = +queryParams['quantity'];
      this.totalPrice = +queryParams['totalPrice'];
    });
  }

  loadDocumentTypes() {
    this.processSaleService
    .getDocumentTypes().subscribe(types => {
      this.idTypes = types;
    });
  }

  loadPaymentMethods(isOnline: boolean) {
    this.processSaleService
    .getPaymentMethods(isOnline).subscribe(methods => {
      this.paymentMethods = methods;
    });
  }

  loadShow(showId: number): Observable<ShowI> {
    return this.processSaleService
    .getShow(showId).pipe(
      catchError(error => {
        console.error('Error getting show:', error);
        return of({} as ShowI);
      })
    );
  }

  onPaymentMethodChange(): void {
    this.showPaymentDetails = this.purchase.paymentMethod;
    const selectedMethod = this.paymentMethods.find(method => method.id === +this.purchase.paymentMethod);
    this.isCashPayment = selectedMethod?.name == 'Efectivo'; // Verifica si el método es "Efectivo"
  }

  onSubmit() {
    if (!this.show.id) {
      console.error('Show not loaded');
      return;
    }
  
    const selectedPaymentMethod = this.paymentMethods.find(method => method.id == this.purchase.paymentMethod);
    
  
    if (!selectedPaymentMethod) {
      console.error('Selected payment method not found');
      return;
    }

    // Transferir datos de PurchaseDTO a PaymentDataDTO
    this.paymentData.paymentMethod = selectedPaymentMethod;
    this.paymentData.name = this.purchase.name;
    this.paymentData.IDNumber = this.purchase.idNumber;
    this.paymentData.email = this.purchase.email;
    this.paymentData.IDType = this.purchase.idType;
  
    const saleData: CreateSaleDTO = {
      show: this.show,
      ticketsAmount: this.quantity,
      paymentData: this.paymentData,
      totalPrice: this.totalPrice,
      isOnline: this.isOnline
    };
    
    this.loadingService.show();

    this.processSaleService
    .createSale(saleData)
    .then(response => {
      this.loadingService.hide();

      if (response && response.trim() !== '') {
        if (this.isOnline) {
          console.log('Online sale created successfully:', response);
        } else {
          console.log('Presential sale created successfully:', response);
          this.asciiReceipt = response; // Asigna el recibo ASCII si no es online
        }
        this.showModal = true; // Muestra el modal en ambos casos
      } else {
        console.error('Sale creation failed: response is null or empty');
      }
    })
    .catch(error => {
      this.loadingService.hide();
      console.error('Error creating sale:', error);
    });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/']);
  }

  validateExpiryDate(): void {
    const expiryDate = this.purchase.expiryDate;
    this.expiryDateError = null; // Reinicia el error

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      this.expiryDateError = 'El formato debe ser MM/YY.';
      return;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const currentYear = currentDate.getFullYear() % 100; // Tomar los últimos dos dígitos del año

    if (month < 1 || month > 12) {
      this.expiryDateError = 'El mes debe estar entre 01 y 12.';
      return;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.expiryDateError = 'La fecha debe ser mayor o igual a la actual.';
      return;
    }
  }
}