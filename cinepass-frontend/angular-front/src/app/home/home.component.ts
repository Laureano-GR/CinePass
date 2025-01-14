import { Component } from '@angular/core';
import { HomeService } from './home.service'; 
import { SubsidiaryService } from '../subsidiary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'Bienvenido a nuestro Cine';
  movies: any[] = [];

  constructor(
    private homeService: HomeService,
    private subsidiaryService: SubsidiaryService,
  ) {}

  ngOnInit() {
    this.fetchMovies();
  }

  async fetchMovies(){
    const subsidiaryId = this.subsidiaryService.getSubsidiaryId();
    this.movies = await this.homeService.getMovies(subsidiaryId);
  }
}