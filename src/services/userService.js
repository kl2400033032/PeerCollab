import api from './api';

export async function getStudents() {
  const response = await api.get('/users/students');
  return response.data;
}
