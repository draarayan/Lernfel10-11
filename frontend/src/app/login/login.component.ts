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
  isLogin: boolean = true;  
  errorMessage: string = ''; 

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required],                  
      name: [''],                                           
      nachname: ['']                                        
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, name, nachname } = this.loginForm.value;

      
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

  
  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; 
  
    if (this.isLogin) {
      this.loginForm.get('name')?.clearValidators();
      this.loginForm.get('nachname')?.clearValidators();
    } else {
      this.loginForm.get('name')?.setValidators(Validators.required);
      this.loginForm.get('nachname')?.setValidators(Validators.required);
    }
    this.loginForm.updateValueAndValidity();
  }
  
}
