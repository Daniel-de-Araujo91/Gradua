import { apiClient } from './apiClient';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('gradua_token');
}

export const documentService = {
  list: () => apiClient.get('/documents'),

  upload: (file, docType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    return apiClient.upload('/documents', formData);
  },

  download: async (docType) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/documents/${docType}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Erro ao baixar documento');
    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'documento';
    return { blob, contentType, filename, url: URL.createObjectURL(blob) };
  },

  delete: (docType) => apiClient.delete(`/documents/${docType}`),
};
