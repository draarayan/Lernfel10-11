import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Anfrage } from './anfrage.model'; // Importiere das Anfrage-Modell

@Injectable({
  providedIn: 'root'
})
export class AnfrageService {

  private apiUrl = 'http://localhost:8080/api/anfragen'; // Backend-Endpunkt für Anfragen

  constructor(private http: HttpClient) {}

  // Anfragen für einen bestimmten Event-Ersteller laden
  getAnfragenByOwnerId(ownerId: number): Observable<Anfrage[]> {
    return this.http.get<Anfrage[]>(`${this.apiUrl}/by-owner/${ownerId}`);
  }

  createAnfrage(anfrage: Anfrage, eventId: number): Observable<Anfrage> {
    return this.http.post<Anfrage>(`${this.apiUrl}?eventId=${eventId}`, anfrage);
  }  
  

  confirmAnfrage(anfrageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${anfrageId}/confirm`, {});
  }
  
  rejectAnfrage(anfrageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${anfrageId}/reject`, {});
  }
  
}
