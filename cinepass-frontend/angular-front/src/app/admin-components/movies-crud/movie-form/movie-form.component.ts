import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie-crud.service';
import { MovieI } from '../../../interfaces/movie';
import { LanguageI } from '../../../interfaces/language';
import { ContentRatingI } from '../../../interfaces/contentRating';
import { GenreI } from '../../../interfaces/genre';
import { CreateMovieDto } from '../../../interfaces/createMovieDTO';
import { UpdateMovieDto } from '../../../interfaces/updateMovieDTO';
import { LoadingService } from '../../../shared-components/loading-screen/loading.service';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css']
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode: boolean = false;
  hasIdInUrl: boolean = false;
  movieId: number | null = null;
  languages: LanguageI[] = [];
  contentRatings: ContentRatingI[] = [];
  selectedLanguages: number[] = [];
  genres: GenreI[] = [];
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  showModal: boolean = false;
  modalTitle: string = 'Procesado con exito';
  modalMessage: string = 'Su proceso ha sido completado con éxito.';
  createdMovieId: number | null = null; // Nuevo campo para almacenar el ID de la película creada
  updatedMovieId: number | null = null; // Nuevo campo para almacenar el ID de la película actualizada
  movieDetails: MovieI | null = null; // Nuevo campo para almacenar los detalles de la película cargada

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: MovieService,
    private loadingService: LoadingService
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
    // Determina el modo de operación según la URL
    this.route.url.subscribe(url => {
      this.isEditMode = url.some(segment => segment.path === 'update');
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.hasIdInUrl = true;
        this.movieId = Number(id);
        this.movieForm.get('movieId')?.setValue(this.movieId);
        this.movieForm.get('movieId')?.disable(); // Deshabilitar el campo en modo edición
        this.loadMovie();
      } else {
        this.hasIdInUrl = false;
        this.movieForm.get('movieId')?.enable(); // Habilitar el campo en modo creación
        this.movieForm.get('movieId')?.clearValidators(); // Eliminar validadores en modo creación
        this.movieForm.get('movieId')?.updateValueAndValidity();
      }
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

  onLanguageChange(event: any): void {
    const languageId = +event.target.value;
    if (event.target.checked) {
      this.selectedLanguages.push(languageId);
    } else {
      const index = this.selectedLanguages.indexOf(languageId);
      if (index > -1) {
        this.selectedLanguages.splice(index, 1);
      }
    }
    this.movieForm.patchValue({ languageIds: this.selectedLanguages });
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

    // Mostrar la pantalla de carga
    this.loadingService.show();

    // Primero, sube el archivo con el mismo nombre si hay un archivo seleccionado
    if (this.selectedFile) {
      this.service.uploadPoster(this.selectedFile, this.selectedFile.name).subscribe((response: any) => {
        // Luego, usa el nombre del archivo en el formulario
        const movieData: CreateMovieDto | UpdateMovieDto = this.movieForm.value;
        movieData.poster = this.selectedFile!.name; // Usa el nombre del archivo

        // Guarda la película con el nombre del archivo
        this.saveMovie(movieData);
      }, error => {
        // Ocultar la pantalla de carga en caso de error
        this.loadingService.hide();
        this.errorMessage = 'Error al subir el póster.';
        console.error(error);
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
          // Ocultar la pantalla de carga
          this.loadingService.hide();
          this.updatedMovieId = movieId; // Almacenar el ID de la película actualizada
          if (this.isEditMode) {
            // Lógica para actualizar la película
            this.modalTitle = 'Película Actualizada';
            this.modalMessage = 'La película con ID: ' + this.updatedMovieId + ' ha sido actualizada con éxito.';
          } else {
            // Lógica para crear la película
            this.modalTitle = 'Película Creada';
            this.modalMessage = 'El ID de la película creada es: ' + this.createdMovieId;
          }
          this.showModal = true;
        }, error => {
          // Ocultar la pantalla de carga en caso de error
          this.loadingService.hide();
          this.errorMessage = 'Error al actualizar la película.';
          console.error(error);
        });
      } else {
        this.errorMessage = 'Por favor, ingresa el ID de la película a actualizar.';
      }
    } else {
      this.service.createMovie(movieData as CreateMovieDto).subscribe((response: any) => {
        // Ocultar la pantalla de carga
        this.loadingService.hide();
        this.createdMovieId = response.id; // Almacenar el ID de la película creada
        if (this.isEditMode) {
          // Lógica para actualizar la película
          this.modalTitle = 'Película Actualizada';
          this.modalMessage = 'La película con ID: ' + this.updatedMovieId + ' ha sido actualizada con éxito.';
        } else {
          // Lógica para crear la película
          this.modalTitle = 'Película Creada';
          this.modalMessage = 'El ID de la película creada es: ' + this.createdMovieId;
        }
        this.showModal = true;
      }, error => {
        // Ocultar la pantalla de carga en caso de error
        this.loadingService.hide();
        this.errorMessage = 'Error al crear la película.';
        console.error(error);
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/admin/movies/read']);
  }

  navigate(): void {
    this.showModal = false;
    this.router.navigate(['/admin/movies/read']);
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