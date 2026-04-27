import api from './api';

export async function getNotificationSummary() {
  const response = await api.get('/notifications/summary');
  return response.data;
}

export async function getNotifications(params) {
  const response = await api.get('/notifications', { params });
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}
