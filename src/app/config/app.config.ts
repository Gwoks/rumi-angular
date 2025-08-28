// Application Configuration
// This file centralizes all configuration values
// You can easily modify these values for different environments

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  apiVersion: string;
  appName: string;
  appVersion: string;
  enableAnalytics: boolean;
  enableDebug: boolean;
  maxFileSize: string;
  supportedFileTypes: string[];
  features: {
    enableNotifications: boolean;
    enableDarkMode: boolean;
    enableOfflineMode: boolean;
  };
}

// Development Configuration
export const developmentConfig: AppConfig = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiVersion: 'v1',
  appName: 'RUMI',
  appVersion: '1.0.0',
  enableAnalytics: false,
  enableDebug: true,
  maxFileSize: '5MB',
  supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  features: {
    enableNotifications: true,
    enableDarkMode: false,
    enableOfflineMode: false
  }
};

// Production Configuration
export const productionConfig: AppConfig = {
  production: true,
  apiUrl: 'https://api.rumi.id', // 🔧 Update this with your production API URL
  apiVersion: 'v1',
  appName: 'RUMI',
  appVersion: '1.0.0',
  enableAnalytics: true,
  enableDebug: false,
  maxFileSize: '10MB',
  supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  features: {
    enableNotifications: true,
    enableDarkMode: true,
    enableOfflineMode: true
  }
};

// Staging Configuration (optional)
export const stagingConfig: AppConfig = {
  production: false,
  apiUrl: 'https://staging-api.rumi.id', // 🔧 Update this with your staging API URL
  apiVersion: 'v1',
  appName: 'RUMI (Staging)',
  appVersion: '1.0.0',
  enableAnalytics: false,
  enableDebug: true,
  maxFileSize: '5MB',
  supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  features: {
    enableNotifications: true,
    enableDarkMode: true,
    enableOfflineMode: false
  }
};

// Export current configuration based on environment
export const APP_CONFIG: AppConfig = (() => {
  // You can change this logic to determine environment
  const environment = typeof window !== 'undefined' && window.location.hostname;
  
  if (environment === 'localhost' || environment === '127.0.0.1') {
    return developmentConfig;
  } else {
    return productionConfig;
  }
})();
