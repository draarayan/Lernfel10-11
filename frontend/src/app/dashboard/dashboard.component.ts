import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  userName: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString();

    // Benutzerdaten aus dem UserService laden
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name; // Hier den Namen aus dem Profil setzen
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fehler beim Laden des Benutzerprofils:', error);
        // Eventuell Weiterleitung zur Login-Seite, wenn das Profil nicht geladen werden kann
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.userService.logoutUser().subscribe({
      next: () => {
        // Nach dem Logout zur Login-Seite navigieren
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fehler beim Logout:', error);
      }
    });
  }

  goToUserProfile(): void {
    this.router.navigate(['/profile']);
  }
}
