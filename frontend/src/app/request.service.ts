import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from './request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8080/api/anfragen';

  constructor(private http: HttpClient) {}

  getRequestsByOwnerId(ownerId: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/by-owner/${ownerId}/active`).pipe(
      catchError(this.handleError<Request[]>('getRequestsByOwnerId', []))
    );
  }
  
  
  createRequest(request: Request, eventId: number, userId: number): Observable<Request> {
    return this.http.post<Request>(`${this.apiUrl}/create?eventId=${eventId}&userId=${userId}`, request)
      .pipe(
        catchError(this.handleError<Request>('createRequest'))
      );
  }
  
  

  confirmRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/confirm`, {}).pipe(
      catchError(this.handleError('confirmRequest'))
    );
  }

  rejectRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/reject`, {}).pipe(
      catchError(this.handleError('rejectRequest'))
    );
  }

  deleteRequest(requestId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${requestId}`).pipe(
      catchError(this.handleError('deleteRequest'))
    );
  }
  getMyRequests(userId: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/my-requests/${userId}`).pipe(
      catchError(this.handleError<Request[]>('getMyRequests', []))
    );
  }
  
  getAcceptedRequests(userId: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/by-user/${userId}/accepted`).pipe(
      catchError(this.handleError<Request[]>('getAcceptedRequests', []))
    );
  }
  
  getRejectedRequests(userId: number): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/by-user/${userId}/rejected`).pipe(
      catchError(this.handleError<Request[]>('getRejectedRequests', []))
    );
  }
  
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
