import { apiClient } from './apiClient';

export const notificationService = {
  getAll: () => apiClient.get('/notifications'),

  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  /**
   * Marca uma notificação como lida.
   * @param {string} id - UUID da notificação
   */
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),

  /**
   * Exclui uma notificação.
   * @param {string} id - UUID da notificação
   */
  delete: (id) => apiClient.delete(`/notifications/${id}`),

  /**
   * Exclui todas as notificações já lidas.
   */
  deleteAllRead: () => apiClient.delete('/notifications/read'),
};
