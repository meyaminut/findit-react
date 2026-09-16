/**
 * Service: ApiService
 * Sentralisasi seluruh komunikasi HTTP ke backend FindIt (Go/Gin).
 *
 * Base URL diambil dari environment variable `VITE_API_BASE_URL`
 * (lihat file .env / .env.example). Jika tidak di-set, jatuh ke URL
 * produksi backend yang sekarang live.
 *
 * Semua halaman/controller WAJIB lewat service ini agar penggantian
 * base URL cukup dilakukan di SATU tempat.
 */

const FALLBACK_BASE_URL = 'https://139-190-96-203.sslip.io/findit/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || FALLBACK_BASE_URL).replace(/\/+$/, '');

const TOKEN_KEY = 'findit_admin_token';
const USER_KEY = 'findit_admin_user';
const REMEMBER_KEY = 'findit_admin_remember';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token || '');
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('LocalStorage not available', err);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn('LocalStorage not available', err);
  }
}

export function getRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_KEY) || '';
  } catch {
    return '';
  }
}

export function setRememberedEmail(email) {
  try {
    if (email) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (err) {
    console.warn('LocalStorage not available', err);
  }
}

function buildUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body, headers = {}, formData } = {}) {
  const token = getToken();
  const finalHeaders = { ...headers };
  const opts = { method };

  if (formData) {
    // Jangan set Content-Type manual: browser yang men-set boundary multipart
    opts.body = formData;
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }
  opts.headers = finalHeaders;

  const res = await fetch(buildUrl(path), opts);

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message = payload?.message || `Request gagal (HTTP ${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  // Format standar backend: { status, message, data? } — kembalikan mentah.
  return payload || {};
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body });
export const apiPut = (path, body) => request(path, { method: 'PUT', body });
export const apiPatch = (path, body) => request(path, { method: 'PATCH', body });
export const apiDelete = (path) => request(path, { method: 'DELETE' });

/**
 * Upload file (multipart). Backend menerima field: "file" | "image" | "photo".
 */
export function apiUpload(path, file, field = 'file') {
  const fd = new FormData();
  fd.append(field, file);
  return request(path, { method: 'POST', formData: fd });
}

export default {
  API_BASE_URL,
  ApiError,
  getToken,
  getCurrentUser,
  setSession,
  clearSession,
  getRememberedEmail,
  setRememberedEmail,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiUpload
};