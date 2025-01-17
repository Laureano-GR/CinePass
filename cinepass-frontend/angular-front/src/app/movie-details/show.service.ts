import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShowI } from '../interfaces/show';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private apiUrl = 'http://localhost:3001/shows';  // URL de la API

  constructor(private http: HttpClient) {} // Inyectar el servicio ShowService

  async getShowsByMovieAndSubsidiary(movieId: number, subsidiaryId: number): Promise<ShowI[]> {
    return this.http.get<ShowI[]>(`${this.apiUrl}/filterShows/${movieId}/${subsidiaryId}`).toPromise().then(shows => {
      if (!shows) {
        throw new Error('Shows not found');
      }
      return shows;
    });
  }

  createShowMatrix(shows: ShowI[]): any {
    const showMatrix: any = {};
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    for (let d = new Date(today); d <= twoWeeksFromNow; d.setDate(d.getDate() + 1)) {
      const day = d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      showMatrix[day] = [];
    }

    shows.forEach(show => {
      const date = new Date(show.dateAndTime);
      const day = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const time = date.toTimeString().split(' ')[0].slice(0, 5); // Formato HH:mm
      
      if (showMatrix[day]) {
        showMatrix[day].push({
          time: time,
          room: show.room,
          showType: show.showType,
          selectedLanguage: show.selectedLanguage,
          id: show.id
        });
      }
    });
    
    Object.keys(showMatrix).forEach(day => {
      showMatrix[day].sort((a: { time: string; }, b: { time: any; }) => a.time.localeCompare(b.time));
    });

    return showMatrix;
  }

}