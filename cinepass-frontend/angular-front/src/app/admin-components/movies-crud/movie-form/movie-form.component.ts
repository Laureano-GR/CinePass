import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie-crud.service';
import { MovieI } from '../../../interfaces/movie';
import { LanguageI } from '../../../interfaces/language';
import { ContentRatingI } from '../../../interfaces/contentRating';
import { GenreI } from '../../../interfaces/genre';
import { CreateMovieDto } from '../../../interfaces/createMovieDTO';
import { UpdateMovieDto } from '../../../interfaces/updateMovieDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css']
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode: boolean = false;
  movieId: number | null = null;
  languages: LanguageI[] = [];
  contentRatings: ContentRatingI[] = [];
  genres: GenreI[] = [];
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  showModal: boolean = false;
  createdMovieId: number | null = null; // Nuevo campo para almacenar el ID de la película creada
  updatedMovieId: number | null = null; // Nuevo campo para almacenar el ID de la película actualizada
  movieDetails: MovieI | null = null; // Nuevo campo para almacenar los detalles de la película cargada

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: MovieService,
  ) {
    this.movieForm = this.fb.group({
      movieId: [''], // Campo para el ID de la película
      name: ['', Validators.required],
      poster: [''],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      languageIds: [[], Validators.required],
      genreId: ['', Validators.required],
      contentRatingId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.isEditMode = url.some(segment => segment.path === 'update');
      if (this.isEditMode) {
        this.movieForm.get('movieId')?.setValidators([Validators.required]);
      } else {
        this.movieForm.get('movieId')?.clearValidators();
      }
      this.movieForm.get('movieId')?.updateValueAndValidity();
    });

    this.loadLanguages();
    this.loadContentRatings();
    this.loadGenres();
  }

  loadMovie(): void {
    if (this.movieId !== null) {
      this.service.getMovieById(this.movieId).subscribe((movie: MovieI) => {
        this.movieDetails = movie;
        this.movieForm.patchValue({
          name: movie.name,
          poster: movie.poster,
          description: movie.description,
          duration: movie.duration,
          languageIds: movie.languages.map(lang => lang.id),
          genreId: movie.genre.id,
          contentRatingId: movie.contentRating.id
        });

        // Cargar la vista previa del póster
        this.loadPosterPreview();
      });
    }
  }

  loadPosterPreview(): void {
    const posterUrl = this.service.getPosterUrl(this.movieId!); // Ajusta la URL según tu configuración
    this.filePreview = posterUrl;
  }

  loadLanguages(): void {
    this.service.getLanguages().subscribe((languages: LanguageI[]) => {
      this.languages = languages;
    });
  }

  loadContentRatings(): void {
    this.service.getContentRatings().subscribe((contentRatings: ContentRatingI[]) => {
      this.contentRatings = contentRatings;
    });
  }

  loadGenres(): void {
    this.service.getGenres().subscribe((genres: GenreI[]) => {
      this.genres = genres;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(file);

      // Actualizar el valor del campo poster en el formulario
      this.movieForm.patchValue({ poster: file.name });
    }
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      console.log(this.movieForm);
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    if (!this.selectedFile && !this.isEditMode) {
      this.errorMessage = 'Por favor, selecciona un póster para la película.';
      return;
    }

    // Primero, sube el archivo con el mismo nombre si hay un archivo seleccionado
    if (this.selectedFile) {
      this.service.uploadPoster(this.selectedFile, this.selectedFile.name).subscribe((response: any) => {
        // Luego, usa el nombre del archivo en el formulario
        const movieData: CreateMovieDto | UpdateMovieDto = this.movieForm.value;
        movieData.poster = this.selectedFile!.name; // Usa el nombre del archivo

        // Guarda la película con el nombre del archivo
        this.saveMovie(movieData);
      });
    } else {
      const movieData: CreateMovieDto | UpdateMovieDto = this.movieForm.value;
      this.saveMovie(movieData);
    }
  }

  saveMovie(movieData: CreateMovieDto | UpdateMovieDto): void {
    console.log(movieData);
    if (this.isEditMode) {
      const movieId = this.movieForm.get('movieId')?.value;
      if (movieId) {
        this.service.updateMovie(movieId, movieData as UpdateMovieDto).subscribe(() => {
          this.updatedMovieId = movieId; // Almacenar el ID de la película actualizada
          this.showModal = true;
        });
      } else {
        this.errorMessage = 'Por favor, ingresa el ID de la película a actualizar.';
      }
    } else {
      this.service.createMovie(movieData as CreateMovieDto).subscribe((response: any) => {
        this.createdMovieId = response.id; // Almacenar el ID de la película creada
        this.showModal = true;
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/admin/dashboard']);
  }

  onLoadMovie(): void {
    const movieId = this.movieForm.get('movieId')?.value;
    if (movieId) {
      this.movieId = movieId;
      this.loadMovie();
    } else {
      this.errorMessage = 'Por favor, ingresa el ID de la película a cargar.';
    }
  }
}