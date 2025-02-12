import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { TemplateComponent } from './template/template.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-components/admin-login/admin-login.component';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';

registerLocaleData(localeEsAr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShowDetailsComponent,
    MovieDetailsComponent,
    AdminLoginComponent,
    PurchaseDetailsComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,
    TemplateComponent,
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-AR' } // Configurar la aplicación para español
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }