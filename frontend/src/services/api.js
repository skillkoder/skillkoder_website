/**
 * SkillKoder API Service
 * ======================
 * Centralised fetch wrapper for all Django REST API calls.
 *
 * Base URL resolves automatically:
 *   Local dev   →  http://localhost:8000/api/v1
 *   Production  →  https://api.skillkoder.com/api/v1
 *               (set REACT_APP_API_URL in .env or .env.production)
 *
 * Features:
 *   - Automatic Bearer token injection from localStorage
 *   - Silent JWT refresh on 401 (one retry)
 *   - Consistent error handling
 *
 * Usage:
 *   import { apiService } from './services/api';
 *   const courses = await apiService.getCourses({ niche: 'data-analytics' });
 *   const detail  = await apiService.getCourseBySlug('data-analytics-course-online');
 */

// ---------------------------------------------------------------------------
// Base URL — configure via REACT_APP_API_URL environment variable
// ---------------------------------------------------------------------------
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// ---------------------------------------------------------------------------
// Internal fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Builds query string from a plain object, skipping null/undefined values.
 */
function buildQueryString(params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

/**
 * Core fetch helper.
 * - Injects Authorization header when a token is available.
 * - Retries once with a refreshed token on 401.
 * - Throws a structured ApiError on non-2xx responses.
 */
async function request(endpoint, options = {}, retry = true) {
  // Lazy import to avoid circular dependency
  const { authService } = await import('./auth');

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  // Inject JWT if available
  const token = authService.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Default Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(url, { ...options, headers });

  // Handle 401 — try a silent token refresh once
  if (response.status === 401 && retry) {
    const newToken = await authService.refreshAccessToken();
    if (newToken) {
      return request(endpoint, options, false);
    }
    // Refresh also failed — user must re-login
    authService.clearTokens();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    throw new ApiError(response.status, errorData);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

/** Structured API error */
class ApiError extends Error {
  constructor(status, data) {
    const message =
      typeof data === 'string'
        ? data
        : data?.detail || data?.message || JSON.stringify(data);
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

/**
 * Fetch the list of active courses.
 *
 * @param {object} filters  - Optional filters:
 *   niche:       'data-analytics' | 'data-science' | 'generative-ai' | 'azure-data-engineering'
 *   is_featured: true | false
 *   difficulty:  'beginner' | 'intermediate' | 'advanced'
 *   search:      string
 *   ordering:    string (e.g. '-created_at')
 * @returns {Promise<object[]>}  Array of CourseListSerializer objects
 */
async function getCourses(filters = {}) {
  const qs = buildQueryString(filters);
  const data = await request(`/courses/${qs}`);
  // DRF pagination — return results array
  return data?.results ?? data;
}

/**
 * Fetch full course detail by slug.
 * Includes tools, SEO metadata, and FAQ JSON-LD.
 *
 * @param {string} slug  e.g. 'data-analytics-course-online'
 * @returns {Promise<object>}  CourseDetailSerializer object
 */
async function getCourseBySlug(slug) {
  return request(`/courses/${slug}/`);
}

/**
 * Fetch all tools.
 * @param {string} [search] - Optional name filter
 * @returns {Promise<object[]>}
 */
async function getTools(search) {
  const qs = buildQueryString(search ? { search } : {});
  return request(`/tools/${qs}`);
}

// ---------------------------------------------------------------------------
// Admin endpoints (require IsAdminUser JWT)
// ---------------------------------------------------------------------------

/**
 * Create a new course.
 * @param {FormData|object} data  Use FormData when uploading hero_banner image.
 */
async function createCourse(data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return request('/admin/courses/', { method: 'POST', body });
}

/**
 * Update an existing course (full replace).
 * @param {string} slug
 * @param {FormData|object} data
 */
async function updateCourse(slug, data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return request(`/admin/courses/${slug}/`, { method: 'PUT', body });
}

/**
 * Partially update a course (PATCH).
 * @param {string} slug
 * @param {object} data  Only the fields to update
 */
async function patchCourse(slug, data) {
  return request(`/admin/courses/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a course.
 * @param {string} slug
 */
async function deleteCourse(slug) {
  return request(`/admin/courses/${slug}/`, { method: 'DELETE' });
}

/**
 * Create a tool (with optional icon upload).
 * @param {FormData|object} data
 */
async function createTool(data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return request('/admin/tools/', { method: 'POST', body });
}

/**
 * Update a tool.
 * @param {number} id
 * @param {FormData|object} data
 */
async function updateTool(id, data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return request(`/admin/tools/${id}/`, { method: 'PUT', body });
}

/**
 * Delete a tool.
 * @param {number} id
 */
async function deleteTool(id) {
  return request(`/admin/tools/${id}/`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const apiService = {
  // Public
  getCourses,
  getCourseBySlug,
  getTools,
  // Admin CRUD
  createCourse,
  updateCourse,
  patchCourse,
  deleteCourse,
  createTool,
  updateTool,
  deleteTool,
};

export { ApiError };
