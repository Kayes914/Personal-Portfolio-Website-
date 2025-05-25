// Authentication utility functions

// The correct password for dashboard access
const DASHBOARD_PASSWORD = '200410154';

// Auth token name in localStorage
const AUTH_TOKEN_NAME = 'dashboard_auth';

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Authenticate user with password
 */
export function authenticateUser(password: string): boolean {
  if (password === DASHBOARD_PASSWORD) {
    const token = generateAuthToken();
    saveAuthToken(token);
    return true;
  }
  return false;
}

/**
 * Generate auth token with expiration
 */
function generateAuthToken(): string {
  const expiration = Date.now() + TOKEN_EXPIRATION;
  return JSON.stringify({
    authenticated: true,
    expiration
  });
}

/**
 * Save auth token to localStorage
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_NAME, token);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  if (!token) {
    return false;
  }

  try {
    const parsedToken = JSON.parse(token);
    // Check if token is expired
    if (parsedToken.expiration < Date.now()) {
      localStorage.removeItem(AUTH_TOKEN_NAME);
      return false;
    }
    return parsedToken.authenticated === true;
  } catch (e) {
    // Invalid token format
    localStorage.removeItem(AUTH_TOKEN_NAME);
    return false;
  }
}

/**
 * Remove auth token (logout)
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_NAME);
  }
} 