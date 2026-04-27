import api from './api';

export async function getAdminDashboard() {
  const response = await api.get('/dashboard/admin');
  return response.data;
}

export async function getStudentDashboard() {
  const response = await api.get('/dashboard/student');
  return response.data;
}
