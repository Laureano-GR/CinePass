import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { SubsidiaryService } from '../subsidiary.service';
import { HomeService } from './home.service'; 
import { MovieI } from '../interfaces/movie';
import { ShowI } from '../interfaces/show';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  bannerImageUrl = 'assets/banners/banner.png'; // Ruta a la imagen de banner

  constructor() {}
  ngOnInit(): void {}
}
