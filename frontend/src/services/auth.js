/**
 * SkillKoder Auth Service
 * =======================
 * Manages JWT tokens (obtain, refresh, store, logout).
 * Tokens are stored in localStorage.
 *
 * Usage:
 *   import { authService } from './services/auth';
 *   const { access, refresh } = await authService.login(username, password);
 *   authService.logout();
 *   const token = authService.getAccessToken();
 */

import { API_BASE_URL } from './api';

const ACCESS_TOKEN_KEY = 'sk_access_token';
const REFRESH_TOKEN_KEY = 'sk_refresh_token';

// ---------------------------------------------------------------------------
// Token storage helpers (localStorage)
// ---------------------------------------------------------------------------

function saveTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function isAuthenticated() {
  const token = getAccessToken();
  if (!token) return false;
  // Decode JWT payload to check expiry (no library needed — just base64)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Login with Django admin credentials.
 * Returns { access, refresh } JWT tokens on success.
 * Throws an Error with a human-readable message on failure.
 */
async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.detail || data.non_field_errors?.[0] || 'Login failed. Check your credentials.'
    );
  }

  const tokens = await response.json();
  saveTokens(tokens);
  return tokens;
}

/**
 * Refresh the access token using the stored refresh token.
 * Automatically saves the new access token.
 * Returns the new access token string, or null if refresh fails.
 */
async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const { access, refresh: newRefresh } = await response.json();
  saveTokens({ access, refresh: newRefresh });
  return access;
}

/**
 * Blacklist the refresh token on the server and clear local storage.
 */
async function logout() {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
    } catch {
      // Silently fail — still clear local tokens
    }
  }
  clearTokens();
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const authService = {
  login,
  logout,
  refreshAccessToken,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  saveTokens,
  clearTokens,
};
