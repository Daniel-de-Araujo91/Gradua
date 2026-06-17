import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Info, Calendar, Loader2, BellRing } from 'lucide-react';
import { Tooltip } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { useWebNotifications } from '../hooks/useWebNotifications';

const Header = ({ activeTab = 'home' }) => {
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate();
    const userName = user ? user.firstName : 'Usuário';
    // Matrícula vem do profile enriquecido (buscado após login no AuthContext)
    const matricula = profile?.enrollmentNumber || null;

    const [showNotifications, setShowNotifications] = useState(false);
    const { permission, requestPermission } = useWebNotifications();
    const [showPermBanner, setShowPermBanner] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        setLoadingNotifs(true);
        try {
            const data = await notificationService.getAll();
            setNotifications(data || []);
            setUnreadCount((data || []).filter(n => !n.isRead).length);
        } catch {
            // Silencia erros de notificação para não prejudicar a experiência
        } finally {
            setLoadingNotifs(false);
        }
    }, []);

    // Busca notificações ao abrir o painel
    useEffect(() => {
        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications, fetchNotifications]);

    // Badge: busca contagem de não lidas a cada 30s
    useEffect(() => {
        if (!user) return;
        const fetchCount = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(typeof count === 'number' ? count : 0);
            } catch { /* silencia */ }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Banner de permissão push após 3s
    useEffect(() => {
        if (permission === 'default') {
            const t = setTimeout(() => setShowPermBanner(true), 3000);
            return () => clearTimeout(t);
        }
        setShowPermBanner(false);
    }, [permission]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            // Persiste no back-end — assim o estado não volta no reload
            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            // Silencia erro de marcação
        }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        // Persiste cada uma no back-end em paralelo
        await Promise.allSettled(unread.map(n => notificationService.markAsRead(n.notificationId)));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const themeColors = {
        home: { text: 'text-gradua-inicio', bg: 'bg-gradua-inicio/20' },
        agenda: { text: 'text-gradua-agenda', bg: 'bg-gradua-agenda/20' },
        forum: { text: 'text-gradua-forum', bg: 'bg-gradua-forum/20' },
        profile: { text: 'text-gradua-perfil', bg: 'bg-gradua-perfil/20' }
    };

    const currentTheme = themeColors[activeTab] || themeColors.home;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 60000);
        if (diff < 60) return `${diff}min atrás`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
        return `${Math.floor(diff / 1440)} dia(s) atrás`;
    };

    return (
        <header className='bg-white px-4 py-2 md:py-4 relative'>
            {/* Banner discreto de solicitação de permissão push */}
            {showPermBanner && permission === 'default' && (
                <div className='flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3 gap-2 animate-fade-in'>
                    <div className='flex items-center gap-2'>
                        <BellRing size={16} className='text-blue-500 flex-shrink-0' />
                        <p className='text-xs font-semibold text-blue-700'>Ativar notificações para receber avisos de monitoria?</p>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <button
                            onClick={() => { requestPermission(); setShowPermBanner(false); }}
                            className='px-2.5 py-1 bg-blue-500 text-white text-[11px] font-bold rounded-lg hover:bg-blue-600 transition-colors'
                        >Ativar</button>
                        <button
                            onClick={() => setShowPermBanner(false)}
                            className='p-1 text-gray-400 hover:text-gray-600'
                        ><X size={14} /></button>
                    </div>
                </div>
            )}
            <div className='flex justify-between items-start mb-4'>
                
                <div className='flex items-center gap-3'>
                    <img 
                        src='/images/perfil.png' 
                        alt='Perfil' 
                        className='w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => navigate('/perfil')}
                    />
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>
                            Olá, <span className={currentTheme.text}>{userName}</span>
                        </h1>
                        <div className='flex items-center gap-2 mt-1'>
                            <Tooltip content="Situação regularizada" placement='bottom'>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full cursor-help ${currentTheme.bg} ${currentTheme.text}`}>
                                    ATIVO
                                </span>
                            </Tooltip>
                            <Tooltip content="Sua matrícula do SIGAA" placement='bottom'>
                                <span className='text-gray-500 text-xs font-semibold cursor-help'>
                                    {/* Matrícula vinda do profile — '—' enquanto carrega, valor real quando disponível */}
                                    {matricula ?? '—'}
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Botão de notificações com badge de contagem não lida */}
                <button 
                    onClick={() => setShowNotifications(true)}
                    className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
                    <Bell size={24} className='text-gray-600' />
                    {unreadCount > 0 && (
                        <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center'>
                            <span className='text-[9px] font-black text-white leading-none'>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </button>
            </div>

            {/* Painel de notificações */}
            {showNotifications && (
                <div 
                    className='fixed inset-0 bg-black/20 z-[60] flex items-start justify-end p-4 sm:p-6' 
                    onClick={() => setShowNotifications(false)}>
                    <div 
                        className='bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl mt-14 animate-fade-in'
                        onClick={(e) => e.stopPropagation()}>
                        
                        <div className='sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center z-10 rounded-t-2xl'>
                            <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                Notificações {unreadCount > 0 && <span className='text-sm font-normal text-gray-400'>({unreadCount} nova{unreadCount !== 1 ? 's' : ''})</span>}
                            </h2>
                            <button onClick={() => setShowNotifications(false)} className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
                                <X size={20} className='text-gray-500' />
                            </button>
                        </div>

                        <div className='p-2 overflow-y-auto flex-1'>
                            {loadingNotifs ? (
                                <div className='flex items-center justify-center py-8 gap-2 text-gray-400'>
                                    <Loader2 size={20} className='animate-spin' />
                                    <span className='text-sm'>Carregando...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className='flex flex-col items-center justify-center py-10 text-center gap-2'>
                                    <Bell size={32} className='text-gray-200' />
                                    <p className='text-sm text-gray-400 font-medium'>Nenhuma notificação</p>
                                    <p className='text-xs text-gray-300'>Sessões de monitoria aparecerão aqui</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div 
                                        key={notif.notificationId} 
                                        onClick={() => !notif.isRead && handleMarkAsRead(notif.notificationId)}
                                        className={`p-3 mb-1 rounded-xl flex gap-3 items-start transition-colors cursor-pointer ${
                                            !notif.isRead ? 'bg-blue-50/60 hover:bg-blue-50' : 'bg-white hover:bg-gray-50'
                                        }`}>
                                        <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                                            !notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <Calendar size={16} />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className={`text-sm leading-snug ${
                                                !notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                            }`}>
                                                Sessão de Monitoria
                                                {notif.session?.subjectName && (
                                                    <span className='font-normal text-gray-500'> — {notif.session.subjectName}</span>
                                                )}
                                            </h3>
                                            <p className='text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2'>{notif.message}</p>
                                            {notif.session && (
                                                <div className='flex flex-wrap gap-x-3 mt-1.5'>
                                                    {notif.session.date && (
                                                        <span className='text-[10px] font-semibold text-blue-500'>
                                                            📅 {new Date(notif.session.date + 'T00:00').toLocaleDateString('pt-BR')}
                                                        </span>
                                                    )}
                                                    {notif.session.startTime && (
                                                        <span className='text-[10px] font-semibold text-gray-500'>
                                                            🕐 {notif.session.startTime} – {notif.session.endTime}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <span className='text-[10px] font-semibold text-gray-400 mt-1 block'>
                                                {formatDate(notif.createdAt)}
                                            </span>
                                        </div>
                                        {!notif.isRead && (
                                            <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.some(n => !n.isRead) && (
                            <div className='border-t border-gray-100 p-3'>
                                <button 
                                    onClick={handleMarkAllRead}
                                    className={`w-full text-center text-sm font-semibold p-2 transition-colors rounded-lg hover:bg-gray-50 ${currentTheme.text} opacity-90 hover:opacity-100`}>
                                    Marcar todas como lidas
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default Header;
