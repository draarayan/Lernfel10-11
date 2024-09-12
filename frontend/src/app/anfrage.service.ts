import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Anfrage } from './anfrage.model';

@Injectable({
  providedIn: 'root'
})
export class AnfrageService {

  private apiUrl = 'http://localhost:8080/api/anfragen';

  constructor(private http: HttpClient) {}

  getAnfragenByOwnerId(ownerId: number): Observable<Anfrage[]> {
    return this.http.get<Anfrage[]>(`${this.apiUrl}/by-owner/${ownerId}/active`).pipe(
      catchError(this.handleError<Anfrage[]>('getAnfragenByOwnerId', []))
    );
  }
  
  
  createAnfrage(anfrage: Anfrage, eventId: number, userId: number): Observable<Anfrage> {
    return this.http.post<Anfrage>(`${this.apiUrl}/create?eventId=${eventId}&userId=${userId}`, anfrage)
      .pipe(
        catchError(this.handleError<Anfrage>('createAnfrage'))
      );
  }
  
  

  confirmAnfrage(anfrageId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${anfrageId}/confirm`, {}).pipe(
      catchError(this.handleError('confirmAnfrage'))
    );
  }

  rejectAnfrage(anfrageId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${anfrageId}/reject`, {}).pipe(
      catchError(this.handleError('rejectAnfrage'))
    );
  }

  deleteAnfrage(anfrageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${anfrageId}`).pipe(
      catchError(this.handleError('deleteAnfrage'))
    );
  }
  getMyRequests(userId: number): Observable<Anfrage[]> {
    return this.http.get<Anfrage[]>(`${this.apiUrl}/my-requests/${userId}`).pipe(
      catchError(this.handleError<Anfrage[]>('getMyRequests', []))
    );
  }
  
  getAcceptedRequests(userId: number): Observable<Anfrage[]> {
    return this.http.get<Anfrage[]>(`${this.apiUrl}/by-user/${userId}/accepted`).pipe(
      catchError(this.handleError<Anfrage[]>('getAcceptedRequests', []))
    );
  }
  
  getRejectedRequests(userId: number): Observable<Anfrage[]> {
    return this.http.get<Anfrage[]>(`${this.apiUrl}/by-user/${userId}/rejected`).pipe(
      catchError(this.handleError<Anfrage[]>('getRejectedRequests', []))
    );
  }
  
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
