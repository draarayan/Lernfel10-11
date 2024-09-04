import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.servie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';  // Initialisiere mit einem leeren String
  userName: string = '';    // Optional: Initialisiere auch `userName`

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString();  // Setze den Wert im `ngOnInit`
    this.userName = 'User Name';  // Ersetze dies durch echte Benutzerdaten, falls verfügbar
  }
  logout(): void {
    this.userService.logoutUser(); // Logout-Methode im UserService aufrufen
    this.router.navigate(['/login']); // Nach dem Logout zur Login-Seite navigieren
  }
}
