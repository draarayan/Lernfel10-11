import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';

@NgModule({ declarations: [
        AppComponent,
        ItemListComponent // Stelle sicher, dass dies hier enthalten ist
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        ReactiveFormsModule, // Importiert das ReactiveFormsModule
        AppRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }