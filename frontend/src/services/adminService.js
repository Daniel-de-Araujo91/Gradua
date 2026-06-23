import { apiClient } from './apiClient';

export const adminService = {
  getReports: () => apiClient.get('/admin/reports'),

  approveReport: (topicId) => apiClient.post(`/admin/reports/${topicId}/approve`),

  denyReport: (topicId) => apiClient.post(`/admin/reports/${topicId}/deny`),
};
