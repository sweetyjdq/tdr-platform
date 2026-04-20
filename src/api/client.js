/**
 * Centralized API Client for TDR Platform
 * Points to the Golang Backend (:8080)
 */

const getApiUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return isLocalhost ? 'http://localhost:8080' : `${window.location.origin}/api`;
};

const API_URL = getApiUrl();

const getAuthHeader = () => {
  const token = localStorage.getItem('tdr_auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  // If body is FormData, don't set Content-Type (browser will do it with boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem('tdr_auth_token');
      // window.location.href = '/register'; // Optional: Redirect to login
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Request Failed [${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
