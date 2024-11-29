import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../user-profile.model';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css']
})
export class UserProfileViewComponent implements OnInit {
  user: UserProfile = { id: 0, name: '', email: '', password: '', nachname: '' }; 
  currentPassword: string = ''; // Aktuelles Passwort
  newPassword: string = ''; // Neues Passwort

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        
        this.user = profile;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading user profile:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const userId = this.user.id;

      if (userId) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            alert('Your account has been deleted successfully.');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error deleting account:', error);
            alert('There was an error deleting your account. Please try again later.');
          }
        });
      } else {
        console.error('User ID is not available.');
        alert('Unable to delete account. User ID is missing.');
      }
    }
  }

  // Funktion zur Passwortänderung
  changePassword(): void {
    if (!this.currentPassword || !this.newPassword) {
      alert('Bitte füllen Sie beide Felder aus.');
      return;
    }

    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: (response: any) => {
        if (typeof response === 'string') {
          alert(response); 
        } else if (response?.message) {
          alert(response.message); 
        } else {
          alert('Passwort erfolgreich geändert.');
        }
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (error) => {
        console.error('Error changing password:', error);
        alert('Fehler beim Ändern des Passworts. Bitte überprüfen Sie Ihre Eingaben.');
      }
    });
  }
}
