import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importiere die AuthGuard-Klasse

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard); // Erstelle eine Instanz von AuthGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Überprüfe, ob die Instanz erstellt wurde
  });
});
