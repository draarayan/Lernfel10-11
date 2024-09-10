import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './event.model';

@Injectable({
    providedIn: 'root'
  })
  export class EventService {
    private apiUrl = 'http://localhost:8080/api/events'; // Backend-Endpunkt
  
    constructor(private http: HttpClient) {}
  
    getEvents(): Observable<Event[]> {
      return this.http.get<Event[]>('http://localhost:8080/api/events');  // Korrigiere die URL
    }
    
  
    createEvent(event: Event): Observable<Event> {
      return this.http.post<Event>(this.apiUrl, event);
    }
  
    deleteEvent(eventId: number, userId: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${eventId}?userId=${userId}`);
    }
    
  }
  
