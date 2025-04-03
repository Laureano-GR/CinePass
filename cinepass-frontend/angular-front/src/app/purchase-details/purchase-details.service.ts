import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IDTypeI } from '../interfaces/idType';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';
import { PaymentMethodI } from '../interfaces/paymentMethod';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3001';
  
  constructor() {}

  getDocumentTypes(): Observable<IDTypeI[]> {
    return from(axios.get<IDTypeI[]>(`${this.apiUrl}/id-types`)).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error getting document types:', error);
        return of([]);
      })
    );
  }

  getShow(showId: number): Observable<any> {
    return from(axios.get(`${this.apiUrl}/shows/${showId}`)).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error getting show:', error);
        return of(null);
      })
    );
  }

  createSale(saleData: CreateSaleDTO): Promise<string | null> {
    return from(axios.post(`${this.apiUrl}/sales`, saleData, { responseType: 'text' })).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error creating sale:', error);
        return of(null);
      })
    ).toPromise();
  }

  getAvailablePaymentMethods(): Observable<PaymentMethodI[]> { // Este metodo trae todos los metodos de pago menos el de efectivo ya que online no se puede pagar de esta manera
    return from(axios.get<PaymentMethodI[]>(`${this.apiUrl}/payment-methods`)).pipe(
      map(response => response.data.filter(method => method.name !== 'Efectivo')),
      catchError(error => {
        console.error('Error getting payment methods:', error);
        return of([]);
      })
    );
  }
}