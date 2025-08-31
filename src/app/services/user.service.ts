import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth.service';

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = '/api/v1';

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
   * Get all users (admin only)
   */
  getAllUsers(page: number = 1, limit: number = 10): Observable<UserListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<UserListResponse>(`${this.baseUrl}/admin/users`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get user by ID (admin only)
   */
  getUser(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/admin/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Create a new user (admin only)
   */
  createUser(userData: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/admin/users`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update user (admin only)
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/admin/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Set user active status (admin only)
   */
  setUserActive(id: string, isActive: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}/active`, 
      { is_active: isActive }, 
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  /**
   * Update current user's profile
   */
  updateProfile(profileData: { name: string; phone: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/profile`, profileData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Change current user's password
   */
  changePassword(passwordData: { current_password: string; new_password: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }
}
