import api from './api';

export async function getAdminAnalytics() {
  const response = await api.get('/analytics/admin');
  return response.data;
}
