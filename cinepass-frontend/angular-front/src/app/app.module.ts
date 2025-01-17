import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';  // Asegúrate de importar AppRoutingModule
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { RouterModule, RouterOutlet } from '@angular/router';   // Asegúrate de importar RouterModule aquí también
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { MovieDetailsComponent } from './movie-details/movie-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,
    TemplateComponent,
    CommonModule,
    HttpClientModule,
    RouterOutlet,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }