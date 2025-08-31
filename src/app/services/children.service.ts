import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface Child {
  id: number;
  user_id: number;
  name: string;
  nick_name: string;
  birth_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface CreateChildRequest {
  name: string;
  nick_name?: string;
  birth_date: string; // Format: YYYY-MM-DD
}

export interface UpdateChildRequest {
  name: string;
  nick_name?: string;
  birth_date: string; // Format: YYYY-MM-DD
  is_active?: boolean;
}

export interface ChildrenResponse {
  success: boolean;
  message: string;
  data: Child[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ChildResponse {
  success: boolean;
  message: string;
  data: Child;
}

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  private readonly baseUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    if (!token) {
      console.warn('No authentication token found');
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get user's children with pagination
   */
  getChildren(page: number = 1, limit: number = 20): Observable<ChildrenResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ChildrenResponse>(`${this.baseUrl}/children`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get all children (admin only)
   */
  getAllChildren(page: number = 1, limit: number = 20): Observable<ChildrenResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ChildrenResponse>(`${this.baseUrl}/admin/children`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get child by ID
   */
  getChild(id: number): Observable<ChildResponse> {
    return this.http.get<ChildResponse>(`${this.baseUrl}/children/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Create a new child
   */
  createChild(childData: CreateChildRequest): Observable<ChildResponse> {
    return this.http.post<ChildResponse>(`${this.baseUrl}/children`, childData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update child
   */
  updateChild(id: number, childData: UpdateChildRequest): Observable<ChildResponse> {
    return this.http.put<ChildResponse>(`${this.baseUrl}/children/${id}`, childData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete child
   */
  deleteChild(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/children/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Set child active status (admin only)
   */
  setChildActive(id: number, isActive: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/children/${id}/active`, 
      { is_active: isActive }, 
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  /**
   * Calculate age from birth date
   */
  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Format birth date for input field (YYYY-MM-DD)
   */
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
