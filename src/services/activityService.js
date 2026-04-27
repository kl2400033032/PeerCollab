import api from './api';

export async function getActivity(params) {
  const response = await api.get('/activity', { params });
  return response.data;
}
