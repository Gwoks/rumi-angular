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
      login: `${this.baseUrl}/api/${this.apiVersion}/auth/login`,
      signup: `${this.baseUrl}/api/${this.apiVersion}/auth/signup`,
      logout: `${this.baseUrl}/api/${this.apiVersion}/auth/logout`,
      profile: `${this.baseUrl}/api/${this.apiVersion}/auth/profile`,
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
