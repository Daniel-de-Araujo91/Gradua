import { apiClient } from './apiClient';

export const gradeService = {
  getProfessorClasses: () => apiClient.get('/grades/professor/classes'),

  saveGrades: (classId, grades) => apiClient.post(`/grades/save/${classId}`, grades),

  getEnrollmentGrades: (enrollmentId) => apiClient.get(`/grades/enrollment/${enrollmentId}`),
};
