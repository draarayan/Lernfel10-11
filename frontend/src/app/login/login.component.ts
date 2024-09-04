import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user.servie';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLogin: boolean = true;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: [''],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, name, description } = this.loginForm.value;

      if (this.isLogin) {
        this.userService.loginUser({ email, password })
          .subscribe({
            next: (response) => {
              console.log('Login erfolgreich', response);
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 401) {
                console.error('Ungültige Anmeldedaten');
              } else {
                console.error('Fehler beim Login:', error.message);
              }
            }
          });
      } else {
        this.userService.registerUser({ email, password, name, description })
          .subscribe({
            next: (response) => {
              console.log('User erfolgreich angelegt', response);
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                console.error('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits');
              } else {
                console.error('Fehler beim Anlegen des Benutzers:', error.message);
              }
            }
          });
      }
    }
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.loginForm.removeControl('name');
      this.loginForm.removeControl('description');
    } else {
      this.loginForm.addControl('name', this.fb.control('', Validators.required));
      this.loginForm.addControl('description', this.fb.control(''));
    }
  }
}
