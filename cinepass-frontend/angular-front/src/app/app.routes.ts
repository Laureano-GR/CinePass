import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { SubsidiaryGuard } from './subsidiary.guard';
import { SelectSubsidiaryComponent } from './select-subsidiary/select-subsidiary.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';

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
    ]
  },
  { path: '**', redirectTo: '' }  // Redirigir a la ruta raíz en lugar de 'home'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura las rutas
  exports: [RouterModule]
})
export class AppRoutingModule { }