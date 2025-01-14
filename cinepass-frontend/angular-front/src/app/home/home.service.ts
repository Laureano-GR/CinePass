import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import axios from 'axios';
import { MovieI } from '../interfaces/movie';
import { ShowI } from '../interfaces/show';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = 'http://localhost:3001';  // Asegúrate de que la URL sea correcta.

  constructor() {}

  // Método para obtener las películas filtradas por sucursal
}