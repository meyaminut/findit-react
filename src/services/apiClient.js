/**
 * Service: apiClient
 * Centralized HTTP client foundation for future backend API integration.
 * Supports:
 * - Base URL configuration via import.meta.env.VITE_API_BASE_URL
 * - Request interceptor injecting JWT Bearer tokens from localStorage/sessionStorage
 * - Standard JSON serialization & headers
 * - Normalized response parsing and error handling
 * - Reusable get, post, put, patch, and delete helpers
 */

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:8000/api';
};

const getAuthToken = () => {
  try {
    return (
      localStorage.getItem('findit_token') ||
      sessionStorage.getItem('findit_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Core request dispatcher with interceptor logic
 * Dilengkapi timeout (AbortController) agar request yang macet tidak
 * menggantung UI — dipakai halaman verifikasi/dashboard.
 */
const REQUEST_TIMEOUT_MS = 25000;

async function request(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const externalSignal = options.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else if (externalSignal.addEventListener) {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  const token = getAuthToken();

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {})
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    signal: controller.signal,
    body: isFormData
      ? options.body
      : typeof options.body === 'object' && options.body !== null
      ? JSON.stringify(options.body)
      : options.body
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('findit_unauthorized', { detail: { url } }));
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (isJson && (data.message || data.error)) ||
        `HTTP Request failed with status ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (controller.signal.aborted) {
      error.status = 0;
      error.isNetworkError = true;
      error.timeout = true;
    } else if (!error.status) {
      error.status = 0;
      error.isNetworkError = true;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data = null, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body: data });
  },

  put(endpoint, data = null, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body: data });
  },

  patch(endpoint, data = null, options = {}) {
    return request(endpoint, { ...options, method: 'PATCH', body: data });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  },

  setToken(token, persistToSession = false) {
    if (persistToSession) {
      sessionStorage.setItem('findit_token', token);
    } else {
      localStorage.setItem('findit_token', token);
    }
  },

  clearToken() {
    localStorage.removeItem('findit_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('findit_token');
    sessionStorage.removeItem('token');
  }
};

export const get = (endpoint, options) => apiClient.get(endpoint, options);
export const post = (endpoint, data, options) => apiClient.post(endpoint, data, options);
export const put = (endpoint, data, options) => apiClient.put(endpoint, data, options);
export const patch = (endpoint, data, options) => apiClient.patch(endpoint, data, options);
export const del = (endpoint, options) => apiClient.delete(endpoint, options);

export default apiClient;
