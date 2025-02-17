import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie-crud.service';
import { MovieI } from '../../../interfaces/movie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {
  movies: MovieI[] = [];
  subsidiaryId: number;
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private movieService: MovieService) {
    const subsidiary = sessionStorage.getItem('subsidiary');
    if (subsidiary) {
      this.subsidiaryId = JSON.parse(subsidiary).id;
    } else {
      // Manejar el caso en el que no se haya seleccionado una sucursal
      this.subsidiaryId = 0; // O algún valor por defecto
    }
  }

  ngOnInit(): void {
    if (this.subsidiaryId) {
      this.movieService.getMoviesBySubsidiary(this.subsidiaryId).subscribe(
        (movies) => {
          this.movies = movies;
          this.sort('id'); // Ordenar por defecto por ID de menor a mayor
        },
        (error) => {
          console.error('Error al obtener las películas:', error);
        }
      );
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.movies.sort((a, b) => {
      const valueA = this.getValue(a, column);
      const valueB = this.getValue(b, column);

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getValue(movie: MovieI, column: string): any {
    switch (column) {
      case 'id':
        return movie.id;
      case 'name':
        return movie.name;
      case 'duration':
        return movie.duration;
      case 'contentRating':
        return movie.contentRating;
      case 'genre':
        return movie.genre.name;
      case 'languages':
        return this.getLanguages(movie);
      default:
        return '';
    }
  }

  getLanguages(movie: MovieI): string {
    return movie.languages.map((language: { name: string }) => language.name).join(', ');
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  }
}