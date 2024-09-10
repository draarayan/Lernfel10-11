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
  myRequests: Anfrage[] = [];
  eventsMap: { [key: number]: string } = {};

  constructor(
    private eventService: EventService,
    private anfrageService: AnfrageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadEvents();
    this.loadMyRequests();
    this.loadAnfragen();
  }
  loadAcceptedRequests(): void {
    this.anfrageService.getAcceptedRequests(this.userId).subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Fehler beim Laden der akzeptierten Anfragen:', error);
      }
    });
  }
  
  loadRejectedRequests(): void {
    this.anfrageService.getRejectedRequests(this.userId).subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Fehler beim Laden der abgelehnten Anfragen:', error);
      }
    });
  }
  
  // Lädt das Benutzerprofil
  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userId = profile.id;

        this.newEvent.createdBy = this.userName; // Setze den Ersteller für das neue Event
        this.newEvent.userId = this.userId;      // Setze die Benutzer-ID für das neue Event
        this.loadMyRequests();
        this.loadAnfragen(); // Lade Anfragen, nachdem das Profil geladen wurde
      },
      error: (error) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
      }
    });
  }

  // Lädt alle Events
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        events.forEach(event => {
          // Überprüfe, ob event.id definiert ist, bevor es als Index verwendet wird
          if (event.id !== undefined) {
            this.eventsMap[event.id] = event.title;
          } else {
            console.warn('Event ohne ID gefunden:', event); // Fallback-Log für Events ohne ID
          }
        });
      },
      error: (error) => {
        console.error('Fehler beim Laden der Events:', error);
      }
    });
  }
  

  loadAnfragen(): void {
    if (this.userId !== 0) {
      this.anfrageService.getAnfragenByOwnerId(this.userId).subscribe({
        next: (anfragen) => {
          console.log('Active Requests:', anfragen);
          this.anfragen = anfragen;
        },
        error: (error) => {
          console.error('Fehler beim Laden der Anfragen:', error);
        }
      });
    }
  }
  

  loadMyRequests(): void {
    if (this.userId !== 0) {
      this.anfrageService.getMyRequests(this.userId).subscribe({
        next: (requests) => {
          this.myRequests = requests;
          console.log('Meine Anfragen:', this.myRequests);
        },
        error: (error) => {
          console.error('Fehler beim Laden der eigenen Anfragen:', error);
        }
      });
    }
  }
  


  getEventTitle(eventId: number | undefined): string {
    if (eventId === undefined) {
      return 'Unbekanntes Event'; // Fallback, falls keine Event-ID existiert
    }
    return this.eventsMap[eventId] || 'Unbekanntes Event';
  }
  
  // Erstelle ein neues Event
  createEvent(): void {
    this.newEvent.createdBy = this.userName;
    this.newEvent.userId = this.userId;
    this.eventService.createEvent(this.newEvent).subscribe({
      next: (event) => {
        this.loadEvents(); // Events erneut laden, damit das neue Event angezeigt wird
        this.newEvent = { title: '', description: '', createdBy: this.userName, userId: this.userId, eventDate: '' };
      },
      error: (error) => {
        console.error('Fehler beim Erstellen des Events:', error);
      }
    });
  }

  requestItem(eventId: number | undefined, requestText: string): void {
    if (!eventId || !requestText) {
      console.warn('Event ID oder Anfrage-Text fehlen oder ungültig');
      return;
    }
  
    const anfrage: Anfrage = {
      eventId: eventId,
      requestedBy: this.userName,
      requestItem: requestText,
      requestedByUserId: this.userId
    };
  
    this.anfrageService.createAnfrage(anfrage, eventId, this.userId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich gesendet');
        this.requestText[eventId] = ''; // Anfrage-Text zurücksetzen
      },
      error: (error) => {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    });
  }
  


  // Anfrage bestätigen
  confirmAnfrage(anfrageId: number): void {
    this.anfrageService.confirmAnfrage(anfrageId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich bestätigt');
        this.loadAnfragen(); // Aktualisiere die Anfragen nach der Bestätigung
      },
      error: (error) => {
        console.error('Fehler beim Bestätigen der Anfrage:', error);
      }
    });
  }

  // Anfrage ablehnen
  rejectAnfrage(anfrageId: number): void {
    this.anfrageService.rejectAnfrage(anfrageId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich abgelehnt');
        this.loadAnfragen(); // Aktualisiere die Anfragen nach der Ablehnung
      },
      error: (error) => {
        console.error('Fehler beim Ablehnen der Anfrage:', error);
      }
    });
  }

  // Event löschen
  deleteEvent(eventId: number): void {
    const confirmation = confirm('Möchten Sie dieses Event wirklich löschen?');
    if (confirmation) {
      this.eventService.deleteEvent(eventId, this.userId).subscribe({
        next: () => {
          this.loadEvents(); // Aktualisiere die Events nach dem Löschen
        },
        error: (error) => {
          console.error('Fehler beim Löschen des Events:', error);
        }
      });
    }
  }
}