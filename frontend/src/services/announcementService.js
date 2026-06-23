import { apiClient } from './apiClient';

export const announcementService = {
  create: (data) => apiClient.post('/announcements', data),

  listMyClasses: () => apiClient.get('/announcements/my-classes'),

  listStudent: () => apiClient.get('/announcements/student'),

  delete: (id) => apiClient.delete(`/announcements/${id}`),
};
