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

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private router: Router
  ) {}

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
    this.eventService.createEvent(this.newEvent).subscribe({
      next: (event) => {
        this.events.push(event);
        this.filteredEvents.push(event);
        this.newEvent = { title: '', description: '', plz: '' }; // Reset form after creation
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

  goToEinkaufen(): void {
    this.router.navigate(['/einkaufen']);
  }
}
