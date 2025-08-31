import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if session is valid on init
    if (!this.authService.checkStoredSession() && !this.authService.isTokenValid()) {
      this.authService.clearInvalidSession();
      this.router.navigate(['/home']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/home']);
      } else if (!this.authService.isTokenValid()) {
        // Token is expired, clear session and redirect
        this.authService.clearInvalidSession();
        this.router.navigate(['/home']);
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isUser(): boolean {
    return this.currentUser?.role === 'user';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
