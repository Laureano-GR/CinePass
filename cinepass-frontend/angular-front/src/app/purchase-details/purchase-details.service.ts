import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
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

  createSale(saleData: CreateSaleDTO): Observable<any> {
    console.log('Sending sale data:', saleData); // Agregar este log para verificar los datos
    return this.http.post(`${this.apiUrl}/sales`, saleData).pipe(
      catchError(error => {
        console.error('Error creating sale:', error);
        return of(null);
      })
    );
  }
//Crear manejador que cree un mail con los datos que vayamos a enviar de las entradas en base al mail solicitado
}