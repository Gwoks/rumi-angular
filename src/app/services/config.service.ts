import { Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = APP_CONFIG;

  constructor() {
    console.log('🚀 RUMI App initialized with config:', {
      environment: this.config.production ? 'production' : 'development',
      apiUrl: this.config.apiUrl,
      version: this.config.appVersion,
      debug: this.config.enableDebug
    });
  }

  // API Configuration
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get apiVersion(): string {
    return this.config.apiVersion;
  }

  get fullApiUrl(): string {
    return `${this.config.apiUrl}/api/${this.config.apiVersion}`;
  }

  // App Information
  get appName(): string {
    return this.config.appName;
  }

  get appVersion(): string {
    return this.config.appVersion;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

  get isDevelopment(): boolean {
    return !this.config.production;
  }

  // Feature Flags
  get enableAnalytics(): boolean {
    return this.config.enableAnalytics;
  }

  get enableDebug(): boolean {
    return this.config.enableDebug;
  }

  get enableNotifications(): boolean {
    return this.config.features.enableNotifications;
  }

  get enableDarkMode(): boolean {
    return this.config.features.enableDarkMode;
  }

  get enableOfflineMode(): boolean {
    return this.config.features.enableOfflineMode;
  }

  // File Upload Configuration
  get maxFileSize(): string {
    return this.config.maxFileSize;
  }

  get supportedFileTypes(): string[] {
    return this.config.supportedFileTypes;
  }

  // Utility Methods
  isFileTypeSupported(fileType: string): boolean {
    return this.config.supportedFileTypes.includes(fileType.toLowerCase());
  }

  getMaxFileSizeInBytes(): number {
    const size = this.config.maxFileSize;
    const unit = size.slice(-2).toUpperCase();
    const value = parseInt(size.slice(0, -2));
    
    switch (unit) {
      case 'KB': return value * 1024;
      case 'MB': return value * 1024 * 1024;
      case 'GB': return value * 1024 * 1024 * 1024;
      default: return value;
    }
  }

  // Debug logging (only in development)
  log(message: string, data?: any): void {
    if (this.enableDebug) {
      console.log(`[${this.appName}] ${message}`, data || '');
    }
  }

  // Error logging
  error(message: string, error?: any): void {
    console.error(`[${this.appName}] ERROR: ${message}`, error || '');
  }

  // Get full configuration (for debugging)
  getFullConfig(): AppConfig {
    return { ...this.config };
  }
}
