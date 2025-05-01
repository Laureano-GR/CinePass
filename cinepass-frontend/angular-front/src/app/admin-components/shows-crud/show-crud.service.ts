import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { CreateShowDto } from '../../interfaces/createShowDTO';
import { UpdateShowDto } from '../../interfaces/updateShowDTO';
import { MovieI } from '../../interfaces/movie';
import { ShowTypeI } from '../../interfaces/showType';
import { LanguageI } from '../../interfaces/language';
import { RoomI } from '../../interfaces/room';
import { ShowI } from '../../interfaces/show';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  private apiUrl = 'http://localhost:3001';
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
    });
  }

  async getShowsBySubsidiary(subsidiaryId: number): Promise<ShowI[]> {
    try {
      const response = await this.axiosInstance.get<ShowI[]>(`/subsidiaries/shows/${subsidiaryId}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching shows by subsidiary');
      } else {
        throw new Error('Error fetching shows by subsidiary');
      }
    }
  }

  async getShowById(id: number): Promise<ShowI> {
    try {
      const response = await this.axiosInstance.get<ShowI>(`/shows/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching show by ID');
      } else {
        throw new Error('Error fetching show by ID');
      }
    }
  }

  async createShow(showData: CreateShowDto): Promise<any> {
    try {
      const response = await this.axiosInstance.post<any>('/shows', showData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error creating show');
      } else {
        throw new Error('Error creating show');
      }
    }
  }

  async updateShow(id: number, showData: UpdateShowDto): Promise<any> {
    try {
      const response = await this.axiosInstance.put<any>(`/shows/update/${id}`, showData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error updating show');
      } else {
        throw new Error('Error updating show');
      }
    }
  }

  async getMovies(): Promise<MovieI[]> {
    try {
      const response = await this.axiosInstance.get<MovieI[]>('/movies');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching movies');
      } else {
        throw new Error('Error fetching movies');
      }
    }
  }

  async getShowTypes(): Promise<ShowTypeI[]> {
    try {
      const response = await this.axiosInstance.get<ShowTypeI[]>('/show-types');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching show types');
      } else {
        throw new Error('Error fetching show types');
      }
    }
  }

  async getLanguages(): Promise<LanguageI[]> {
    try {
      const response = await this.axiosInstance.get<LanguageI[]>('/languages');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching languages');
      } else {
        throw new Error('Error fetching languages');
      }
    }
  }

  async getSubsidiaryRooms(subsidiaryId: number): Promise<RoomI[]> {
    try {
      const response = await this.axiosInstance.get<RoomI[]>(`/subsidiaries/rooms/${subsidiaryId}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error fetching subsidiary rooms');
      } else {
        throw new Error('Error fetching subsidiary rooms');
      }
    }
  }
}