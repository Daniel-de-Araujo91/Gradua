import { apiClient } from './apiClient';

export const announcementService = {
  create: (data) => apiClient.post('/announcements', data),

  listMyClasses: () => apiClient.get('/announcements/my-classes'),

  listStudent: () => apiClient.get('/announcements/student'),

  listProgramAnnouncements: () => apiClient.get('/announcements/program'),

  listPrograms: () => apiClient.get('/announcements/programs/list'),

  delete: (id) => apiClient.delete(`/announcements/${id}`),
};
