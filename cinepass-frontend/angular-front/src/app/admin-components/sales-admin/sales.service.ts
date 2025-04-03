import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { SaleI } from '../../interfaces/sale';
import { ShowI } from '../../interfaces/show';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:3001';

  constructor() {}

  getSales(): Observable<SaleI[]> {
    return from(
      axios.get<SaleI[]>(`${this.apiUrl}/sales`).then(response => response.data)
    );
  }

  getShowDetails(showId: number): Observable<ShowI> {
    return from(
      axios.get<ShowI>(`${this.apiUrl}/shows/${showId}`).then(response => response.data)
    );
  } 

  getPaymentMethods(): Observable<any[]> {
    return from(
      axios.get<any[]>(`${this.apiUrl}/payment-methods`).then(response => response.data)
    );
  }
}