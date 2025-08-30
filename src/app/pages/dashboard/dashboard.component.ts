import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserListComponent } from './user-list/user-list.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    WelcomeComponent,
    UserListComponent,
    ProfileEditComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentView: string = 'welcome';
  sidebarOpen = true;

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

  setView(view: string) {
    this.currentView = view;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
