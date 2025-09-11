import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface UserActivity {
  id: number;
  user_id: number;
  activity_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  metadata?: any;
  created_at: string;
  user?: {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ActivitiesResponse {
  success: boolean;
  message: string;
  data: UserActivity[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private readonly baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get current user's activities
   */
  getMyActivities(page: number = 1, limit: number = 20): Observable<ActivitiesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ActivitiesResponse>(`${this.baseUrl}/my-activities`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get all activities (admin only)
   */
  getAllActivities(page: number = 1, limit: number = 20): Observable<ActivitiesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ActivitiesResponse>(`${this.baseUrl}/admin/activities`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get activities for a specific user (admin only)
   */
  getUserActivities(userId: number, page: number = 1, limit: number = 20): Observable<ActivitiesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ActivitiesResponse>(`${this.baseUrl}/admin/users/${userId}/activities`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  /**
   * Calculate relative time from date
   */
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Get icon for activity type
   */
  getActivityIcon(activityType: string): string {
    switch (activityType.toLowerCase()) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'account_created': return '📝';
      case 'profile_update': return '👤';
      case 'password_change': return '🔑';
      case 'user_created': return '👥';
      case 'user_updated': return '✏️';
      case 'user_deleted': return '❌';
      case 'user_activated': return '✅';
      case 'user_deactivated': return '🚫';
      default: return '📋';
    }
  }

  /**
   * Get color classes for activity type
   */
  getActivityColor(activityType: string): string {
    switch (activityType.toLowerCase()) {
      case 'login': return 'text-green-600 bg-green-100';
      case 'logout': return 'text-gray-600 bg-gray-100';
      case 'account_created': return 'text-blue-600 bg-blue-100';
      case 'profile_update': return 'text-yellow-600 bg-yellow-100';
      case 'password_change': return 'text-purple-600 bg-purple-100';
      case 'user_created': return 'text-indigo-600 bg-indigo-100';
      case 'user_updated': return 'text-orange-600 bg-orange-100';
      case 'user_deleted': return 'text-red-600 bg-red-100';
      case 'user_activated': return 'text-green-600 bg-green-100';
      case 'user_deactivated': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Format activity type for display
   */
  formatActivityType(activityType: string): string {
    return activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
