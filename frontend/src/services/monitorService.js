import { apiClient } from './apiClient';

export const monitorService = {
  /**
   * Cria uma sessão de monitoria e dispara notificações para alunos (spec 4.2).
   * Apenas usuários com role MONITOR podem chamar com sucesso.
   * @param {{ topic, date, startTime, endTime, location, meetingLink, classSectionId }} data
   */
  createSession: (data) => apiClient.post('/monitoria/create', data),

  /** Lista sessões do monitor autenticado. */
  getMySessions: () => apiClient.get('/monitoria/minhas-sessoes'),

  /**
   * Lista sessões de monitoria de uma turma.
   * @param {string} classSectionId - UUID da turma
   */
  getSessionsByClass: (classSectionId) => apiClient.get(`/monitoria/turma/${classSectionId}`),
};
