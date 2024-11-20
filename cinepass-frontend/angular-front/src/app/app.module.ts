import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';  // Asegúrate de importar AppRoutingModule
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { RouterModule } from '@angular/router';   // Asegúrate de importar RouterModule aquí también

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    RouterModule,
    TemplateComponent     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
