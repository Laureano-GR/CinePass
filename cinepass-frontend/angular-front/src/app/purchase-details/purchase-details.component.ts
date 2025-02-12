import { Component, OnInit } from '@angular/core';
import { FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { PurchaseService } from './purchase-details.service';
import { PurchaseDTO } from '../interfaces/purchaseDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { IDTypeI } from '../interfaces/idType';
import { ShowI } from '../interfaces/show';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';
import { catchError, Observable, of } from 'rxjs';

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

  constructor(
    private purchaseService: PurchaseService,
    private route: ActivatedRoute, 
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDocumentTypes();
    
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

  loadShow(showId: number): Observable<ShowI> {
    return this.purchaseService.getShow(showId).pipe(
      catchError(error => {
        console.error('Error getting show:', error);
        return of({} as ShowI);
      })
    );
  }

  onSubmit() {
    if (!this.show.id) {
      console.error('Show not loaded');
      return;
    }
  
    // Transferir datos de PurchaseDTO a PaymentDataDTO
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
  
    this.purchaseService.createSale(saleData)
      .then(response => {
        if (response && response.trim() !== '') {
          console.log('Sale created successfully:', response);
          this.showModal = true;
        } else {
          console.error('Sale creation failed: response is null or empty');
        }
      })
      .catch(error => {
        console.error('Error creating sale:', error);
      });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/']);
  }
}