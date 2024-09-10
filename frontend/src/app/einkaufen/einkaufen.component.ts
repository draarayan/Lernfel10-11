import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Anfrage } from '../anfrage.model';
import { AnfrageService } from '../anfrage.service';
import { UserService } from '../user.service';

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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile(); // Benutzerprofil laden
    this.loadEvents();      // Events laden
  }
  
  // Lädt das Benutzerprofil
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userId = profile.id;
  
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
    const confirmation = confirm('Möchten Sie dieses Event wirklich löschen?');
    if (confirmation) {
      this.eventService.deleteEvent(eventId, this.userId).subscribe({
        next: () => {
          console.log(`Event mit ID ${eventId} erfolgreich gelöscht.`);
          alert('Event erfolgreich gelöscht');
          // Manuell das gelöschte Event aus der Liste entfernen
          this.events = this.events.filter(event => event.id !== eventId);
        },
        error: (error) => {
          if (error.status !== 200) {
            console.error('Fehler beim Löschen des Events:', error);
          } else {
            this.loadEvents();
          }
        }
      });
    }
  }
  
  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
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
      // Event-Datum wird hier zurückgesetzt, um ein neues Event zu erstellen
      this.newEvent = { title: '', description: '', createdBy: this.userName, userId: this.userId, eventDate: '' };
    });
  }

  requestItem(eventId: number | undefined, requestText: string): void {
    if (!eventId || !requestText) {
      console.warn('Event ID oder Anfrage-Text fehlen oder ungültig');
      return;
    }
  
    const anfrage: Anfrage = {
      eventId: eventId, // Event ID hier hinzufügen
      requestedBy: this.userName,
      requestItem: requestText
    };
  
    // Übergib sowohl die Anfrage als auch die Event-ID
    this.anfrageService.createAnfrage(anfrage, eventId).subscribe({
      next: () => {
        alert('Anfrage gesendet');
        this.requestText[eventId] = ''; // Anfrage zurücksetzen
      },
      error: (error) => {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    });
  }
  
  
  

  
  // Anfrage bestätigen
  confirmAnfrage(anfrageId: number): void {
    this.anfrageService.confirmAnfrage(anfrageId).subscribe(() => {
      alert('Anfrage bestätigt');
      this.loadAnfragen(); // Anfragen nach der Bestätigung erneut laden
    });
  }

  // Anfrage ablehnen
  rejectAnfrage(anfrageId: number): void {
    this.anfrageService.rejectAnfrage(anfrageId).subscribe(() => {
      alert('Anfrage abgelehnt');
      this.loadAnfragen(); // Anfragen nach der Ablehnung erneut laden
    });
  }
}
