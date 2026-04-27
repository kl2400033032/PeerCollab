import axios from 'axios';
import { clearStoredAuth, getStoredToken } from '../utils/storage';

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: import.meta.env.VITE_AUTH_MODE !== 'bearer',
});

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const token = getStoredToken();

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!['get', 'head', 'options'].includes(method) && csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status)) {
      csrfToken = null;
      clearStoredAuth();
    }
    return Promise.reject(error);
  },
);

export default api;
