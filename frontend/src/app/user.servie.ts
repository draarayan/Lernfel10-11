import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL zum Spring Backend

  constructor(private http: HttpClient) { }

  registerUser(user: { email: string, password: string, name?: string, description?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}