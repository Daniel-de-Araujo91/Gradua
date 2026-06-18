import { useState, useCallback, useEffect } from 'react';
import { Bell, MapPin, User, BellPlus, X, Trash2, Video, CalendarPlus, Loader2, CheckCircle, Pencil } from 'lucide-react';
import BottomNavBar from '../components/BottomNavBar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { monitorService } from '../services/monitorService';
import { useWebNotifications } from '../hooks/useWebNotifications';

/* ─────────────────────────────────────────
   Cronograma Oficial 2026.1 (spec Seção 3)
   Chave: abreviação do dia (DOM/SEG/TER/QUA/QUI/SEX/SAB)
───────────────────────────────────────── */
const SCHEDULE_2026_1 = {
    SEG: [
        { id: 's1', startTime: '13:30', endTime: '15:10', title: 'Teoria da Computação', abbr: 'TEORIA DA COMP', statusType: 'confirmed', status: 'T1/T2' },
        { id: 's2', startTime: '15:20', endTime: '17:00', title: 'Atividade Curricular de Extensão 1', abbr: 'ACE 1', statusType: 'lab', status: 'T3/T4' },
        { id: 's3', startTime: '17:10', endTime: '18:50', title: 'Projeto e Análise de Algoritmos', abbr: 'PAA', statusType: 'confirmed', status: 'T5/T6' },
    ],
    TER: [
        { id: 's4', startTime: '13:30', endTime: '15:10', title: 'Programação 2', abbr: 'PROG 2', statusType: 'confirmed', status: 'T1/T2' },
        { id: 's5', startTime: '15:20', endTime: '17:00', title: 'Programação 3', abbr: 'PROG 3', statusType: 'confirmed', status: 'T3/T4' },
    ],
    QUA: [
        { id: 's6', startTime: '13:30', endTime: '15:10', title: 'Teoria da Computação', abbr: 'TEORIA DA COMP', statusType: 'confirmed', status: 'T1/T2' },
        { id: 's7', startTime: '15:20', endTime: '17:00', title: 'Programação 3', abbr: 'PROG 3', statusType: 'confirmed', status: 'T3/T4' },
    ],
    QUI: [
        { id: 's8', startTime: '13:30', endTime: '15:10', title: 'Programação 2', abbr: 'PROG 2', statusType: 'confirmed', status: 'T1/T2' },
        { id: 's9', startTime: '17:10', endTime: '18:50', title: 'Projeto e Análise de Algoritmos', abbr: 'PAA', statusType: 'confirmed', status: 'T5/T6' },
    ],
    SEX: [],  // Horário Livre / Reservado para Atividades de Monitoria
    DOM: [],
    SAB: [],
};

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const isMonitor = (user) => user?.role === 'MONITOR';

const todayLabel = () => {
    const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    return labels[new Date().getDay()];
};

const getCurrentWeekDays = () => {
    const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    return labels.map((label, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return { label, day: d.getDate(), month: d.getMonth() + 1, fullDate: d };
    });
};

const TODAY_LABEL = todayLabel();

