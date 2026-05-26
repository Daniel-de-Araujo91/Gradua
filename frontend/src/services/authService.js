import { apiClient } from './apiClient';

export const authService = {
  /**
   * Faz login e retorna { firstName, lastName, token }
   */
  login: (document, password) =>
    apiClient.post('/auth/login', { document, password }),

  /**
   * Registra novo usuário e retorna { firstName, lastName, token }
   * @param {object} data - { firstName, lastName, email, document, password, isForeigner }
   */
  register: (data) =>
    apiClient.post('/auth/register', data),
};
