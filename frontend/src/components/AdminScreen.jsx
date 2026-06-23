import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import { Tooltip } from 'flowbite-react';
import { 
  ShieldAlert, Megaphone, MessageSquare, 
  Trash2, Check, AlertTriangle, Send, Info, X, Loader2,
  GraduationCap, Save, Calendar, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forumService } from '../services/forumService';
import { adminService } from '../services/adminService';
import { gradeService } from '../services/gradeService';
import { announcementService } from '../services/announcementService';
import { classSessionService } from '../services/classSessionService';

const AdminScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOnlyProfessor = user?.role?.toUpperCase() === 'PROFESSOR';
  const [activeSubTab, setActiveSubTab] = useState(isOnlyProfessor ? 'notas' : 'forum');

  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [confirmForumId, setConfirmForumId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeout = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const data = await adminService.getReports();
      setReportedPosts(data || []);
    } catch (err) {
      showToast('Erro ao carregar denúncias: ' + (err.message || 'desconhecido'), 'error');
    } finally {
      setReportsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeSubTab === 'forum') {
      fetchReports();
    }
  }, [activeSubTab, fetchReports]);

  const handleApprove = async (topicId) => {
    try {
      await adminService.approveReport(topicId);
      setReportedPosts(prev => prev.filter(p => p.topicId !== topicId));
      showToast("Postagem aprovada e restaurada ao fórum!", "success");
    } catch (err) {
      showToast(err.message || 'Erro ao aprovar postagem', 'error');
    }
  };

  const handleDeny = async (topicId) => {
    try {
      await adminService.denyReport(topicId);
      setReportedPosts(prev => prev.filter(p => p.topicId !== topicId));
      setConfirmForumId(null);
      showToast("Postagem e todos os dados removidos!", "success");
    } catch (err) {
      showToast(err.message || 'Erro ao remover postagem', 'error');
    }
  };

  // ---- Grade Entry ----
  const [gradeClasses, setGradeClasses] = useState([]);
  const [selectedGradeClass, setSelectedGradeClass] = useState(null);
  const [gradeStudents, setGradeStudents] = useState([]);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [savingGrades, setSavingGrades] = useState(false);

  const loadGradeClasses = useCallback(async () => {
    setGradeLoading(true);
    try {
      const data = await gradeService.getProfessorClasses();
      setGradeClasses(data || []);
    } catch (err) {
      showToast('Erro ao carregar turmas: ' + (err.message || ''), 'error');
    } finally {
      setGradeLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeSubTab === 'notas') {
      loadGradeClasses();
    }
  }, [activeSubTab, loadGradeClasses]);

  const handleSelectGradeClass = (classId) => {
    const cls = gradeClasses.find(c => c.classId === classId);
    setSelectedGradeClass(cls);
    if (cls) {
      setGradeStudents(cls.students.map(s => ({ ...s })));
    } else {
      setGradeStudents([]);
    }
  };

  const handleGradeChange = (enrollmentId, field, value) => {
    setGradeStudents(prev => prev.map(s => {
      if (s.enrollmentId !== enrollmentId) return s;
      return { ...s, [field]: value };
    }));
  };

  const handleSaveGrades = async () => {
    if (!selectedGradeClass) return;
    setSavingGrades(true);
    try {
      const entries = [];
      for (const student of gradeStudents) {
        for (const type of ['ab1', 'ab2', 'reav', 'finalGrade']) {
          const raw = student[type];
          if (raw === null || raw === undefined || raw === '') continue;
          const normalized = String(raw).replace(',', '.');
          const parsed = parseFloat(normalized);
          if (isNaN(parsed)) continue;
          if (parsed < 0 || parsed > 10) {
            showToast(`Nota deve estar entre 0 e 10 (${student.studentName})`, 'error');
            return;
          }
          const decimalPlaces = (normalized.split('.')[1] || '').length;
          if (decimalPlaces > 2) {
            showToast(`Nota pode ter no máximo 2 casas decimais (${student.studentName})`, 'error');
            return;
          }
          entries.push({
            enrollmentId: student.enrollmentId,
            gradeType: type === 'finalGrade' ? 'FINAL' : type.toUpperCase(),
            value: parsed,
          });
        }
      }
      if (entries.length === 0) {
        showToast('Nenhuma nota para salvar.', 'info');
        return;
      }
      await gradeService.saveGrades(selectedGradeClass.classId, entries);
      showToast('Notas salvas com sucesso!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao salvar notas', 'error');
    } finally {
      setSavingGrades(false);
    }
  };

  // ---- Attendance ----
  const [faltasClasses, setFaltasClasses] = useState([]);
  const [selectedFaltasClass, setSelectedFaltasClass] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionDesc, setNewSessionDesc] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // ---- Announcements ----
  const [newAnnounce, setNewAnnounce] = useState({ title: '', message: '', classId: '' });
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announceHistory, setAnnounceHistory] = useState([]);
  const [announceHistoryLoading, setAnnounceHistoryLoading] = useState(false);
  const [confirmAnnounceId, setConfirmAnnounceId] = useState(null);
  const [professorClasses, setProfessorClasses] = useState([]);

  const loadAnnounceHistory = useCallback(async () => {
    setAnnounceHistoryLoading(true);
    try {
      const data = await announcementService.listMyClasses();
      setAnnounceHistory(data || []);
    } catch (err) {
      setAnnounceHistory([]);
    } finally {
      setAnnounceHistoryLoading(false);
    }
  }, []);

  const loadProfessorClasses = useCallback(async () => {
    try {
      const data = await gradeService.getProfessorClasses();
      setProfessorClasses(data || []);
    } catch (err) {
      setProfessorClasses([]);
    }
  }, []);

  const loadFaltasClasses = useCallback(async () => {
    try {
      const data = await gradeService.getProfessorClasses();
      setFaltasClasses(data || []);
    } catch (err) {
      setFaltasClasses([]);
    }
  }, []);

  const loadSessions = useCallback(async (classId) => {
    if (!classId) { setSessions([]); return; }
    setSessionsLoading(true);
    try {
      const data = await classSessionService.getSessions(classId);
      setSessions(data || []);
    } catch (err) {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const handleSelectFaltasClass = (classId) => {
    const cls = faltasClasses.find(c => c.classId === classId);
    setSelectedFaltasClass(cls);
    setSelectedSession(null);
    setAttendanceList([]);
    loadSessions(classId);
  };

  const handleCreateSession = async () => {
    if (!selectedFaltasClass || !newSessionDate) return;
    try {
      await classSessionService.createSession(selectedFaltasClass.classId, newSessionDate, newSessionDesc);
      setNewSessionDate('');
      setNewSessionDesc('');
      loadSessions(selectedFaltasClass.classId);
      showToast('Aula registrada!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao registrar aula', 'error');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await classSessionService.deleteSession(sessionId);
      if (selectedSession?.sessionId === sessionId) {
        setSelectedSession(null);
        setAttendanceList([]);
      }
      loadSessions(selectedFaltasClass.classId);
      showToast('Aula removida.', 'info');
    } catch (err) {
      showToast(err.message || 'Erro ao remover aula', 'error');
    }
  };

  const handleOpenAttendance = async (session) => {
    setSelectedSession(session);
    setAttendanceLoading(true);
    try {
      const data = await classSessionService.getAttendance(session.sessionId);
      setAttendanceList(data || []);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar chamada', 'error');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleToggleAttendance = (enrollmentId) => {
    setAttendanceList(prev => prev.map(a => {
      if (a.enrollmentId !== enrollmentId) return a;
      return { ...a, present: a.present === false ? true : false };
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSession) return;
    setSavingAttendance(true);
    try {
      await classSessionService.markAttendance(selectedSession.sessionId, attendanceList);
      showToast('Chamada salva!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao salvar chamada', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'comunicados') {
      loadAnnounceHistory();
      loadProfessorClasses();
    }
    if (activeSubTab === 'faltas') {
      loadFaltasClasses();
    }
  }, [activeSubTab, loadAnnounceHistory, loadProfessorClasses, loadFaltasClasses]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnounce.title.trim() || !newAnnounce.classId) return;
    setAnnounceLoading(true);
    try {
      const created = await announcementService.create({
        title: newAnnounce.title,
        content: newAnnounce.message || newAnnounce.title,
        classId: newAnnounce.classId,
      });
      setAnnounceHistory(prev => [created, ...prev]);
      showToast('Comunicado enviado para a turma!', 'success');
      setNewAnnounce({ title: '', message: '', classId: '' });
    } catch (err) {
      showToast(err.message || 'Erro ao publicar comunicado.', 'error');
    } finally {
      setAnnounceLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await announcementService.delete(id);
      setAnnounceHistory(prev => prev.filter(a => a.id !== id));
      setConfirmAnnounceId(null);
      showToast("Comunicado apagado.", "info");
    } catch (err) {
      showToast(err.message || 'Erro ao apagar comunicado', 'error');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col relative">
      <Header activeTab="home" />

      <main className="flex-1 px-4 py-4 overflow-y-auto pb-28">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gradua-perfil mb-1">
            <ShieldAlert size={20} />
            <span className="text-xs font-bold tracking-widest uppercase">Acesso Restrito</span>
          </div>
          <h1 className="text-2xl font-black text-gradua-perfil leading-tight">Painel de Controle</h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Moderação & Gestão Docente • UFAL</p>
        </div>

        <div className="flex gap-1 bg-gray-200/60 p-1 rounded-xl mb-6">
          {isOnlyProfessor && (
            <>
              <button 
                onClick={() => setActiveSubTab('notas')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'notas' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <GraduationCap size={16} /> Notas
              </button>
              <button 
                onClick={() => setActiveSubTab('faltas')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'faltas' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <UserCheck size={16} /> Faltas
              </button>
            </>
          )}
          {!isOnlyProfessor && (
            <button 
              onClick={() => setActiveSubTab('forum')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'forum' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              <MessageSquare size={16} /> Fórum
            </button>
          )}
          <button 
            onClick={() => setActiveSubTab('comunicados')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'comunicados' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <Megaphone size={16} /> Comunicados
          </button>

        </div>

        {activeSubTab === 'forum' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Denúncias Recentes</h2>
            
            {reportsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : reportedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-gray-500 text-sm font-medium">
                Nenhuma denúncia pendente de revisão.
              </div>
            ) : (
              reportedPosts.map(post => (
                <div key={post.topicId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 flex items-center gap-1 w-fit mb-1">
                        <AlertTriangle size={12} /> {post.reportCount} {post.reportCount === 1 ? 'denúncia' : 'denúncias'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-1 w-fit mb-1">
                        <MessageSquare size={12} /> {post.downVoteCount} downvotes
                      </span>
                      <h3 className="text-base font-bold text-gradua-primary">{post.title}</h3>
                      <p className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Por: {post.authorName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmForumId === post.topicId ? (
                        <div className="flex items-center gap-1.5 bg-red-50 rounded-xl px-2 py-1 border border-red-200 animate-fade-in">
                          <span className="text-[10px] font-bold text-red-600 px-1">Apagar?</span>
                          <button onClick={() => handleDeny(post.topicId)} className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setConfirmForumId(null)} className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Tooltip content="Aprovar e restaurar ao fórum" placement="bottom">
                            <button 
                              onClick={() => handleApprove(post.topicId)}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-100 transition-colors rounded-xl">
                              <Check size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Apagar postagem" placement="bottom">
                            <button 
                              onClick={() => setConfirmForumId(post.topicId)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-xl">
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    "{post.content}"
                  </p>
                  {post.reports && post.reports.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Motivos das denúncias:</span>
                      {post.reports.map((r, idx) => (
                        <div key={idx} className="text-xs text-gray-500 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100">
                          <span className="font-semibold text-gray-700">{r.authorName}:</span> "{r.reason}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'notas' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-gradua-primary mb-4">Lançamento de Notas</h3>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Selecione a Turma</label>
                <select
                  value={selectedGradeClass?.classId || ''}
                  onChange={e => handleSelectGradeClass(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-bold text-gray-700"
                >
                  <option value="">— Selecione —</option>
                  {gradeClasses.map(cls => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.subjectCode} - {cls.subjectName} ({cls.academicTerm})
                    </option>
                  ))}
                </select>
              </div>

              {gradeLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : selectedGradeClass && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">Aluno</th>
                        <th className="text-center py-2 px-2 text-xs font-bold text-gray-500 uppercase w-16">AB1</th>
                        <th className="text-center py-2 px-2 text-xs font-bold text-gray-500 uppercase w-16">AB2</th>
                        <th className="text-center py-2 px-2 text-xs font-bold text-gray-500 uppercase w-16">REAV</th>
                        <th className="text-center py-2 px-2 text-xs font-bold text-gray-500 uppercase w-16">Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeStudents.map(student => (
                        <tr key={student.enrollmentId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-2">
                            <p className="font-semibold text-gray-800 text-sm">{student.studentName}</p>
                            <p className="text-xs text-gray-400">{student.enrollmentNumber}</p>
                          </td>
                          {['ab1', 'ab2', 'reav', 'finalGrade'].map(field => (
                            <td key={field} className="py-2 px-2 text-center">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={student[field] ?? ''}
                                onChange={e => handleGradeChange(student.enrollmentId, field, e.target.value)}
                                className="w-14 text-center border border-gray-200 rounded-lg p-1.5 text-sm font-bold focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white"
                                placeholder="—"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSaveGrades}
                      disabled={savingGrades}
                      className="bg-gradua-perfil text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-60"
                    >
                      {savingGrades ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {savingGrades ? 'Salvando...' : 'Salvar Notas'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'faltas' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-base font-black text-gradua-primary mb-4">Registro de Faltas</h3>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Selecione a Turma</label>
                <select
                  value={selectedFaltasClass?.classId || ''}
                  onChange={e => handleSelectFaltasClass(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-bold text-gray-700"
                >
                  <option value="">— Selecione —</option>
                  {faltasClasses.map(cls => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.subjectCode} - {cls.subjectName} ({cls.academicTerm})
                    </option>
                  ))}
                </select>
              </div>

              {selectedFaltasClass && (
                <>
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Registrar Nova Aula</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={newSessionDate}
                        onChange={e => setNewSessionDate(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-white font-medium"
                      />
                      <input
                        type="text"
                        value={newSessionDesc}
                        onChange={e => setNewSessionDesc(e.target.value)}
                        placeholder="Descrição (opcional)"
                        className="flex-1 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-white font-medium"
                      />
                      <button
                        onClick={handleCreateSession}
                        disabled={!newSessionDate}
                        className="bg-gradua-perfil text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center gap-1.5 hover:opacity-95 transition-opacity disabled:opacity-60"
                      >
                        <Calendar size={16} /> Registrar
                      </button>
                    </div>
                  </div>

                  {sessionsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 size={20} className="animate-spin text-gray-400" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm font-medium">
                      Nenhuma aula registrada.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Aulas Registradas</h4>
                      {sessions.map(s => (
                        <div key={s.sessionId}
                          className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                            selectedSession?.sessionId === s.sessionId
                              ? 'border-gradua-perfil bg-gradua-perfil/5'
                              : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}
                          onClick={() => handleOpenAttendance(s)}
                        >
                          <div>
                            <span className="text-sm font-bold text-gray-800">{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                            {s.description && (
                              <span className="text-xs text-gray-500 ml-2 font-medium">{s.description}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.sessionId); }}
                            className="text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSession && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-bold text-gray-700 mb-3">
                        Chamada - {new Date(selectedSession.date).toLocaleDateString('pt-BR')}
                      </h4>

                      {attendanceLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 size={20} className="animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1 max-h-64 overflow-y-auto">
                            {attendanceList.map(a => (
                              <div key={a.enrollmentId}
                                onClick={() => handleToggleAttendance(a.enrollmentId)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                              >
                                <span className="text-sm font-semibold text-gray-800">{a.studentName}</span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  a.present === false
                                    ? 'bg-red-100 text-red-600'
                                    : a.present === true
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {a.present === false ? <X size={16} /> : a.present === true ? <Check size={16} /> : '—'}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={handleSaveAttendance}
                              disabled={savingAttendance}
                              className="bg-gradua-perfil text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-60"
                            >
                              {savingAttendance ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                              {savingAttendance ? 'Salvando...' : 'Salvar Chamada'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'comunicados' && (
          <div className="space-y-5 animate-fade-in">
            <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gradua-primary mb-2">Novo Comunicado para Turma</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Título do Aviso</label>
                <input 
                  type="text"
                  required
                  value={newAnnounce.title}
                  onChange={e => setNewAnnounce({...newAnnounce, title: e.target.value})}
                  placeholder="Ex: Aula cancelada nesta sexta"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mensagem (opcional)</label>
                <textarea
                  value={newAnnounce.message}
                  onChange={e => setNewAnnounce({...newAnnounce, message: e.target.value})}
                  placeholder="Detalhes do comunicado..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Turma</label>
                  <select 
                    value={newAnnounce.classId}
                    onChange={e => setNewAnnounce({...newAnnounce, classId: e.target.value})}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-bold text-gray-700">
                    <option value="">— Selecione uma turma —</option>
                    {professorClasses.map(cls => (
                      <option key={cls.classId} value={cls.classId}>
                        {cls.subjectCode} - {cls.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    disabled={announceLoading || !newAnnounce.classId}
                    className="w-full bg-gradua-perfil text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md shadow-gradua-primary/10 disabled:opacity-60">
                    {announceLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {announceLoading ? 'Enviando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Histórico de Envios</h4>
              
              {announceHistoryLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                </div>
              ) : announceHistory.length === 0 ? (
                 <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-gray-500 text-sm font-medium">
                    Nenhum comunicado enviado.
                 </div>
              ) : (
                announceHistory.map(ann => (
                  <div key={ann.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-gradua-primary">{ann.title}</h5>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">
                        {formatDate(ann.publishDate)} • Turma: <span className="text-gradua-perfil font-semibold">{ann.targetClass}</span>
                      </p>
                    </div>

                    <div className="flex items-center flex-shrink-0 ml-2">
                      {confirmAnnounceId === ann.id ? (
                        <div className="flex items-center gap-1 bg-red-50 rounded-xl px-2 py-1 border border-red-200 animate-fade-in">
                          <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1 text-red-600 hover:bg-red-200 rounded-md text-xs font-bold">
                            Sim
                          </button>
                          <button onClick={() => setConfirmAnnounceId(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded-md text-xs font-bold">
                            Não
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmAnnounceId(ann.id)} className="text-gray-300 hover:bg-red-50 hover:text-red-500 p-2 rounded-full transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


      </main>

      {toast.show && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold z-[70] animate-fade-in text-white ${
          toast.type === 'error' ? 'bg-red-600' : 
          toast.type === 'info' ? 'bg-gray-800' : 'bg-green-600'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : 
           toast.type === 'info' ? <Info size={18} /> : <Check size={18} />}
          {toast.message}
        </div>
      )}

      <BottomNavBar activeTab="home" />
    </div>
  );
};

export default AdminScreen;
