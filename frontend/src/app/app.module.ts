import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LoginComponent } from './login/login.component'; // Importiere die LoginComponent

@NgModule({
    declarations: [
        AppComponent,
        ItemListComponent,
        LoginComponent // Füge die LoginComponent zur Deklarationsliste hinzu
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
