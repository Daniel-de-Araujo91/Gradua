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
      // Tinha token mas o servidor rejeitou (expirado ou inválido) → limpa e redireciona
      localStorage.removeItem('gradua_token');
      localStorage.removeItem('gradua_user');
      window.location.href = '/login';
      return;
    }
    // Sem token → lança erro para o componente tratar adequadamente
    throw new Error('É necessário fazer login para acessar este conteúdo.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorBody.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
