import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProfile } from './user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; 

  constructor(private http: HttpClient, private router: Router) {}

  
  registerUser(user: { email: string, password: string, name?: string, nachname?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, { responseType: 'text' as 'json' }).pipe(
      tap(response => {
        alert('Sie haben sich erfolgreich registriert.');
      }),
      catchError(this.handleError)
    );
  }

  
  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);  
        } else {
          console.error('Kein Token in der Antwort vorhanden');
        }
      }),
      catchError(this.handleError) 
    );
  }

  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  
  getUserProfile(): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token not found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError(this.handleError)  
    );
  }

 
  deleteUser(userId: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token not found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError) 
    );
  }
  

  logoutUser(): Observable<void> {
    localStorage.removeItem('authToken');
    return new Observable<void>(observer => {
      this.router.navigate(['/login']);
      observer.next();
      observer.complete();
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Etwas ist schiefgelaufen';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Fehler: ${error.error.message}`;
      console.error('Client-seitiger Fehler:', error.error.message);
    } else {
      errorMessage = `Fehlercode: ${error.status}\nNachricht: ${error.message}`;
      if (error.status >= 400 && error.status < 600) {
        console.error(`Backend-Fehler [${error.status}]: ${error.message}`);
      }
    }
    return throwError(() => new Error(errorMessage));
  }
  
}
