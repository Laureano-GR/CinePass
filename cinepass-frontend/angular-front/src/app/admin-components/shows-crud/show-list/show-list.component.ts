import { Component, OnInit } from '@angular/core';
import { ShowService } from '../show-crud.service';
import { ShowI } from '../../../interfaces/show';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {
  shows: ShowI[] = [];
  subsidiaryId: number;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private showService: ShowService) {
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
      this.showService.getShowsBySubsidiary(this.subsidiaryId).subscribe(
        (shows) => {
          this.shows = shows;
          this.sort('id'); // Ordenar por defecto por ID de menor a mayor
        },
        (error) => {
          console.error('Error al obtener las funciones:', error);
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

    this.shows.sort((a, b) => {
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

  getValue(show: ShowI, column: string): any {
    switch (column) {
      case 'id':
        return show.id;
      case 'dateAndTime':
        return new Date(show.dateAndTime).getTime();
      case 'name':
        return show.movie.name;
      case 'showType':
        return show.showType.name;
      case 'selectedLanguage':
        return show.selectedLanguage.name;
      case 'room':
        return show.room.roomNumber;
      default:
        return '';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  }
}