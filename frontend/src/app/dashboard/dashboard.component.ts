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
  }
  goToUserProfile(): void {
    this.router.navigate(['/profile']);
  }
  logout(): void {
    this.userService.logoutUser(); 
    this.router.navigate(['/login']); 
  }
}
