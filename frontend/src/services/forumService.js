import { apiClient } from './apiClient';

export const forumService = {
  /**
   * Busca o feed de tópicos, filtrando opcionalmente por tipo.
   * @param {string|null} type - ex: "DÚVIDA", "AVISO", null para todos
   */
  getFeed: (type = null) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiClient.get(`/forum/feed${query}`);
  },

  /**
   * Cria um novo tópico.
   * @param {{ title: string, content: string, type: string }} data
   */
  createTopic: (data) => apiClient.post('/forum/create', data),

  /**
   * Edita um tópico existente (apenas o autor).
   * @param {string} id - UUID do tópico
   * @param {{ title: string, content: string, type: string }} data
   */
  updateTopic: (id, data) => apiClient.put(`/forum/edit/${id}`, data),

  /**
   * Remove um tópico (apenas o autor).
   * @param {string} id - UUID do tópico
   */
  deleteTopic: (id) => apiClient.delete(`/forum/delete/${id}`),
  
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



