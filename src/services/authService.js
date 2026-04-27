import api, { setCsrfToken } from './api';

export async function initializeCsrf() {
  const response = await api.get('/auth/csrf');
  setCsrfToken(response.data?.token);
  return response.data;
}

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function logout() {
  const response = await api.delete('/auth/logout');
  setCsrfToken(null);
  return response.data;
}
