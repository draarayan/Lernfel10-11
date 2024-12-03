import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { EventService } from '../event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '../event.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];
  currentDate: string = '';
  userName: string = '';
  newEvent: Event = { title: '', description: '', createdBy: '', userId: 0,   plz: '', eventDate:  new Date() };
  filterPlz: string = '';
  userId: number = 0;
  filteredEvents: any[] = [];
  selectedDate: string = ''; // Für das ausgewählte Datum
  selectedDayEvents: any[] = []; // Events für das ausgewählte Datum

  constructor(private userService: UserService, private eventService: EventService, private router: Router) {}

  goToEinkaufen(): void {
    this.router.navigate(['/einkaufen']);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.currentDate = new Date().toLocaleDateString();
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
        this.router.navigate(['/login']);
      }
    });

    
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events; 
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fehler beim Laden der Events:', error);
      }
    });
  }


  createEvent(): void {
    this.newEvent.createdBy = this.userName;
    this.newEvent.userId = this.userId;
    this.eventService.createEvent(this.newEvent).subscribe({
      next: (event) => {
        this.newEvent = { title: '', description: '', createdBy: this.userName, userId: this.userId, eventDate: new Date(), plz: '' };
      },
      error: (error) => {
        console.error('Fehler beim Erstellen des Events:', error);
      }
    });
  }  

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => event.plz.includes(this.filterPlz));
  }

  logout(): void {
    this.userService.logoutUser();
    this.router.navigate(['/login']);
  }

  goToUserProfile(): void {
    this.router.navigate(['/profile']);
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userId = profile.id;

        this.newEvent.createdBy = this.userName; 
        this.newEvent.userId = this.userId;    
      },
      error: (error) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
      }
    });
  }

  eventTypes: { id: number; name: string }[] = [
    { id: 1, name: 'Einkauf' },
    { id: 2, name: 'Sport' },
    { id: 3, name: 'Treffen' },
    { id: 4, name: 'Feier' },
    { id: 5, name: 'Eigenes' }
  ];  
  
  selectedEventType: string = '';

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;

        // Events des aktuellen Tages laden, falls ein Datum gewählt ist
        if (this.selectedDate) {
          this.filterEventsByDate();
        }
      },
      error: (error) => {
        console.error('Fehler beim Laden der Events:', error);
      }
    });
  }

  onDateSelected(): void {
    if (this.selectedDate) {
      this.filterEventsByDate();
    }
  }

  filterEventsByDate(): void {
    // Konvertiere das ausgewählte Datum in den Format 'YYYY-MM-DD'
    const selectedDateString = new Date(this.selectedDate).toISOString().split('T')[0];
  
    // Filtere die Events, wobei das Datum korrekt verglichen wird
    this.selectedDayEvents = this.events.filter((event) => {
      if (!event.eventDate) {
        console.warn('Event has no date:', event);
        return false;
      }
      const eventDateString = new Date(event.eventDate).toISOString().split('T')[0];
      console.log('Comparing:', eventDateString, selectedDateString);
      return eventDateString === selectedDateString;
    });
  }

}
