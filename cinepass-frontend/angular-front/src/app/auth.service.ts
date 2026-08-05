import { Injectable } from '@angular/core';
import axios from 'axios';
import { LoginI, RegisterI, TokenI } from './interfaces/token';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:3000';
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor() {
    const token = localStorage.getItem('token');
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!token);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  async login(body: LoginI): Promise<TokenI> {
    try {
      const subsidiary = sessionStorage.getItem('subsidiary');
      if (!subsidiary) {
        throw new Error('Sucursal no seleccionada');
      }

      const response = (await axios.post(`${this.url}/admins/login`, body)).data;
      localStorage.setItem('token', JSON.stringify(response));
      this.isLoggedInSubject.next(true);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpErrorResponse({
          error: error.response?.data,
          status: error.response?.status || 0,
          statusText: error.response?.statusText || 'Unknown Error',
        });
      } else {
        throw new HttpErrorResponse({ error });
      }
    }
  }

  async register(body: RegisterI): Promise<void> {
    try {
      return (await axios.post(`${this.url}/register`, body)).data;
    } catch (error) {
      throw new HttpErrorResponse({ error });
    }
  }

  async refreshToken() {
    const tokenObject:{refreshToken:string,accessToken:string,expirationTime:Date|string}=JSON.parse(localStorage.getItem('token')??"{refreshToken:''}")
    const response = (
      await axios.get(`${this.url}/refresh-token`, {
        headers: {
          'refresh-token': tokenObject.refreshToken
        },
      })
    ).data;
    tokenObject.accessToken = response.accessToken
    tokenObject.refreshToken =
      response?.refreshToken ?? tokenObject.refreshToken;
      tokenObject.expirationTime=response.expirationTime
    localStorage.setItem('token', JSON.stringify(tokenObject));
  }
}