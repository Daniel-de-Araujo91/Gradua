import { apiClient } from "./apiClient";

const BASE = '/classes';

export const classSessionService = {
  createSession(classId, date, description) {
    const params = new URLSearchParams();
    params.append('date', date);
    if (description) params.append('description', description);
    return apiClient.post(`${BASE}/${classId}/sessions?${params}`);
  },

  getSessions(classId) {
    return apiClient.get(`${BASE}/${classId}/sessions`);
  },

  deleteSession(sessionId) {
    return apiClient.delete(`${BASE}/sessions/${sessionId}`);
  },

  getAttendance(sessionId) {
    return apiClient.get(`${BASE}/sessions/${sessionId}/attendance`);
  },

  markAttendance(sessionId, attendanceList) {
    return apiClient.post(`${BASE}/sessions/${sessionId}/attendance`, attendanceList);
  },
};
