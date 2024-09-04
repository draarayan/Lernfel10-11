import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = { name: '', email: '', password: '' }; // Placeholder für Benutzerdaten

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Hier wird die Methode zum Abrufen der Benutzerdaten aufgerufen
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.userService.deleteUser().subscribe({
        next: () => {
          alert('Your account has been deleted successfully.');
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting account:', error);
          alert('There was an error deleting your account. Please try again later.');
        }
      });
    }
  }
}
