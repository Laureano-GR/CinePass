import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubsidiaryI } from './interfaces/subsidiary';
import axios from 'axios';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubsidiaryService {
  private url = 'http://localhost:3001'
  private subsidiarySubject = new BehaviorSubject<SubsidiaryI | null>(null);
  subsidiary$ = this.subsidiarySubject.asObservable();

  constructor() {
    const storedSubsidiary = sessionStorage.getItem('subsidiary');
    if (storedSubsidiary) {
      this.subsidiarySubject.next(JSON.parse(storedSubsidiary));
    }
  }

  setSubsidiary(subsidiary: SubsidiaryI) {
    sessionStorage.setItem('subsidiary', JSON.stringify(subsidiary));
    this.subsidiarySubject.next(subsidiary);
  }

  getSubsidiary(): SubsidiaryI | null {
    return this.subsidiarySubject.value;
  }

  getSubsidiaryId(): number {
    return this.subsidiarySubject.value?.id || 0;
  }

  clearSubsidiary() {
    sessionStorage.removeItem('subsidiary');
    this.subsidiarySubject.next(null);
  }

  getSubsidiaryCode(): string | null {
    return this.subsidiarySubject.value?.subsidiaryCode || null;
  }

  async getSubsidiaries(){
    try {
      const response = (await axios.get(`${this.url}/subsidiaries`)).data;
    return response;
    } catch (error) {
      throw new HttpErrorResponse({error});
    }
  }
}