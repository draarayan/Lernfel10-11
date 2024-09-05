import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLogin: boolean = true;  // Bestimmt, ob es sich um Login oder Registrierung handelt
  errorMessage: string = ''; // Variable zur Anzeige von Fehlermeldungen

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Erstelle das Formular mit Validierungen
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email-Validierung
      password: ['', Validators.required],                  // Passwort ist erforderlich
      name: [''],                                           // Name ist optional beim Login
      nachname: ['']                                        // Nachname ist optional beim Login
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, name, nachname } = this.loginForm.value;

      // Prüfe, ob der Benutzer sich einloggt oder registriert
      if (this.isLogin) {
        this.userService.loginUser({ email, password })
          .subscribe({
            next: (response) => {
              console.log('Login erfolgreich', response);
              this.router.navigate(['/dashboard']).then(() => {
                console.log('Navigiert zu Dashboard');
              }).catch((error) => {
                console.error('Fehler bei der Navigation:', error);
              });
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 401) {
                this.errorMessage = 'Ungültige Anmeldedaten';
              } else {
                this.errorMessage = `Fehler beim Login: ${error.message}`;
              }
              console.error(this.errorMessage);
            }
          });
      } else {
        this.userService.registerUser({ email, password, name, nachname })
          .subscribe({
            next: (response) => {
              console.log('Benutzer erfolgreich angelegt', response);
              this.router.navigate(['/dashboard']).then(() => {
                console.log('Navigiert zu Dashboard');
              }).catch((error) => {
                console.error('Fehler bei der Navigation:', error);
              });
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.errorMessage = 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits';
              } else {
                this.errorMessage = `Fehler beim Registrieren: ${error.message}`;
              }
              console.error(this.errorMessage);
            }
          });
      }
    } else {
      this.errorMessage = 'Bitte fülle alle erforderlichen Felder aus.';
    }
  }

  // Wechsel zwischen Login und Registrierung
  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; // Setzt die Fehlermeldung zurück
    if (this.isLogin) {
      this.loginForm.removeControl('name');      // Entfernt das Name-Feld, wenn es sich um Login handelt
      this.loginForm.removeControl('nachname');  // Entfernt das Nachname-Feld, wenn es sich um Login handelt
    } else {
      this.loginForm.addControl('name', this.fb.control('', Validators.required));  // Fügt das Name-Feld hinzu, wenn es sich um Registrierung handelt
      this.loginForm.addControl('nachname', this.fb.control(''));                  // Fügt das Nachname-Feld hinzu, wenn es sich um Registrierung handelt
    }
  }
}
