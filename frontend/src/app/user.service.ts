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
  private apiUrl = 'http://localhost:8080/api/users'; // URL zum Spring Backend

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: { email: string, password: string, name?: string, nachname?: string }): Observable<any> { // Ändere description zu nachname
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }

  logoutUser(): Observable<void> {
    localStorage.removeItem('authToken');
    return new Observable<void>(observer => {
      this.router.navigate(['/login']);
      observer.next();
      observer.complete();
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserProfile(): Observable<UserProfile> { // Verwende den Typ UserProfile
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/delete`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
