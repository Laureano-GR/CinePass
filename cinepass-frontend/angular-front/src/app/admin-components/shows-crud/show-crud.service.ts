import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShowI } from '../../interfaces/show';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getShowsBySubsidiary(subsidiaryId: number): Observable<ShowI[]> {
    return this.http.get<ShowI[]>(`${this.apiUrl}/subsidiaries/shows/${subsidiaryId}`);
  }
}