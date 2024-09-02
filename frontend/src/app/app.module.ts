import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Dieser Import ist wichtig
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,  // Hier das FormsModule hinzufügen
  ],
  providers: []
})
export class AppModule { }
