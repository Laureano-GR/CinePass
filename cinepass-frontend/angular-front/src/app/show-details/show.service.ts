import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ShowI } from '../interfaces/show';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  private apiUrl = 'http://localhost:3001/shows'; // URL de la API
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    });
  }

  async getShowsByMovieAndSubsidiary(movieId: number, subsidiaryId: number): Promise<ShowI[]> {
    try {
      const response = await this.axiosInstance.get<ShowI[]>(`/filter-shows/${movieId}/${subsidiaryId}`);
      const shows = response.data;
      if (!shows) {
        throw new Error('Shows not found');
      }
      return shows;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching shows');
      } else {
        throw new Error('Error fetching shows');
      }
    }
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
      const dateUTC = new Date(show.dateAndTime);
      // Ajustar a GMT-3 restando 3 horas
      const dateGMT3 = new Date(dateUTC.getTime());
      const year = dateGMT3.getFullYear();
      const month = String(dateGMT3.getMonth() + 1).padStart(2, '0');
      const dayNum = String(dateGMT3.getDate()).padStart(2, '0');
      const day = `${year}-${month}-${dayNum}`; // YYYY-MM-DD
      const time = dateGMT3.toTimeString().split(' ')[0].slice(0, 5); // Formato HH:mm

      if (showMatrix[day]) {
        showMatrix[day].push({
          time: time,
          room: show.room,
          showType: show.showType,
          selectedLanguage: show.selectedLanguage,
          id: show.id,
        });
      }
    });

    Object.keys(showMatrix).forEach(day => {
      showMatrix[day].sort((a: { time: string }, b: { time: string }) => a.time.localeCompare(b.time));
    });

    return showMatrix;
  }

  async getShow(showId: number): Promise<ShowI> {
    try {
      const response = await this.axiosInstance.get<ShowI>(`/${showId}`);
      const show = response.data;
      if (!show) {
        throw new Error('Show not found');
      }
      return show;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching show');
      } else {
        throw new Error('Error fetching show');
      }
    }
  }

  getMoviePosterUrl(movieId: number): string {
    return `http://localhost:3001/movies/${movieId}/poster`;
  }
}