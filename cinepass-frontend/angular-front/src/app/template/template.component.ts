import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubsidiaryService } from '../subsidiary.service';
import { Observable, map, Subscription } from 'rxjs';
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
export class TemplateComponent implements OnInit, OnDestroy {
  subsidiaryName$: Observable<string | null>;
  subsidiary: SubsidiaryI | null = null;
  isLoggedIn: boolean = false;
  private authSubscription: Subscription = new Subscription();

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
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  changeSubsidiary(): void {
    this.subsidiaryService.clearSubsidiary();
    this.authService.logout();
    this.router.navigate(['/select-subsidiary']);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  logOut(): void {
    this.authService.logout();
    window.location.reload();
  }
}