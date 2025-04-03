import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateShowDto } from '../../interfaces/createShowDTO';
import { UpdateShowDto } from '../../interfaces/updateShowDTO';
import { MovieI } from '../../interfaces/movie';
import { ShowTypeI } from '../../interfaces/showType';
import { LanguageI } from '../../interfaces/language';
import { RoomI } from '../../interfaces/room';
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

  getShowById(id: number): Observable<ShowI> {
    return this.http.get<ShowI>(`${this.apiUrl}/shows/${id}`);
  }

  // Crear función
  createShow(showData: CreateShowDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shows`, showData);
  }

  // Actualizar función
  updateShow(id: number, showData: UpdateShowDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/shows/update/${id}`, showData);
  }

  // Métodos para obtener datos relacionados

  // Obtiene películas (suponiendo que el endpoint esté en este servicio)
  getMovies(): Observable<MovieI[]> {
    return this.http.get<MovieI[]>(`${this.apiUrl}/movies`);
  }

  // Obtiene los tipos de función
  getShowTypes(): Observable<ShowTypeI[]> {
    return this.http.get<ShowTypeI[]>(`${this.apiUrl}/show-types`);
  }

  // Obtiene idiomas disponibles
  getLanguages(): Observable<LanguageI[]> {
    return this.http.get<LanguageI[]>(`${this.apiUrl}/languages`);
  }

  getSubsidiaryRooms(subsidiaryId: number): Observable<RoomI[]> {
    return this.http.get<RoomI[]>(`${this.apiUrl}/subsidiaries/rooms/${subsidiaryId}`);
  }
}