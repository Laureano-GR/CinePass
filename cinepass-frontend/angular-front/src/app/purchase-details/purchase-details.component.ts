import { Component, OnInit } from '@angular/core';
import { FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { PurchaseService } from './purchase-details.service';
import { PurchaseDTO } from '../interfaces/purchaseDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { IDTypeI } from '../interfaces/idType';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';

@Component({
  selector: 'app-purchase-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})

export class PurchaseDetailsComponent implements OnInit {
  purchase: PurchaseDTO = {} as PurchaseDTO;
  paymentData: PaymentDataDTO = {} as PaymentDataDTO;
  idTypes: IDTypeI[] = [];
  showId: number = 0;
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
      this.showId = +params['showId'];
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

  onSubmit() {

    // Transferir datos de PurchaseDTO a PaymentDataDTO
    this.paymentData.name = this.purchase.name;
    this.paymentData.IDNumber = this.purchase.idNumber;
    this.paymentData.email = this.purchase.email;
    this.paymentData.IDType = this.purchase.idType;

    const saleData: CreateSaleDTO = {
      showId: this.showId,
      ticketsAmount: this.quantity,
      paymentData: this.paymentData,
      totalPrice: this.totalPrice
    };
    console.log(saleData)
    this.purchaseService.createSale(saleData).subscribe(
      response => {
        console.log('Sale created successfully:', response);
        this.showModal = true;
      },
      error => {
        console.error('Error creating sale:', error);
      }
    );
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/']);
  }

}