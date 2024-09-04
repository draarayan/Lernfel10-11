import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../user-profile.model'; // Importiere das Interface

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css']
})
export class UserProfileViewComponent implements OnInit {
  user: UserProfile = { id: 0, name: '', email: '', password: '', nachname: '' }; // Placeholder für Benutzerdaten

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading user profile:', error);
        if (error.status === 401) { // Unauthenticated
          this.router.navigate(['/login']);
        }
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
