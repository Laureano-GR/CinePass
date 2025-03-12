import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowService } from '../show-crud.service';
import { CreateShowDto } from '../../../interfaces/createShowDTO';
import { UpdateShowDto } from '../../../interfaces/updateShowDTO';
import { MovieI } from '../../../interfaces/movie';
import { LanguageI } from '../../../interfaces/language';
import { ShowTypeI } from '../../../interfaces/showType';
import { RoomI } from '../../../interfaces/room';
import { LoadingService } from '../../../shared-components/loading-screen/loading.service';

@Component({
  selector: 'app-show-form',
  templateUrl: './show-form.component.html',
  styleUrls: ['./show-form.component.css']
})
export class ShowFormComponent implements OnInit {
  showForm: FormGroup;
  isEditMode: boolean = false;
  hasIdInUrl: boolean = false;
  showId: number | null = null;
  movies: MovieI[] = [];
  showTypes: ShowTypeI[] = [];
  languages: LanguageI[] = [];
  rooms: RoomI[] = [];
  errorMessage: string | null = null;
  showModal: boolean = false;
  modalTitle: string = 'Procesado con exito';
  modalMessage: string = 'Su proceso ha sido completado con éxito.';
  createdShowId: number | null = null;
  updatedShowId: number | null = null;
  showDetails: any = null; // Puedes definir una interfaz ShowI si la tienes

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ShowService,
    private loadingService: LoadingService
  ) {
    this.showForm = this.fb.group({
      showId: [''], // Campo para el ID de la función
      dateAndTime: ['', Validators.required],
      movieId: ['', Validators.required],
      showTypeId: ['', Validators.required],
      languageId: ['', Validators.required],
      roomId: ['', Validators.required],
      // Puedes incluir otros campos si fueran necesarios, por ejemplo, subsidiaryId
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
        this.showId = Number(id);
        this.showForm.get('showId')?.setValue(this.showId);
        this.showForm.get('showId')?.disable(); // Deshabilitar el campo en modo edición
        this.loadShow();
      } else {
        this.hasIdInUrl = false;
        this.showForm.get('showId')?.enable(); // Habilitar el campo en modo creación
        this.showForm.get('showId')?.clearValidators(); // Eliminar validadores en modo creación
        this.showForm.get('showId')?.updateValueAndValidity();
      }
    });

    this.loadMovies();
    this.loadShowTypes();
    this.loadLanguages();
    this.loadRooms();
  }

  loadShow(): void {
    if (this.showId !== null) {
      this.service.getShowById(this.showId).subscribe(show => {
        this.showDetails = show;
        // Ajustar la fecha: restarle 3 horas
        const originalDate = new Date(show.dateAndTime);
        const adjustedDate = new Date(originalDate.getTime() - 3 * 60 * 60 * 1000);
        // Convertir la fecha al formato "yyyy-MM-ddThh:mm"
        const dateVal = adjustedDate.toISOString().substring(0, 16);
        this.showForm.patchValue({
          dateAndTime: dateVal,
          movieId: show.movie.id,
          showTypeId: show.showType.id,
          languageId: show.selectedLanguage.id,
          roomId: show.room.id,
        });
      });
    }
  }

  loadMovies(): void {
    this.service.getMovies().subscribe((movies: MovieI[]) => {
      this.movies = movies;
    });
  }

  loadShowTypes(): void {
    this.service.getShowTypes().subscribe((types: ShowTypeI[]) => {
      this.showTypes = types;
    });
  }

  loadLanguages(): void {
    this.service.getLanguages().subscribe((languages: LanguageI[]) => {
      this.languages = languages;
    });
  }

  loadRooms(): void {
    this.service.getRooms().subscribe((rooms: RoomI[]) => {
      this.rooms = rooms;
    });
  }

  onSubmit(): void {
    if (this.showForm.invalid) {
      console.log(this.showForm);
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    // Mapeo: clave del control -> propiedad destino + función de conversión
    const fieldMapping: { [key: string]: { target: string; converter: (val: any) => any } } = {
      'dateAndTime': { target: 'dateAndTime', converter: (val) => new Date(val) },
      'movieId': { target: 'movie', converter: Number },
      'showTypeId': { target: 'showType', converter: Number },
      'languageId': { target: 'selectedLanguage', converter: Number },
      'roomId': { target: 'room', converter: Number }
    };

    let payload: any = {};

    // Si es actualización, solo incluir campos que hayan sido modificados (dirty)
    Object.keys(this.showForm.controls).forEach(key => {
      const control = this.showForm.get(key);
      // Para create se envían todos los campos; para update solo los modificados
      if (!this.isEditMode || control?.dirty) {
        // Si es un campo que queremos transformar:
        if (fieldMapping[key]) {
          payload[fieldMapping[key].target] = fieldMapping[key].converter(control?.value);
        }
      }
    });

    // Incluimos siempre subsidiary (o se puede incluir solo en create según la lógica)
    const storedSubsidiary = sessionStorage.getItem('subsidiaryId');
    if (storedSubsidiary) {
      payload.subsidiary = Number(storedSubsidiary);
    } else {
      this.errorMessage = 'No se encontró una sucursal válida en la sesión.';
      return;
    }

    console.log('Payload a enviar:', payload);

    // Mostrar la pantalla de carga
    this.loadingService.show();

    if (this.isEditMode) {
      if (this.showId) {
        this.service.updateShow(this.showId, payload as UpdateShowDto).subscribe(() => {
          // Ocultar la pantalla de carga
          this.loadingService.hide();
          this.updatedShowId = this.showId;
          this.modalTitle = 'Función Actualizada';
          this.modalMessage = 'La función con ID: ' + this.updatedShowId + ' ha sido actualizada con éxito.';
          this.showModal = true;
        }, error => {
          // Ocultar la pantalla de carga en caso de error
          this.loadingService.hide();
          this.errorMessage = 'Error al actualizar la función.';
          console.error(error);
        });
      } else {
        this.errorMessage = 'Por favor, ingresa el ID de la función a actualizar.';
      }
    } else {
      this.service.createShow(payload as CreateShowDto).subscribe((response: any) => {
        // Ocultar la pantalla de carga
        this.loadingService.hide();
        this.createdShowId = response.id;
        this.modalTitle = 'Función Creada';
        this.modalMessage = 'El ID de la función creada es: ' + this.createdShowId;
        this.showModal = true;
      }, error => {
        // Ocultar la pantalla de carga en caso de error
        this.loadingService.hide();
        this.errorMessage = 'Error al crear la función.';
        console.error(error);
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/admin/dashboard']);
  }

  onLoadShow(): void {
    const id = this.showForm.get('showId')?.value;
    if (id) {
      this.showId = id;
      this.loadShow();
    } else {
      this.errorMessage = 'Por favor, ingresa el ID de la función a cargar.';
    }
  }
}