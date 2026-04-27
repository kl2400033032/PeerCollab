import axios from 'axios';
import { clearLegacyAuth } from '../utils/storage';

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (!['get', 'head', 'options'].includes(method) && csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      csrfToken = null;
      clearLegacyAuth();
    }
    return Promise.reject(error);
  },
);

export default api;
