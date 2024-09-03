import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from './item.model'; // Stelle sicher, dass das Item-Modell existiert

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl = 'http://localhost:8080/api/items'; // URL zu deinem Spring Boot Backend

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
