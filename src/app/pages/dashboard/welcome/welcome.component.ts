import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User, AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() navigateToView = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user from auth service if not provided as input
    if (!this.user) {
      this.user = this.authService.currentUserValue;
    }
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  onQuickActionClick(action: string): void {
    // Navigate directly using router instead of emitting event
    const route = this.getRouteForView(action);
    this.router.navigate(['/dashboard', route]);
  }

  private getRouteForView(view: string): string {
    switch (view) {
      case 'user-list': return 'users';
      case 'profile-edit': return 'profile';
      default: return view;
    }
  }
}
