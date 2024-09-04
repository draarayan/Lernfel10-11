import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';  // Initialisiere mit einem leeren String
  userName: string = '';    // Optional: Initialisiere auch `userName`

  constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString();  // Setze den Wert im `ngOnInit`
    this.userName = 'User Name';  // Ersetze dies durch echte Benutzerdaten, falls verfügbar
  }
}
