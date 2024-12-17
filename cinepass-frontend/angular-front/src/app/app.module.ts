import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';  // Asegúrate de importar AppRoutingModule
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { RouterModule, RouterOutlet } from '@angular/router';   // Asegúrate de importar RouterModule aquí también
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ HomeComponent, AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,
    TemplateComponent,
    CommonModule,
    RouterOutlet,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }