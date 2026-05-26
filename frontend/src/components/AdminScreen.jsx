import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import { Tooltip } from 'flowbite-react';
import { 
  ShieldAlert, Megaphone, MessageSquare, CalendarDays, 
  Trash2, Check, AlertTriangle, Send, MapPin, Info, X
} from 'lucide-react';

const INITIAL_REPORTS = [
  { id: 1, author: "Lucas Aluno", title: "Links suspeitos no material", reports: 3, content: "Galera, cliquem nesse link aqui para ganhar créditos complementares grátis..." },
  { id: 2, author: "Mariana Costa", title: "Discussão fora de contexto", reports: 1, content: "Alguém vendendo ingresso para a festa do fim de semana?" }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Manutenção do Bloco de Laboratórios", date: "Hoje, 09:30", target: "Todos os Cursos" },
  { id: 2, title: "Prazo final para renovação de matrícula", date: "Ontem", target: "Ciência da Computação" }
];

const AdminScreen = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('forum');

  const [reportedPosts, setReportedPosts] = useState(() => {
    const saved = localStorage.getItem('gradua_admin_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('gradua_admin_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [confirmForumId, setConfirmForumId] = useState(null);
  const [confirmAnnounceId, setConfirmAnnounceId] = useState(null);

  useEffect(() => {
    localStorage.setItem('gradua_admin_reports', JSON.stringify(reportedPosts));
  }, [reportedPosts]);

  useEffect(() => {
    localStorage.setItem('gradua_admin_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeout = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const [newAnnounce, setNewAnnounce] = useState({ title: '', message: '', target: 'Todos os Cursos' });
  const [classAlert, setClassAlert] = useState({ classTitle: 'PROG 3', reason: 'Falta do Professor', actionType: 'canceled', newRoom: '' });

  const handleDismissReport = (id) => {
    setReportedPosts(prev => prev.filter(post => post.id !== id));
    showToast("Denúncia ignorada e postagem mantida.", "info");
  };

  const handleDeletePost = (id) => {
    setReportedPosts(prev => prev.filter(post => post.id !== id));
    setConfirmForumId(null);
    showToast("Postagem removida do fórum com sucesso!", "success");
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnounce.title.trim()) return;
    
    setAnnouncements(prev => [
      { id: Date.now(), title: newAnnounce.title, date: "Agora mesmo", target: newAnnounce.target },
      ...prev
    ]);
    showToast("Comunicado enviado a todos os alunos!", "success");
    setNewAnnounce({ title: '', message: '', target: 'Todos os Cursos' });
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    setConfirmAnnounceId(null);
    showToast("Comunicado apagado do histórico.", "info");
  };

  const handleSendClassAlert = (e) => {
    e.preventDefault();
    if (classAlert.actionType === 'canceled') {
        showToast(`Aula de ${classAlert.classTitle} cancelada no sistema!`, "error");
    } else {
        showToast(`Mudança de sala de ${classAlert.classTitle} notificada!`, "success");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col relative">
      <Header activeTab="profile" />

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
          <button 
            onClick={() => setActiveSubTab('forum')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'forum' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <MessageSquare size={16} /> Fórum
          </button>
          <button 
            onClick={() => setActiveSubTab('comunicados')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'comunicados' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <Megaphone size={16} /> Comunicados
          </button>
          <button 
            onClick={() => setActiveSubTab('aulas')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'aulas' ? 'bg-white text-gradua-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
            <CalendarDays size={16} /> Aulas
          </button>
        </div>

        {activeSubTab === 'forum' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">Denúncias Recentes</h2>
            
            {reportedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-gray-500 text-sm font-medium">
                Nenhuma denúncia pendente de revisão.
              </div>
            ) : (
              reportedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 flex items-center gap-1 w-fit mb-1">
                        <AlertTriangle size={12} /> {post.reports} {post.reports === 1 ? 'denúncia' : 'denúncias'}
                      </span>
                      <h3 className="text-base font-bold text-gradua-primary">{post.title}</h3>
                      <p className="text-xs font-semibold text-gray-400 uppercase mt-0.5">Por: {post.author}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmForumId === post.id ? (
                        <div className="flex items-center gap-1.5 bg-red-50 rounded-xl px-2 py-1 border border-red-200 animate-fade-in">
                          <span className="text-[10px] font-bold text-red-600 px-1">Apagar?</span>
                          <button onClick={() => handleDeletePost(post.id)} className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setConfirmForumId(null)} className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Tooltip content="Manter postagem" placement="bottom">
                            <button 
                              onClick={() => handleDismissReport(post.id)}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-100 transition-colors rounded-xl">
                              <Check size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Apagar postagem" placement="bottom">
                            <button 
                              onClick={() => setConfirmForumId(post.id)}
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
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'comunicados' && (
          <div className="space-y-5 animate-fade-in">
            <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gradua-primary mb-2">Novo Comunicado Geral</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Título do Aviso</label>
                <input 
                  type="text"
                  required
                  value={newAnnounce.title}
                  onChange={e => setNewAnnounce({...newAnnounce, title: e.target.value})}
                  placeholder="Ex: Prorrogação de prazos de TCC"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Destinatários</label>
                  <select 
                    value={newAnnounce.target}
                    onChange={e => setNewAnnounce({...newAnnounce, target: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-bold text-gray-700">
                    <option>Todos os Cursos</option>
                    <option>Ciência da Computação</option>
                    <option>Engenharia Química</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full bg-gradua-perfil text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md shadow-gradua-primary/10">
                    <Send size={14} /> Publicar
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Histórico de Envios</h4>
              
              {announcements.length === 0 ? (
                 <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-gray-500 text-sm font-medium">
                    Nenhum comunicado enviado.
                 </div>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
                    <div>
                      <h5 className="text-sm font-bold text-gradua-primary">{ann.title}</h5>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">{ann.date} • Destino: <span className="text-gradua-perfil font-semibold">{ann.target}</span></p>
                    </div>

                    <div className="flex items-center">
                      {confirmAnnounceId === ann.id ? (
                        <div className="flex items-center gap-1 bg-red-50 rounded-xl px-2 py-1 border border-red-200 animate-fade-in">
                          <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1 text-red-600 hover:bg-red-200 rounded-md">
                            Sim
                          </button>
                          <button onClick={() => setConfirmAnnounceId(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded-md">
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

        {activeSubTab === 'aulas' && (
          <form onSubmit={handleSendClassAlert} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-black text-gradua-primary">Gerenciamento de Grade Hoje</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Altere status de salas ou avise imprevistos em tempo real.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Disciplina</label>
              <select 
                value={classAlert.classTitle}
                onChange={e => setClassAlert({...classAlert, classTitle: e.target.value})}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-bold text-gray-700">
                <option>PROG 3</option>
                <option>Teoria da Computação</option>
                <option>Sistemas Operacionais</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Ação</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClassAlert({...classAlert, actionType: 'canceled'})}
                  className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${classAlert.actionType === 'canceled' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Cancelar Aula
                </button>
                <button
                  type="button"
                  onClick={() => setClassAlert({...classAlert, actionType: 'room_change'})}
                  className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${classAlert.actionType === 'room_change' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Mudar Sala
                </button>
              </div>
            </div>

            {classAlert.actionType === 'room_change' ? (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nova Localização</label>
                <div className="relative flex items-center">
                  <MapPin size={16} className="absolute left-3 text-gray-400" />
                  <input 
                    type="text"
                    required
                    value={classAlert.newRoom}
                    onChange={e => setClassAlert({...classAlert, newRoom: e.target.value})}
                    placeholder="Ex: Sala 102"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Motivo</label>
                <input 
                  type="text"
                  value={classAlert.reason}
                  onChange={e => setClassAlert({...classAlert, reason: e.target.value})}
                  placeholder="Ex: Imprevisto de saúde"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 font-medium"
                />
              </div>
            )}

            <button 
              type="submit"
              className={`w-full font-bold py-3.5 rounded-xl text-base transition-opacity hover:opacity-95 text-white shadow-md mt-4 ${classAlert.actionType === 'canceled' ? 'bg-red-600 shadow-red-600/10' : 'bg-amber-600 shadow-amber-600/10'}`}>
              Disparar Alerta Acadêmico
            </button>
          </form>
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

      <BottomNavBar activeTab="profile" />
    </div>
  );
};

export default AdminScreen;