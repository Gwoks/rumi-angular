import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  phone: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if user is already logged in on service initialization
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiService.auth.login, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('currentUser', JSON.stringify(response.data.user));
              localStorage.setItem('token', response.data.token);
            }
            this.currentUserSubject.next(response.data.user);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        })
      );
  }

  signup(credentials: SignupCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiService.auth.signup, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('currentUser', JSON.stringify(response.data.user));
              localStorage.setItem('token', response.data.token);
            }
            this.currentUserSubject.next(response.data.user);
          } else {
            throw new Error(response.message || 'Signup failed');
          }
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  updateCurrentUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getProfile(): Observable<{success: boolean, data: User, message: string}> {
    const token = this.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    return this.http.get<{success: boolean, data: User, message: string}>(this.apiService.auth.profile, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.updateCurrentUser(response.data);
          }
        })
      );
  }

  // Check if token is valid
  isTokenValid(): boolean {
    const token = this.getToken();
    const user = this.currentUserValue;
    
    if (!token || !user) {
      return false;
    }

    try {
      // Basic JWT token validation - check if token is not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  // Clear invalid session
  clearInvalidSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  // Check and validate stored session on app init
  checkStoredSession(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('currentUser');
      
      if (token && storedUser) {
        if (this.isTokenValid()) {
          try {
            const user = JSON.parse(storedUser);
            this.currentUserSubject.next(user);
            return true;
          } catch (e) {
            this.clearInvalidSession();
          }
        } else {
          this.clearInvalidSession();
        }
      }
    }
    return false;
  }
}
