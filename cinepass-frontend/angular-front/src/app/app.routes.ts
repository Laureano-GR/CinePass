import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { SubsidiaryGuard } from './subsidiary.guard';
import { SelectSubsidiaryComponent } from './select-subsidiary/select-subsidiary.component';

export const routes: Routes = [
  { path: 'select-subsidiary', component: SelectSubsidiaryComponent },
  {
    path: '',
    canActivate: [SubsidiaryGuard],
    component: TemplateComponent,  // Este componente será el contenedor para otras rutas
    children: [
      { path: '', component: HomeComponent }  // Página principal que se muestra en el <router-outlet>
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura las rutas
  exports: [RouterModule]
})
export class AppRoutingModule { }
