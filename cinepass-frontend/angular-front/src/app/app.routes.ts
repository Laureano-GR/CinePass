import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { SubsidiaryGuard } from './subsidiary.guard';
import { SelectSubsidiaryComponent } from './select-subsidiary/select-subsidiary.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';
import { AdminLoginComponent } from './admin-components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { ShowListComponent } from './admin-components/shows-crud/show-list/show-list.component';
import { ShowFormComponent } from './admin-components/shows-crud/show-form/show-form.component';
import { MovieFormComponent } from './admin-components/movies-crud/movie-form/movie-form.component';
import { MovieListComponent } from './admin-components/movies-crud/movie-list/movie-list.component';
import { AuthGuardService } from './auth-guard.service';

export const routes: Routes = [
  { path: 'select-subsidiary', component: SelectSubsidiaryComponent },
  {
    path: '',
    canActivate: [SubsidiaryGuard],
    component: TemplateComponent,  // Este componente es el contenedor para otras rutas
    children: [
      { path: '', component: HomeComponent },
      { path: 'movie-details/:id', component: MovieDetailsComponent },
      { path: 'show-details/:id', component: ShowDetailsComponent },
      { path: 'purchase/:showId', component: PurchaseDetailsComponent },
      { path: 'admin-login', component: AdminLoginComponent },
      { path: 'admin', 
        canActivate: [AuthGuardService],
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'movies/read', component: MovieListComponent },
          { path: 'movies/create', component: MovieFormComponent },
          { path: 'movies/update', component: MovieFormComponent },
          { path: 'shows/read', component: ShowListComponent },
          { path: 'shows/create', component: ShowFormComponent },
          { path: 'shows/update', component: ShowFormComponent }
        ]
      },    
    ]
  },
  
  { path: '**', redirectTo: '' }  // Redirigir a la ruta raíz en lugar de 'home'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura las rutas
  exports: [RouterModule]
})
export class AppRoutingModule { }