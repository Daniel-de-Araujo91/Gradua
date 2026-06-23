const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('gradua_token');
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (token) {
      localStorage.removeItem('gradua_token');
      localStorage.removeItem('gradua_user');
      window.location.href = '/login';
      return;
    }
    throw new Error('É necessário fazer login para acessar este conteúdo.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

async function uploadRequest(path, formData) {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    if (token) {
      localStorage.removeItem('gradua_token');
      localStorage.removeItem('gradua_user');
      window.location.href = '/login';
      return;
    }
    throw new Error('É necessário fazer login para acessar este conteúdo.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || `Erro ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => uploadRequest(path, formData),
};
