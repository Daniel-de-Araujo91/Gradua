import { apiClient } from './apiClient';

export const academicHistoryService = {
  getHistory: () => apiClient.get('/academic-history'),
};
