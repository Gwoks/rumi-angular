import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, User } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

interface UserActivity {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  activity_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface ActivityResponse {
  success: boolean;
  message: string;
  data: UserActivity[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-activity-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent implements OnInit {
  currentUser: User | null = null;
  activities: UserActivity[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  limit = 20;
  total = 0;

  // Filters
  activityTypeFilter = '';
  userFilter = '';
  dateFilter = '';
  Math = Math; // Make Math available in template

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadActivities();
  }

  getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  loadActivities() {
    this.loading = true;
    
    let url: string;
    
    if (this.isAdmin()) {
      // Admin can see all activities
      url = `${this.apiService.apiUrl}/activities?page=${this.currentPage}&limit=${this.limit}`;
    } else {
      // Regular users can only see their own activities
      url = `${this.apiService.apiUrl}/my-activities?page=${this.currentPage}&limit=${this.limit}`;
    }
    
    this.http.get<ActivityResponse>(url, this.getAuthHeaders()).subscribe({
      next: (response) => {
        this.activities = response.data || [];
        if (response.pagination) {
          this.currentPage = response.pagination.page;
          this.totalPages = response.pagination.totalPages;
          this.total = response.pagination.total;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.loading = false;
        this.activities = [];
      }
    });
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadActivities();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadActivities();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadActivities();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Utility methods
  getActivityTypeColor(type: string): string {
    switch (type) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'signup':
        return 'bg-blue-100 text-blue-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'profile_update':
        return 'bg-yellow-100 text-yellow-800';
      case 'password_change':
        return 'bg-purple-100 text-purple-800';
      case 'user_created':
        return 'bg-indigo-100 text-indigo-800';
      case 'user_updated':
        return 'bg-orange-100 text-orange-800';
      case 'user_deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  formatActivityType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getUserAgent(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    
    // Simple browser detection
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Other';
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadActivities();
  }

  clearFilters() {
    this.activityTypeFilter = '';
    this.userFilter = '';
    this.dateFilter = '';
    this.currentPage = 1;
    this.loadActivities();
  }
}