const AgendaPage = () => {
    const { user } = useAuth();
    const { pushNotify } = useWebNotifications();
    const [selectedDay, setSelectedDay] = useState(todayLabel());

    const [showAddModal, setShowAddModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [editReminderId, setEditReminderId] = useState(null);

    const [showSessionModal, setShowSessionModal] = useState(false);
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionStart, setSessionStart] = useState('');
    const [sessionEnd, setSessionEnd] = useState('');
    const [sessionLocation, setSessionLocation] = useState('');
    const [sessionLink, setSessionLink] = useState('');
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionSuccess, setSessionSuccess] = useState(false);

    const [reminders, setReminders] = useState(() => {
        const saved = localStorage.getItem('gradua_agenda_reminders');
        return saved ? JSON.parse(saved) : [];
    });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        localStorage.setItem('gradua_agenda_reminders', JSON.stringify(reminders));
    }, [reminders]);

    const [weekDays] = useState(() => getCurrentWeekDays());

    const dayNames = {
        DOM: 'Domingo', SEG: 'Segunda-feira', TER: 'Terça-feira', QUA: 'Quarta-feira',
        QUI: 'Quinta-feira', SEX: 'Sexta-feira', SAB: 'Sábado'
    };

    const fixedClasses = SCHEDULE_2026_1[selectedDay] || [];
    const dayReminders = reminders.filter(r => r.day === selectedDay);
    const allItems = [...fixedClasses, ...dayReminders].sort((a, b) => a.startTime.localeCompare(b.startTime));

    const removeReminder = (idToRemove) => setReminders(r => r.filter(item => item.id !== idToRemove));

    const handleAddReminder = (e) => {
        e.preventDefault();
        if (!newTitle || !newTime) return;

        if (editReminderId) {
            setReminders(prev => prev.map(r => r.id === editReminderId ? {
                ...r,
                startTime: newTime,
                title: newTitle,
                location: newLocation || 'A definir',
            } : r));
        } else {
            setReminders(prev => [...prev, {
                id: `rem-${Date.now()}`,
                startTime: newTime,
                endTime: '',
                title: newTitle,
                status: 'LEMBRETE',
                statusType: 'normal',
                location: newLocation || 'A definir',
                isReminder: true,
                day: selectedDay,
            }]);
        }
        setShowAddModal(false);
        setEditReminderId(null);
        setNewTitle(''); setNewTime(''); setNewLocation('');
    };

    const openEditModal = (reminder) => {
        setEditReminderId(reminder.id);
        setNewTitle(reminder.title);
        setNewTime(reminder.startTime);
        setNewLocation(reminder.location !== 'A definir' ? reminder.location : '');
        setShowAddModal(true);
    };

    const handleCreateSession = useCallback(async (e) => {
        e.preventDefault();
        if (!sessionTopic || !sessionDate || !sessionStart || !sessionEnd) return;
        setSessionLoading(true);
        try {
            await monitorService.createSession({
                topic: sessionTopic,
                date: sessionDate,
                startTime: sessionStart,
                endTime: sessionEnd,
                location: sessionLocation || null,
                meetingLink: sessionLink || null,
                classSectionId: null, 
            });
            setSessionSuccess(true);
            pushNotify({
                title: '✅ Sessão agendada com sucesso!',
                body: `"${sessionTopic}" em ${sessionDate} das ${sessionStart} às ${sessionEnd}. Alunos foram notificados.`,
                tag: 'session-created',
            });
            setTimeout(() => {
                setSessionSuccess(false);
                setShowSessionModal(false);
                setSessionTopic(''); setSessionDate(''); setSessionStart('');
                setSessionEnd(''); setSessionLocation(''); setSessionLink('');
            }, 2000);
        } catch (err) {
            alert(err.message || 'Erro ao agendar sessão. Tente novamente.');
        } finally {
            setSessionLoading(false);
        }
    }, [sessionTopic, sessionDate, sessionStart, sessionEnd, sessionLocation, sessionLink]);

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50">
            <Header activeTab='agenda' />

            {/* Seletor de dias da semana */}
            <div className="px-4 py-4 bg-gray-50">
                <div className="flex justify-between gap-1 w-full">
                    {weekDays.map((day) => {
                        const isSelected = selectedDay === day.label;
                        const isToday = day.label === TODAY_LABEL;
                        const hasFreeSlot = SCHEDULE_2026_1[day.label]?.length === 0;
                        return (
                            <button
                                key={day.label}
                                onClick={() => setSelectedDay(day.label)}
                                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
                                    isSelected
                                        ? 'bg-gradua-agenda text-white shadow-md'
                                        : isToday
                                            ? 'bg-gradua-agenda/15 text-gradua-agenda border-2 border-gradua-agenda shadow-sm'
                                            : 'bg-white text-gray-500 shadow-sm hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">{day.label}</span>
                                <span className="text-xl sm:text-2xl font-black mt-0.5 leading-none">{day.day}</span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />}
                                {isToday && !isSelected && (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gradua-agenda mt-0.5">HOJE</span>
                                )}
                                {hasFreeSlot && !isSelected && !isToday && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-5 pt-3 pb-4 flex justify-between items-center bg-gray-50">
                <div>
                    <h2 className="text-2xl font-bold text-gradua-agenda">{dayNames[selectedDay]}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradua-agenda text-white">
                            {fixedClasses.length > 0
                                ? `${fixedClasses.length} ${fixedClasses.length === 1 ? 'AULA' : 'AULAS'} HOJE`
                                : 'DIA LIVRE'}
                        </span>
                    </div>
                </div>

                {/* Botão de agendar sessão — visível apenas para perfil Monitor em dias livres */}
                {isMonitor(user) && SCHEDULE_2026_1[selectedDay]?.length === 0 && (
                    <button
                        onClick={() => setShowSessionModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-gradua-agenda text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                    >
                        <CalendarPlus size={14} />
                        Agendar Monitoria
                    </button>
                )}
            </div>

            {/* Lista de aulas + lembretes */}
            <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-28" style={{ maxHeight: 'calc(100vh - 280px)' }}>

                {allItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CalendarPlus size={28} className="text-green-400" />
                        </div>
                        <p className="text-base font-bold text-gray-700">Dia Livre</p>
                        <p className="text-sm text-gray-400 max-w-[220px]">
                            {isMonitor(user)
                                ? 'Nenhuma aula oficial. Use os slots livres para agendar sessões de monitoria.'
                                : 'Nenhuma aula oficial. Adicione lembretes pessoais se precisar.'}
                        </p>
                    </div>
                )}

                {allItems.map((item) => (
                    <div key={item.id} className="rounded-2xl overflow-hidden flex-shrink-0 relative group bg-white shadow-[0_2px_8px_rgba(30,58,95,0.08)]">
                        {/* Botão de remover (apenas lembretes) */}
                        {item.isReminder && (
                            <div className="absolute top-3 right-3">
                                {confirmDeleteId === item.id ? (
                                    <div className="flex items-center gap-2 bg-red-50 rounded-full px-2 py-1 animate-fade-in">
                                        <span className="text-[10px] font-bold text-red-600">Excluir?</span>
                                        <button onClick={() => removeReminder(item.id)} className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full">
                                            <Trash2 size={12} />
                                        </button>
                                        <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-gray-500 hover:bg-gray-200 bg-gray-100 rounded-full">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 text-gray-300 active:text-red-500 active:bg-red-50 rounded-full transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex">
                            {/* Coluna de horário */}
                            <div className="flex flex-col items-center justify-center px-4 py-5 min-w-[80px] border-r border-slate-100">
                                <span className="text-base font-black leading-none text-gradua-agenda">
                                    {item.startTime}
                                </span>
                                {item.endTime && (
                                    <span className="text-[10px] font-semibold mt-1 text-gray-400">
                                        até {item.endTime}
                                    </span>
                                )}
                            </div>

                            {/* Conteúdo da aula */}
                            <div className="flex-1 px-4 py-4 break-words pr-16">
                                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                    <h3 className="text-base font-black text-gradua-agenda">
                                        {item.abbr || item.title}
                                    </h3>
                                    {item.status && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                                            item.statusType === 'confirmed' ? 'bg-gradua-inicio/15 text-gradua-inicio' :
                                                item.statusType === 'lab' ? 'bg-gradua-agenda/15 text-gradua-agenda' :
                                                    'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                    )}
                                </div>

                                {item.abbr && item.title !== item.abbr && (
                                    <p className="text-xs text-gray-500 mb-1 font-medium">{item.title}</p>
                                )}

                                {item.location && (
                                    <div className="flex items-start gap-1.5 mb-1">
                                        <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-xs break-words flex-1 text-gray-600">{item.location}</span>
                                    </div>
                                )}

                                {item.professor && (
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-xs break-words text-gray-500">{item.professor}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Botão de adicionar lembrete pessoal */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-sm font-bold transition-opacity hover:opacity-90 shadow-sm text-white bg-gradua-agenda rounded-xl">
                    <BellPlus size={16} />
                    Adicionar Lembrete
                </button>

                {/* Botão de agendar sessão de monitoria (aparece no meio do dia também) */}
                {isMonitor(user) && (
                    <button
                        onClick={() => setShowSessionModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold transition-opacity hover:opacity-90 shadow-sm text-gradua-agenda bg-gradua-agenda/10 rounded-xl border-2 border-dashed border-gradua-agenda/30">
                        <CalendarPlus size={16} />
                        Agendar Sessão de Monitoria
                    </button>
                )}
            </div>

            <BottomNavBar activeTab="agenda" />

            {/* Modal: adicionar lembrete */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-fade-in"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-900">{editReminderId ? 'Editar Lembrete' : 'Novo Lembrete'}</h3>
                            <button type="button" onClick={() => { setShowAddModal(false); setEditReminderId(null); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddReminder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                                <input
                                    type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Ex: Entrega de Trabalho"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda focus:border-gradua-agenda outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Horário</label>
                                    <input
                                        type="time" required value={newTime} onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Local (Opcional)</label>
                                    <input
                                        type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                                        placeholder="Ex: Lab 02"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradua-agenda hover:opacity-90 text-white font-bold py-3 rounded-xl mt-6 transition-opacity">
                                Salvar Lembrete
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: agendar sessão de monitoria (apenas Monitor — spec 4.2) */}
            {showSessionModal && isMonitor(user) && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={() => setShowSessionModal(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Agendar Monitoria</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Notificará todos os alunos da turma</p>
                            </div>
                            <button onClick={() => setShowSessionModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        {sessionSuccess ? (
                            <div className="flex flex-col items-center gap-3 py-8">
                                <CheckCircle size={48} className="text-green-500" />
                                <p className="font-bold text-gray-800">Sessão agendada!</p>
                                <p className="text-sm text-gray-500 text-center">Alunos da turma foram notificados automaticamente.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateSession} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tema da Sessão *</label>
                                    <input
                                        type="text" required value={sessionTopic} onChange={(e) => setSessionTopic(e.target.value)}
                                        placeholder="Ex: Revisão de Recursão"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Data *</label>
                                    <input
                                        type="date" required value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Início *</label>
                                        <input
                                            type="time" required value={sessionStart} onChange={(e) => setSessionStart(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Término *</label>
                                        <input
                                            type="time" required value={sessionEnd} onChange={(e) => setSessionEnd(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        <MapPin size={13} className="inline mr-1" />
                                        Local (sala física)
                                    </label>
                                    <input
                                        type="text" value={sessionLocation} onChange={(e) => setSessionLocation(e.target.value)}
                                        placeholder="Ex: CCEN, Lab 02"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        <Video size={13} className="inline mr-1" />
                                        Link de videoconferência
                                    </label>
                                    <input
                                        type="url" value={sessionLink} onChange={(e) => setSessionLink(e.target.value)}
                                        placeholder="https://meet.google.com/..."
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-gradua-agenda outline-none"
                                    />
                                </div>

                                <p className="text-[11px] text-gray-400 bg-blue-50 p-3 rounded-lg">
                                    💡 Ao confirmar, todos os alunos matriculados na turma receberão uma notificação automática.
                                </p>

                                <button
                                    type="submit"
                                    disabled={sessionLoading}
                                    className="w-full bg-gradua-agenda hover:opacity-90 disabled:opacity-60 text-white font-bold py-3 rounded-xl mt-2 transition-opacity flex items-center justify-center gap-2">
                                    {sessionLoading ? <><Loader2 size={16} className="animate-spin" /> Agendando...</> : 'Confirmar Sessão'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AgendaPage;