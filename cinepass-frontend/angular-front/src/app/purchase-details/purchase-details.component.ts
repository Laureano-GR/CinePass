import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from './purchase-details.service';
import { PurchaseDTO } from '../interfaces/purchaseDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { IDTypeI } from '../interfaces/idType';

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

  constructor(private purchaseService: PurchaseService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadDocumentTypes();
    this.route.queryParams.subscribe(params => {
      this.showId = +params['showId'];
      this.quantity = +params['quantity'];
      this.totalPrice = +params['totalPrice'];
    });
  }

  loadDocumentTypes() {
    this.purchaseService.getDocumentTypes().subscribe(types => {
      this.idTypes = types;
    });
  }

  onSubmit() {
    this.paymentData.IDType = this.purchase.idType;
    this.paymentData.name = this.purchase.name;
    this.paymentData.IDNumber = this.purchase.idNumber;
    this.paymentData.email = this.purchase.email;

    this.purchaseService.createSale(this.showId, this.quantity, this.paymentData.name, this.paymentData.IDNumber, this.paymentData.email, this.paymentData.IDType, this.totalPrice).subscribe(
      response => {
        console.log('Sale created successfully:', response);
        // Redireccionar a la pantalla de éxito
      },
      error => {
        console.error('Error creating sale:', error);
      }
    );
  }
}