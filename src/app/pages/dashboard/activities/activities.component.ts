import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ActivitiesService, UserActivity } from '../../../services/activities.service';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities: UserActivity[] = [];
  loading = false;
  isAdmin = false;
  currentPage = 1;
  totalPages = 1;
  totalActivities = 0;
  limit = 20;

  constructor(
    private authService: AuthService,
    private activitiesService: ActivitiesService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadActivities();
  }

  checkUserRole(): void {
    const user = this.authService.currentUserValue;
    this.isAdmin = user?.role === 'admin';
  }

  loadActivities(): void {
    this.loading = true;
    
    const loadMethod = this.isAdmin ? 
      this.activitiesService.getAllActivities(this.currentPage, this.limit) :
      this.activitiesService.getMyActivities(this.currentPage, this.limit);

    loadMethod.subscribe({
      next: (response) => {
        if (response.success) {
          this.activities = response.data;
          if (response.pagination) {
            this.totalPages = response.pagination.total_pages;
            this.totalActivities = response.pagination.total;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.activities = [];
        this.loading = false;
      }
    });
  }



  getActionIcon(activityType: string): string {
    return this.activitiesService.getActivityIcon(activityType);
  }

  getActionColor(activityType: string): string {
    return this.activitiesService.getActivityColor(activityType);
  }

  formatDate(dateString: string): string {
    return this.activitiesService.formatDate(dateString);
  }

  getRelativeTime(dateString: string): string {
    return this.activitiesService.getRelativeTime(dateString);
  }

  formatActivityType(activityType: string): string {
    return this.activitiesService.formatActivityType(activityType);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadActivities();
    }
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayEnd(): number {
    return Math.min(this.currentPage * this.limit, this.totalActivities);
  }
}
