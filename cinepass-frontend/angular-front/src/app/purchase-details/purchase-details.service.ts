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

  //Devuelve un array con las IDs de los tickets creados
  createTickets(showId: number, ticketAmount: number): Observable<number[]> {
    return this.http.post<number[]>(`${this.apiUrl}/shows/${showId}/create-tickets`, { ticketAmount }).pipe(
      catchError(error => {
        console.error('Error creating tickets:', error);
        return of([]);
      })
    );
  }

  //Devuelve el ID del objeto de los datos de pago creado
  createPaymentData(name: string, IDNumber: string, email: string, IDType: number): Observable<number> {
    const paymentData: PaymentDataDTO = { IDNumber, name, email, IDType };
    return this.http.post<{ id: number }>(`${this.apiUrl}/payments-data`, paymentData).pipe(
      map(response => response.id),
      catchError(error => {
        console.error('Error creating payment data:', error);
        return of(0);
      })
    );
  }

  createSale(showId: number, ticketAmount: number, name: string, idNumber: string, email: string, idTypeId: number, totalPrice: number): Observable<any> {
    const currentDate = new Date();

    return this.createPaymentData(name, idNumber, email, idTypeId).pipe(
      switchMap(paymentDataId => {
        if (paymentDataId === 0) {
          throw new Error('Failed to create payment data');
        }
        return this.createTickets(showId, ticketAmount).pipe(
          switchMap(ticketIds => {
            if (ticketIds.length === 0) {
              throw new Error('Failed to create tickets');
            }
            const saleData = {
              date: currentDate,
              paymentDataId,
              ticketIds,
              ticketAmount,
              totalPrice
            };
            return this.http.post(`${this.apiUrl}/sales`, saleData).pipe(
              catchError(error => {
                console.error('Error creating sale:', error);
                return of(null);
              })
            );
          })
        );
      })
    );
  }
}
  
//Crear manejador que cree un mail con los datos que vayamos a enviar de las entradas en base al mail solicitado
