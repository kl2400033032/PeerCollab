import api from './api';

export async function getAssignments() {
  const response = await api.get('/assignments');
  return response.data;
}

export async function getMyAssignments() {
  const response = await api.get('/assignments/my');
  return response.data;
}

export async function createAssignment(payload) {
  const response = await api.post('/assignments', payload);
  return response.data;
}
