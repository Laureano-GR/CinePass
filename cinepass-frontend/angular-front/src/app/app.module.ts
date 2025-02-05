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
import { FormsModule } from '@angular/forms';

registerLocaleData(localeEsAr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShowDetailsComponent,
    MovieDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,
    TemplateComponent,
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-AR' } // Configurar la aplicación para español
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }