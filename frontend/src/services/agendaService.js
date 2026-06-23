import { apiClient } from './apiClient';

export const agendaService = {
  getDay: (date) => apiClient.get(`/agenda/dia/${date}`),

  createReminder: (data) => apiClient.post('/agenda/lembrete', data),

  updateReminder: (id, data) => apiClient.put(`/agenda/lembrete/${id}`, data),

  deleteReminder: (id) => apiClient.delete(`/agenda/lembrete/${id}`),
};