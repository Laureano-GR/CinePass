import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { SubsidiaryGuard } from './subsidiary.guard';
import { SelectSubsidiaryComponent } from './select-subsidiary/select-subsidiary.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { ProcessSaleComponent } from './process-sale/process-sale.component';
import { AdminLoginComponent } from './admin-components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { ShowListComponent } from './admin-components/shows-crud/show-list/show-list.component';
import { ShowFormComponent } from './admin-components/shows-crud/show-form/show-form.component';
import { MovieFormComponent } from './admin-components/movies-crud/movie-form/movie-form.component';
import { MovieListComponent } from './admin-components/movies-crud/movie-list/movie-list.component';
import { AuthGuardService } from './auth-guard.service';
import { SearchSalesComponent } from './admin-components/sales-admin/search-sales/search-sales.component';
import { SelectSaleDataComponent } from './admin-components/sales-admin/select-sale-data/select-sale-data.component';
import { ReportsVisualizerComponent } from './admin-components/reports-visualizer/reports-visualizer.component';

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
      { path: 'purchase/:showId', component: ProcessSaleComponent },
      { path: 'admin-login', component: AdminLoginComponent },
      { path: 'admin', 
        canActivate: [AuthGuardService],
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'movies/read', component: MovieListComponent },
          { path: 'movies/create', component: MovieFormComponent },
          { path: 'movies/update', component: MovieFormComponent },
          { path: 'movies/update/:id', component: MovieFormComponent },
          { path: 'shows/read', component: ShowListComponent },
          { path: 'shows/create', component: ShowFormComponent },
          { path: 'shows/update', component: ShowFormComponent },
          { path: 'shows/update/:id', component: ShowFormComponent },
          { path: 'sales/select-sale-data', component:SelectSaleDataComponent },
          { path: 'sales/create/:showId', component: ProcessSaleComponent },
          { path: 'sales/search', component: SearchSalesComponent},
          { path: 'reports/:report', component: ReportsVisualizerComponent },
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