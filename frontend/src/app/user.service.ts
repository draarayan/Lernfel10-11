import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProfile } from './user-profile.model';  // Importiere das UserProfile-Modell

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL zum Spring Backend

  constructor(private http: HttpClient, private router: Router) {}

  // Registriert einen neuen Benutzer
  registerUser(user: { email: string, password: string, name?: string, nachname?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)  // Fehlerbehandlung
    );
  }

  // Meldet einen Benutzer an und speichert das Token
  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);  // Speichert das Token
        } else {
          console.error('Kein Token in der Antwort vorhanden');
        }
      }),
      catchError(this.handleError)  // Fehlerbehandlung
    );
  }

  // Überprüft, ob der Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Ruft das Profil des Benutzers ab
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
      catchError(this.handleError)  // Fehlerbehandlung
    );
  }

  // Löscht einen Benutzer anhand seiner ID
  deleteUser(userId: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token not found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)  // Fehlerbehandlung
      
    );
  }

  // Meldet den Benutzer ab
  logoutUser(): Observable<void> {
    localStorage.removeItem('authToken');
    return new Observable<void>(observer => {
      this.router.navigate(['/login']);
      observer.next();
      observer.complete();
    });
  }

  // Extrahiert das Token aus dem lokalen Speicher
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Fehlerbehandlungsmethode
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Etwas ist schiefgelaufen'; // Allgemeine Fehlermeldung
  
    // Prüft, ob der Fehler auf Client-Seite oder durch das Netzwerk auftrat
    if (error.error instanceof ErrorEvent) {
      // Client- oder Netzwerkfehler
      errorMessage = `Fehler: ${error.error.message}`;
      console.error('Client-seitiger Fehler:', error.error.message);
    } else {
      // Backend-Fehler
      errorMessage = `Fehlercode: ${error.status}\nNachricht: ${error.message}`;
  
      // Nur Fehler mit Statuscodes 4xx oder 5xx werden geloggt
      if (error.status >= 400 && error.status < 600) {
        console.error(`Backend-Fehler [${error.status}]: ${error.message}`);
      }
    }
  
    // Gibt die Fehlermeldung weiter
    return throwError(() => new Error(errorMessage));
  }
  
}
