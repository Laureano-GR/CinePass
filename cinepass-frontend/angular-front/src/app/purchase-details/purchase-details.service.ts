import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { IDTypeI } from '../interfaces/idType';
import { CreateSaleDTO } from '../interfaces/createSaleDTO';
import { PaymentDataDTO } from '../interfaces/paymentDataDTO';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3001';
  
  constructor(private http: HttpClient) {}

  getDocumentTypes(): Observable<IDTypeI[]> {
    return this.http.get<IDTypeI[]>(`${this.apiUrl}/id-types`);
  }

  getShow(showId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/shows/${showId}`).pipe(
      catchError(error => {
        console.error('Error getting show:', error);
        return of(null);
      })
    );
  }

  createSale(saleData: CreateSaleDTO): Promise<string | null> {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/sales`, saleData, { responseType: 'text' }).pipe(
        catchError(error => {
          console.error('Error creating sale:', error);
          return of(null);
        })
      )
    );
  }
}