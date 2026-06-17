import { apiClient } from './apiClient';

export const forumService = {
  /** Busca o feed de tópicos, filtrando opcionalmente por tipo. */
  getFeed: (type = null) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiClient.get(`/forum/feed${query}`);
  },

  createTopic: (data) => apiClient.post('/forum/create', data),
  updateTopic: (id, data) => apiClient.put(`/forum/edit/${id}`, data),
  deleteTopic: (id) => apiClient.delete(`/forum/delete/${id}`),

  // Votos — persistidos no back-end
  // type: 'up' ou 'down'. Toggle: votar igual remove o voto.
  vote: (topicId, type) => apiClient.post(`/forum/vote/${topicId}?type=${type}`),
  getVoteState: (topicId) => apiClient.get(`/forum/vote/${topicId}`),
};



