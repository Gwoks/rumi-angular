// Environment configuration using .env file
export const environment = {
  production: false,
  apiUrl: (process.env as any)['NG_APP_API_URL'] || 'http://localhost:3000',
  apiVersion: (process.env as any)['NG_APP_API_VERSION'] || 'v1',
  appName: (process.env as any)['NG_APP_NAME'] || 'RUMI',
  appVersion: (process.env as any)['NG_APP_VERSION'] || '1.0.0',
  enableAnalytics: (process.env as any)['NG_APP_ENABLE_ANALYTICS'] === 'true',
  enableDebug: (process.env as any)['NG_APP_ENABLE_DEBUG'] === 'true',
  enableNotifications: (process.env as any)['NG_APP_ENABLE_NOTIFICATIONS'] === 'true',
  enableDarkMode: (process.env as any)['NG_APP_ENABLE_DARK_MODE'] === 'true',
  maxFileSize: (process.env as any)['NG_APP_MAX_FILE_SIZE'] || '5MB'
};
