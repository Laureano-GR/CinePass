import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service'; 
import { SubsidiaryService } from '../subsidiary.service';
import { Router } from '@angular/router';
import { MovieI } from '../interfaces/movie';
import { GenreI } from '../interfaces/genre';
import { ContentRatingI } from '../interfaces/contentRating';
import { LanguageI } from '../interfaces/language';
import { ShowTypeI } from '../interfaces/showType';
import Swiper from 'swiper/bundle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  banners: string[] = [];
  movies: MovieI[] = [];
  filteredMovies: MovieI[] = [];
  genres: GenreI[] = [];
  contentRatings: ContentRatingI[] = []; // Ejemplo de clasificaciones precargadas
  languages: LanguageI[] = []; // Ejemplo de idiomas precargados
  showTypes: ShowTypeI[] = []; // Ejemplo de tipos de show precargados
  searchCriteria = {
    name: '',
    genre: '',
    contentRating: '',
    duration: '',
    language: '',
    showType: '',
  };
  activeFilters = { ...this.searchCriteria };

  durationOptions = [
    { value: '', label: 'Duración' },
    { value: 'less-60', label: 'Menos de 1 hora' },
    { value: 'less-90', label: 'Menos de 1.5 horas' },
    { value: 'less-120', label: 'Menos de 2 horas' },
    { value: 'less-150', label: 'Menos de 2.5 horas' },
    { value: 'more-60', label: 'Más de 1 hora' },
    { value: 'more-90', label: 'Más de 1.5 horas' },
    { value: 'more-120', label: 'Más de 2 horas' },
    { value: 'more-150', label: 'Más de 2.5 horas' },
  ];
  filtersApplied: boolean = false;

  constructor(
    private homeService: HomeService,
    private subsidiaryService: SubsidiaryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchBanners();
    this.fetchMoviesInTheaters();
    this.fetchContentRatings();
    this.fetchGenres();
    this.fetchLanguages();
    this.fetchShowTypes();

    setTimeout(() => {
      new Swiper('.swiper', {
        slidesPerView: 1.05, // Muestra 1.2 slides (el actual y parte del siguiente)
        centeredSlides: true, // Centra el slide activo
        spaceBetween: 3, // Espacio entre las imágenes
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000, // Intervalo entre cada cambio de imagen
          disableOnInteraction: false,
        },
        breakpoints: {
          768: {
            spaceBetween: 10, // Espacio entre imágenes para pantallas medianas (>= 768px)
          },
          1024: {
            spaceBetween: 20, // Espacio entre imágenes para pantallas grandes (>= 1024px)
          },
        },
      });
    }, 100);
  }

  onSearch(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesName = this.searchCriteria.name ? movie.name.toLowerCase().includes(this.searchCriteria.name.toLowerCase()) : true;
      const matchesGenre = this.searchCriteria.genre ? movie.genre.name === this.searchCriteria.genre : true;
      const matchesContentRating = this.searchCriteria.contentRating ? movie.contentRating.name === this.searchCriteria.contentRating : true;
      const matchesDuration = this.searchCriteria.duration ? this.filterByDuration(Number(movie.duration), this.searchCriteria.duration) : true;
      const matchesLanguage = this.searchCriteria.language ? movie.languages.some(language => language.name === this.searchCriteria.language) : true;
      const matchesShowType = this.searchCriteria.showType ? movie.showTypes.some(showType => showType.name === this.searchCriteria.showType) : true;
      return matchesName && matchesGenre && matchesContentRating && matchesDuration && matchesLanguage && matchesShowType;
    });

    this.applyFilters(); // Aplica los filtros después de reiniciar
  }

  filterByDuration(movieDuration: number, criteria: string): boolean {
    const [type, value] = criteria.split('-');
    const duration = parseInt(value, 10);
    if (type === 'less') {
      return movieDuration < duration;
    } else if (type === 'more') {
      return movieDuration > duration;
    }
    return true;
  }

  navigateToMovieDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  async fetchMoviesInTheaters() {
    try {
      const subsidiaryId = this.subsidiaryService.getSubsidiaryId();
      const subsidiaryMovies = await this.homeService.getMovies(subsidiaryId);
      this.movies = this.homeService.getMoviesWithShowsInNextTwoWeeks(subsidiaryMovies);
      this.filteredMovies = this.movies;
    } catch (error) {
      console.error('Error fetching movies in theaters:', error);
    }
  }

  loadPosterPreview(movieId: number): string {
    return this.homeService.getMoviePosterUrl(movieId);
  }

  async fetchGenres() {
    try {
      this.genres = await this.homeService.getGenres();
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }

  async fetchContentRatings() {
    try {
      this.contentRatings = await this.homeService.getContentRatings();
    } catch (error) {
      console.error('Error fetching content ratings:', error);
    }
  }

  async fetchLanguages() {
    try {
      this.languages = await this.homeService.getLanguages();
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }

  async fetchShowTypes() {
    try {
      this.showTypes = await this.homeService.getShowTypes();
    } catch (error) {
      console.error('Error fetching show types:', error);
    }
  }

  async fetchBanners() {
    try {
      this.banners = await this.homeService.getBanners();
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  }

  clearFilter(filterKey: 'name' | 'genre' | 'contentRating' | 'duration' | 'language' | 'showType'): void {
    this.searchCriteria[filterKey] = ''; // Limpia el filtro correspondiente
  }

  resetFilters(): void {
    this.searchCriteria = {
      name: '',
      genre: '',
      contentRating: '',
      duration: '',
      language: '',
      showType: ''
    };
    this.filteredMovies = this.movies;
    this.applyFilters(); // Aplica los filtros después de reiniciar
  }

  applyFilters() {
    // Guardamos los filtros aplicados en la última búsqueda
    this.activeFilters = { ...this.searchCriteria };
    this.filtersApplied = Object.values(this.activeFilters).some(value => 
      value !== null && value !== undefined && value !== ''
    );    
  }

  getDurationLabel(value: string): string {
    const option = this.durationOptions.find(option => option.value === value);
    return option ? option.label : value; // Devuelve el label si lo encuentra, de lo contrario devuelve el value
  }
}