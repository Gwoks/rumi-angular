import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly apiVersion = environment.apiVersion;

  constructor() { }

  // Base URL getter
  get apiUrl(): string {
    return `${this.baseUrl}/api/${this.apiVersion}`;
  }

  // Authentication endpoints
  get auth() {
    return {
      login: `${this.apiUrl}/auth/login`,
      signup: `${this.apiUrl}/auth/signup`,
      logout: `${this.apiUrl}/auth/logout`,
      refreshToken: `${this.apiUrl}/auth/refresh`,
      forgotPassword: `${this.apiUrl}/auth/forgot-password`,
      resetPassword: `${this.apiUrl}/auth/reset-password`,
      verifyEmail: `${this.apiUrl}/auth/verify-email`
    };
  }

  // User endpoints
  get users() {
    return {
      profile: `${this.apiUrl}/users/profile`,
      updateProfile: `${this.apiUrl}/users/profile`,
      changePassword: `${this.apiUrl}/users/change-password`,
      uploadAvatar: `${this.apiUrl}/users/avatar`
    };
  }

  // Programs endpoints
  get programs() {
    return {
      list: `${this.apiUrl}/programs`,
      detail: (id: string) => `${this.apiUrl}/programs/${id}`,
      create: `${this.apiUrl}/programs`,
      update: (id: string) => `${this.apiUrl}/programs/${id}`,
      delete: (id: string) => `${this.apiUrl}/programs/${id}`,
      categories: `${this.apiUrl}/programs/categories`,
      enroll: (id: string) => `${this.apiUrl}/programs/${id}/enroll`,
      unenroll: (id: string) => `${this.apiUrl}/programs/${id}/unenroll`
    };
  }

  // Activities endpoints
  get activities() {
    return {
      list: `${this.apiUrl}/activities`,
      detail: (id: string) => `${this.apiUrl}/activities/${id}`,
      create: `${this.apiUrl}/activities`,
      update: (id: string) => `${this.apiUrl}/activities/${id}`,
      delete: (id: string) => `${this.apiUrl}/activities/${id}`,
      upcoming: `${this.apiUrl}/activities/upcoming`,
      join: (id: string) => `${this.apiUrl}/activities/${id}/join`,
      leave: (id: string) => `${this.apiUrl}/activities/${id}/leave`
    };
  }

  // Contact endpoints
  get contact() {
    return {
      send: `${this.apiUrl}/contact/send`,
      subscribe: `${this.apiUrl}/contact/subscribe`,
      unsubscribe: `${this.apiUrl}/contact/unsubscribe`
    };
  }

  // Content/CMS endpoints
  get content() {
    return {
      about: `${this.apiUrl}/content/about`,
      testimonials: `${this.apiUrl}/content/testimonials`,
      faq: `${this.apiUrl}/content/faq`,
      announcements: `${this.apiUrl}/content/announcements`
    };
  }

  // File upload endpoints
  get uploads() {
    return {
      image: `${this.apiUrl}/uploads/image`,
      document: `${this.apiUrl}/uploads/document`,
      avatar: `${this.apiUrl}/uploads/avatar`
    };
  }

  // Statistics endpoints
  get stats() {
    return {
      dashboard: `${this.apiUrl}/stats/dashboard`,
      programs: `${this.apiUrl}/stats/programs`,
      activities: `${this.apiUrl}/stats/activities`,
      users: `${this.apiUrl}/stats/users`
    };
  }

  // Utility method to build query parameters
  buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => searchParams.append(key, value.toString()));
        } else {
          searchParams.append(key, params[key].toString());
        }
      }
    });

    return searchParams.toString();
  }

  // Utility method to build full URL with query parameters
  buildUrlWithParams(endpoint: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }

    const queryString = this.buildQueryParams(params);
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }
}
