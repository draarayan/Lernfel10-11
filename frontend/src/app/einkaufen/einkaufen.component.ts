import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Request } from '../request.model';
import { RequestService } from '../request.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-einkaufen',
  templateUrl: './einkaufen.component.html',
  styleUrls: ['./einkaufen.component.css']
})
export class EinkaufenComponent implements OnInit {
  events: Event[] = [];
  requests: Request[] = [];
  newEvent: Event = { title: '', description: '', createdBy: '', userId: 0,   plz: '', eventDate:  new Date() };
  requestText: { [key: number]: string } = {};
  userName: string = '';
  userId: number = 0;
  myRequests: Request[] = [];
  eventsMap: { [key: number]: string } = {};

  constructor(
    private router: Router,
    private eventService: EventService,
    private requestService: RequestService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadEvents();
    this.loadMyRequests();
    this.loadRequests();
  }
  loadAcceptedRequests(): void { //wird noch nicht genutzt
    this.requestService.getAcceptedRequests(this.userId).subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Fehler beim Laden der akzeptierten Anfragen:', error);
      }
    });
  }
  
  loadRejectedRequests(): void { //wird noch nicht genutzt
    this.requestService.getRejectedRequests(this.userId).subscribe({
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
        this.loadRequests(); 
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
  

  loadRequests(): void {
    if (this.userId !== 0) {
      this.requestService.getRequestsByOwnerId(this.userId).subscribe({
        next: (requests) => {
          console.log('Active Requests:', requests);
          this.requests = requests;
        },
        error: (error) => {
          console.error('Fehler beim Laden der Anfragen:', error);
        }
      });
    }
  }
  

  loadMyRequests(): void {
    if (this.userId !== 0) {
      this.requestService.getMyRequests(this.userId).subscribe({
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
  
    const request: Request = {
      eventId: eventId,
      requestedBy: this.userName,
      requestItem: requestText,
      requestedByUserId: this.userId
    };
  
    this.requestService.createRequest(request, eventId, this.userId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich gesendet');
        this.requestText[eventId] = ''; 
      },
      error: (error) => {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    });
  }
  


  
  confirmRequest(requestId: number): void {
    this.requestService.confirmRequest(requestId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich bestätigt');
        this.loadRequests(); 
      },
      error: (error) => {
        console.error('Fehler beim Bestätigen der Anfrage:', error);
      }
    });
  }

  
  rejectRequest(requestId: number): void {
    this.requestService.rejectRequest(requestId).subscribe({
      next: () => {
        alert('Anfrage erfolgreich abgelehnt');
        this.loadRequests(); 
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
