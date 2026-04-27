import api from './api';

export async function getProjects(params) {
  const response = await api.get('/projects', { params });
  return response.data;
}

export async function getProjectById(id) {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

export async function getMyProjects() {
  const response = await api.get('/projects/mine');
  return response.data;
}

export async function createProject(payload) {
  const response = await api.post('/projects', payload);
  return response.data;
}

export async function updateProject(id, payload) {
  const response = await api.put(`/projects/${id}`, payload);
  return response.data;
}

export async function addReview(projectId, payload) {
  const response = await api.post(`/projects/${projectId}/reviews`, payload);
  return response.data;
}

export async function addComment(projectId, payload) {
  const response = await api.post(`/projects/${projectId}/comments`, payload);
  return response.data;
}

export async function uploadProjectAttachment(projectId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/projects/${projectId}/attachment`, formData);
  return response.data;
}

export function getProjectAttachmentUrl(projectId) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  return `${baseURL}/projects/${projectId}/attachment/download`;
}
