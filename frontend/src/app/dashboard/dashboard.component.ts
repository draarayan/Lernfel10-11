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
  
}
