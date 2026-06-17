import { apiClient } from './apiClient';

export const notificationService = {
  /** Busca todas as notificações do usuário logado. */
  getAll: () => apiClient.get('/notifications'),

  /** Retorna contagem de notificações não lidas para badge. */
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  /**
   * Marca uma notificação como lida.
   * @param {string} id - UUID da notificação
   */
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
};
