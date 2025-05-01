import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie-crud.service';
import { MovieI } from '../../../interfaces/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  selectedMovie: MovieI | null = null;
  filter: string = 'inTheaters';
  

  constructor(private movieService: MovieService, private router: Router) {
    const subsidiary = sessionStorage.getItem('subsidiary');
    if (subsidiary) {
      this.subsidiaryId = JSON.parse(subsidiary).id;
    } else {
      this.subsidiaryId = 0;
    }
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filter = selectElement.value;
    this.loadMovies();
  }

  loadMovies(): void {
    if (this.filter === 'subsidiary') {
      this.movieService.getMoviesBySubsidiary(this.subsidiaryId).subscribe(
        (movies) => {
          this.movies = movies;
          this.sort('');
          this.sort('id'); // Ordenar por defecto por ID de menor a mayor
        },
        (error) => {
          console.error('Error al obtener las películas:', error);
        }
      );
    } else if (this.filter === 'all') {
      this.movieService.getMovies().subscribe(
        (movies) => {
          this.movies = movies;
          this.sort('');
          this.sort('id'); // Ordenar por defecto por ID de menor a mayor
        },
        (error) => {
          console.error('Error al obtener todas las películas:', error);
        }
      );
    } else if (this.filter === 'inTheaters') {
      this.movieService.getMoviesBySubsidiary(this.subsidiaryId).subscribe(
        (movies) => {
          this.movies = this.movieService.getMoviesWithShowsInNextTwoWeeks(movies);
          this.sort('');
          this.sort('id'); // Ordenar por defecto por ID de menor a mayor
        },
        (error) => {
          console.error('Error al obtener las películas en cartelera:', error);
        }
      );
    }
  }

  selectMovie(movie: MovieI): void {
      this.selectedMovie = movie;
    }

  editMovie(): void {
    if (this.selectedMovie) {
      this.router.navigate(['/admin/movies/update', this.selectedMovie.id]);
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
      case 'showTypes':
        return this.getShowTypes(movie);
      default:
        return '';
    }
  }

  getLanguages(movie: MovieI): string {
    return movie.languages.map((language: { name: string }) => language.name).join(', ');
  }

  getShowTypes(movie: MovieI): string {
    return movie.showTypes.map((showType: { name: string }) => showType.name).join(', ');
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  }

  loadPosterPreview(movieId: number): string {
    return this.movieService.getPosterUrl(movieId!);
  }
}