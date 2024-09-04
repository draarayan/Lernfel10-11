import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL zum Spring Backend

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: { email: string, password: string, name?: string, description?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        // Setze den Token in LocalStorage, wenn die Login-Anfrage erfolgreich ist
        localStorage.setItem('authToken', response.token);
        // Weiterleiten zum Dashboard
        this.navigateToDashboard();
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }

  // Hilfsmethode, um nach erfolgreichem Login weiterzuleiten
  private navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logoutUser(): void {
    localStorage.removeItem('authToken'); // Token entfernen
  }


  // Überprüft, ob der Benutzer angemeldet ist
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Loggt den Benutzer aus
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
