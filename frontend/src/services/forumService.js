import { apiClient } from './apiClient';

export const forumService = {
  getFeed: (type = null) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiClient.get(`/forum/feed${query}`);
  },

  createTopic: (data) => apiClient.post('/forum/create', data),
  updateTopic: (id, data) => apiClient.put(`/forum/edit/${id}`, data),
  deleteTopic: (id) => apiClient.delete(`/forum/delete/${id}`),

  
  vote: (topicId, type) => apiClient.post(`/forum/vote/${topicId}?type=${type}`),
  getVoteState: (topicId) => apiClient.get(`/forum/vote/${topicId}`),
};



