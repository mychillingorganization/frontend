// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // Templates
  TEMPLATES: '/api/templates',
  TEMPLATE_BY_ID: (id) => `/api/templates/${id}`,
  
  // Generation
  GENERATE: '/api/generate',
  FETCH_SHEET_DATA: '/api/sheets/fetch',
  
  // User
  USER_PROFILE: '/api/user/profile',
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
