import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMenuOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
