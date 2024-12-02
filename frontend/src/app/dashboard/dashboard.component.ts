import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { EventService } from '../event.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  userName: string = '';
  newEvent = { title: '', description: '', plz: '' };
  filterPlz: string = '';
  events: any[] = [];
  filteredEvents: any[] = [];

  constructor(private userService: UserService, private eventService: EventService, private router: Router) {}

  goToEinkaufen(): void {
    this.router.navigate(['/einkaufen']);
  }

  ngOnInit(): void {

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

    // Load events
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events; // Initialize filtered events
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fehler beim Laden der Events:', error);
      }
    });
  }

  createEvent(): void {
    const eventToCreate = { ...this.newEvent, type: this.selectedEventType }; // Event-Typ hinzufügen
  
    this.eventService.createEvent(eventToCreate).subscribe({
      next: (event) => {
        this.events.push(event);
        this.filteredEvents.push(event);
        this.newEvent = { title: '', description: '', plz: '' }; // Formular zurücksetzen
        this.selectedEventType = ''; // Dropdown zurücksetzen
      },
      error: (error: HttpErrorResponse) => {
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

  eventTypes: { id: number; name: string }[] = [
    { id: 1, name: 'Shopping' },
    { id: 2, name: 'Sport' },
    { id: 3, name: 'Meeting' },
    { id: 4, name: 'Party' }
  ];
  
  selectedEventType: string = '';

}
