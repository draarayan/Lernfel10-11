import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Anfrage } from '../anfrage.model';
import { AnfrageService } from '../anfrage.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-einkaufen',
  templateUrl: './einkaufen.component.html',
  styleUrls: ['./einkaufen.component.css']
})
export class EinkaufenComponent implements OnInit {
  events: Event[] = [];
  anfragen: Anfrage[] = [];
  newEvent: Event = { title: '', description: '', createdBy: '', userId: 0,   plz: '', eventDate:  new Date() };
  requestText: { [key: number]: string } = {};
  userName: string = '';
  userId: number = 0;
  myRequests: Anfrage[] = [];
  eventsMap: { [key: number]: string } = {};
  
  eventTypes: { name: string }[] = [
    { name: 'Shopping' },
    { name: 'Sport' },
    { name: 'Meeting' },
    { name: 'Party' },
    { name: 'custom' }
  ];

  constructor(
    private router: Router,
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
  loadAcceptedRequests(): void { //wird noch nicht genutzt
    this.anfrageService.getAcceptedRequests(this.userId).subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Fehler beim Laden der akzeptierten Anfragen:', error);
      }
    });
  }
  
  loadRejectedRequests(): void { //wird noch nicht genutzt
    this.anfrageService.getRejectedRequests(this.userId).subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Fehler beim Laden der abgelehnten Anfragen:', error);
      }
    });
  }
  

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userId = profile.id;

        this.newEvent.createdBy = this.userName; 
        this.newEvent.userId = this.userId;      
        this.loadMyRequests();
        this.loadAnfragen(); 
      },
      error: (error) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
      }
    });
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        events.forEach(event => {
          if (event.id !== undefined) {
            this.eventsMap[event.id] = event.title;
          } else {
            console.warn('Event ohne ID gefunden:', event); 
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
      return 'Unbekanntes Event'; 
    }
    return this.eventsMap[eventId] || 'Unbekanntes Event';
  }
  
  
  createEvent(): void {
    this.newEvent.createdBy = this.userName;
    this.newEvent.userId = this.userId;
    this.eventService.createEvent(this.newEvent).subscribe({
      next: (event) => {
        this.loadEvents();
        this.newEvent = { title: '', description: '', createdBy: this.userName, userId: this.userId, eventDate: new Date(), plz: '' };
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
        this.requestText[eventId] = ''; 
      },
      error: (error) => {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    });
  }
  


  
  confirmAnfrage(anfrageId: number): void {
    this.anfrageService.confirmAnfrage(anfrageId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich bestätigt');
        this.loadAnfragen(); 
      },
      error: (error) => {
        console.error('Fehler beim Bestätigen der Anfrage:', error);
      }
    });
  }

  
  rejectAnfrage(anfrageId: number): void {
    this.anfrageService.rejectAnfrage(anfrageId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich abgelehnt');
        this.loadAnfragen(); 
      },
      error: (error) => {
        console.error('Fehler beim Ablehnen der Anfrage:', error);
      }
    });
  }

  
  deleteEvent(eventId: number): void {
    const confirmation = confirm('Möchten Sie dieses Event wirklich löschen?');
    if (confirmation) {
      this.eventService.deleteEvent(eventId, this.userId).subscribe({
        next: () => {
          this.loadEvents(); 
        },
        error: (error) => {
          console.error('Fehler beim Löschen des Events:', error);
        }
      });
    }
  }
}
