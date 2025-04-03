import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { PurchaseService } from './purchase-details.service';
import { PurchaseDTO } from '../interfaces/purchaseDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { IDTypeI } from '../interfaces/idType';
import { ShowI } from '../interfaces/show';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';
import { catchError, Observable, of } from 'rxjs';
import { LoadingService } from '../shared-components/loading-screen/loading.service';
import { PaymentMethodI } from '../interfaces/paymentMethod';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})

export class PurchaseDetailsComponent implements OnInit {
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


  constructor(
    private purchaseService: PurchaseService,
    private route: ActivatedRoute, 
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadDocumentTypes();
    this.loadAvailablePaymentMethods();
    
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
    this.purchaseService.getDocumentTypes().subscribe(types => {
      this.idTypes = types;
    });
  }

  loadAvailablePaymentMethods() {
    this.purchaseService.getAvailablePaymentMethods().subscribe(methods => {
      this.paymentMethods = methods;
    });
  }

  loadShow(showId: number): Observable<ShowI> {
    return this.purchaseService.getShow(showId).pipe(
      catchError(error => {
        console.error('Error getting show:', error);
        return of({} as ShowI);
      })
    );
  }

  onPaymentMethodChange(): void {
    this.showPaymentDetails = this.purchase.paymentMethod;
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
      totalPrice: this.totalPrice
    };
    
    this.loadingService.show();

    this.purchaseService.createSale(saleData)
      .then(response => {
        this.loadingService.hide();
        if (response && response.trim() !== '') {
          console.log('Sale created successfully:', response);
          this.showModal = true;
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