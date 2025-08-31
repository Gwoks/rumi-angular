import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  currentView: string = 'welcome';
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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

    // Listen to route changes to update current view
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.route.firstChild;
        if (childRoute) {
          const routePath = childRoute.snapshot.routeConfig?.path || '';
          this.currentView = this.getViewFromRoute(routePath);
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
    // Navigate to the appropriate route instead of just setting the view
    this.router.navigate(['/dashboard', this.getRouteForView(view)]);
  }

  private getRouteForView(view: string): string {
    switch (view) {
      case 'user-list': return 'users';
      case 'profile-edit': return 'profile';
      default: return view;
    }
  }

  private getViewFromRoute(routePath: string): string {
    switch (routePath) {
      case 'users': return 'user-list';
      case 'profile': return 'profile-edit';
      default: return routePath;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
