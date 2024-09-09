import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Anfrage } from '../anfrage.model';
import { AnfrageService } from '../anfrage.service';
import { UserService } from '../user.service'; // Importiere den UserService

@Component({
  selector: 'app-einkaufen',
  templateUrl: './einkaufen.component.html',
  styleUrls: ['./einkaufen.component.css']
})
export class EinkaufenComponent implements OnInit {
  events: Event[] = [];
  anfragen: Anfrage[] = [];
  newEvent: Event = { title: '', description: '', createdBy: '', userId: 0, eventDate: '' };
  requestText: { [key: number]: string } = {};
  userName: string = '';
  userId: number = 0;


  constructor(
    private eventService: EventService, 
    private anfrageService: AnfrageService,
    private userService: UserService // Füge den UserService hinzu
  ) {}

  ngOnInit(): void {
    this.loadUserProfile(); // Benutzerprofil laden
    this.loadEvents();      // Events laden
  }
  
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name; // Den Namen des Benutzers speichern
        this.userId = profile.id;     // Die Benutzer-ID speichern
  
        this.newEvent.createdBy = this.userName; // Setze den Ersteller für das neue Event
        this.newEvent.userId = this.userId;      // Setze die Benutzer-ID für das neue Event
  
        // Lade die Anfragen nur, wenn die Benutzer-ID erfolgreich geladen wurde
        this.loadAnfragen();
      },
      error: (error) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
      }
    });
  }
  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId, this.userId).subscribe(() => {
      this.events = this.events.filter(event => event.id !== eventId);
      alert('Event erfolgreich gelöscht');
    });
  }

  // Lädt die Events
  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      console.log(this.events);  // Überprüfe, ob das eventDate tatsächlich vorhanden ist
    });
  }
  

  // Lädt die Anfragen zu den Events des aktuellen Benutzers
  loadAnfragen(): void {
    if (this.userId !== 0) {
      this.anfrageService.getAnfragenByOwnerId(this.userId).subscribe(anfragen => {
        this.anfragen = anfragen;
      });
    }
  }

  // Erstelle ein neues Event
  createEvent(): void {
    this.newEvent.createdBy = this.userName;
    this.newEvent.userId = this.userId;
    this.eventService.createEvent(this.newEvent).subscribe(event => {
      this.events.push(event);
      this.newEvent = { title: '', description: '', createdBy: this.userName, userId: this.userId, eventDate: '' }; // Event-Datum wird gesetzt
    });
  }
  

  // Anfrage für ein Event senden
  requestItem(eventId: number | undefined, requestText: string): void {
    if (!eventId || !requestText) {
      console.warn('Event ID oder Anfrage-Text fehlen oder ungültig');
      return;
    }
    this.anfrageService.createAnfrage({ eventId, requestedBy: this.userName, requestItem: requestText })
      .subscribe(() => {
        alert('Anfrage gesendet');
        this.requestText[eventId] = ''; // Anfrage zurücksetzen
      });
  }

  // Anfrage bestätigen
  confirmAnfrage(anfrageId: number): void {
    // Logik zur Bestätigung der Anfrage hinzufügen
    this.anfrageService.confirmAnfrage(anfrageId).subscribe(() => {
      alert('Anfrage bestätigt');
      this.loadAnfragen(); // Anfragen nach der Bestätigung erneut laden
    });
  }

  // Anfrage ablehnen
  rejectAnfrage(anfrageId: number): void {
    // Logik zur Ablehnung der Anfrage hinzufügen
    this.anfrageService.rejectAnfrage(anfrageId).subscribe(() => {
      alert('Anfrage abgelehnt');
      this.loadAnfragen(); // Anfragen nach der Ablehnung erneut laden
    });
  }
}
