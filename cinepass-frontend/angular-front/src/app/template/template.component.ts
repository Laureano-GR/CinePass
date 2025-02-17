import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubsidiaryService } from '../subsidiary.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubsidiaryI } from '../interfaces/subsidiary';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TemplateComponent implements OnInit {
  subsidiaryName$: Observable<string | null>;

  constructor(
    private subsidiaryService: SubsidiaryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.subsidiaryName$ = this.subsidiaryService.subsidiary$.pipe(
      map((subsidiary: SubsidiaryI | null) => subsidiary?.name || null)
    );
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  changeSubsidiary(): void {
    this.subsidiaryService.clearSubsidiary();
    this.authService.logout();
    this.router.navigate(['/select-subsidiary']);
  }
}