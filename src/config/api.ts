export const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN:            `${API_BASE_URL}/auth/login`,
  REFRESH_TOKEN:    `${API_BASE_URL}/auth/refresh`,
  FORGOT_PASSWORD:  `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD:   `${API_BASE_URL}/auth/reset-password`,

  // Guest
  EMERGENCY_ALERTS:         `${API_BASE_URL}/guest/alerts`,
  EVACUATION_CENTERS:       `${API_BASE_URL}/guest/evacuation-centers`,
  EMERGENCY_CONTACTS:       `${API_BASE_URL}/guest/contacts`,
  INCIDENT_REPORT:          `${API_BASE_URL}/guest/incident-reports`,
  NEWS_AND_VIDEOS:          `${API_BASE_URL}/guest/news`,

  // Admin
  ADMIN_INCIDENT_REPORTS:   `${API_BASE_URL}/admin/incident-reports`,
  ADMIN_EVACUATION_CENTERS: `${API_BASE_URL}/admin/evacuation-centers`,
  ADMIN_EMERGENCY_CONTACTS: `${API_BASE_URL}/admin/contacts`,
  ADMIN_ALERTS:             `${API_BASE_URL}/admin/alerts`,
  ADMIN_NEWS_AND_VIDEOS:    `${API_BASE_URL}/admin/news`,
  ADMIN_USERS:              `${API_BASE_URL}/admin/users`, // For managing barangay users etc.
  ADMIN_LOGS:               `${API_BASE_URL}/admin/logs`,
  ADMIN_BROADCAST_ALERT:    `${API_BASE_URL}/admin/broadcast`,

  // Barangay
  BARANGAY_EVACUATION_CENTERS: `${API_BASE_URL}/barangay/evacuation-centers`, // specific to barangay
  BARANGAY_INCIDENT_REPORTS:   `${API_BASE_URL}/barangay/incident-reports`, // specific to barangay
  BARANGAY_CENTERS_OVERVIEW:   `${API_BASE_URL}/barangay/dashboard-overview`,
  BARANGAY_COORDINATION:       `${API_BASE_URL}/barangay/coordination`, // For push notifications/chat
  BARANGAY_LOGS:               `${API_BASE_URL}/barangay/logs`,
  BARANGAY_CONTENT_ACCESS:     `${API_BASE_URL}/barangay/content`,
};