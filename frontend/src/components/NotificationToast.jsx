import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X, Calendar, Megaphone } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useWebNotifications } from '../hooks/useWebNotifications';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL = 20000; // 20 segundos
const TOAST_DURATION = 9000;  // 9 segundos visível

const ToastItem = ({ notif, onClose }) => {
    const isAviso = !notif.session; // sem sessão = aviso do fórum
    return (
        <div className="flex items-start gap-3 animate-slide-in">
            <div className={`p-2 rounded-full flex-shrink-0 mt-0.5 ${isAviso ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {isAviso ? <Megaphone size={14} /> : <Calendar size={14} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-black uppercase tracking-wider mb-0.5 ${isAviso ? 'text-amber-600' : 'text-blue-500'}`}>
                    {isAviso ? '📢 Aviso do fórum' : '📅 Sessão de monitoria'}
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                    {notif.message}
                </p>
                {notif.session?.date && (
                    <span className="text-[10px] font-bold text-blue-500 mt-1 block">
                        📅 {new Date(notif.session.date + 'T00:00').toLocaleDateString('pt-BR')}
                        {notif.session.startTime && ` • 🕐 ${notif.session.startTime}–${notif.session.endTime}`}
                    </span>
                )}
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0 mt-0.5 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
};

const NotificationToast = () => {
    const { user } = useAuth();
    const { pushNotify, loadSeenIds, saveSeenIds } = useWebNotifications();
    const [toasts, setToasts] = useState([]);
    const seenIdsRef = useRef(null);
    const isFirstFetch = useRef(true);

    const dismissToast = useCallback((notifId) => {
        setToasts(prev => prev.filter(t => t.notificationId !== notifId));
    }, []);

    const fetchAndNotify = useCallback(async () => {
        if (!user) return;

        if (seenIdsRef.current === null) {
            seenIdsRef.current = loadSeenIds();
        }

        try {
            const data = await notificationService.getAll();
            const list = data || [];

            const newOnes = list.filter(
                n => !n.isRead && !seenIdsRef.current.has(n.notificationId)
            );

            if (isFirstFetch.current) {
                list.forEach(n => seenIdsRef.current.add(n.notificationId));
                saveSeenIds(seenIdsRef.current);
                isFirstFetch.current = false;
                return;
            }

            if (newOnes.length > 0) {
                setToasts(prev => {
                    const slots = 3 - prev.length;
                    if (slots <= 0) return prev;
                    return [...newOnes.slice(0, slots).reverse(), ...prev].slice(0, 3);
                });

                newOnes.forEach(n => {
                    const isAviso = !n.session;
                    pushNotify({
                        title: isAviso ? '📢 Novo aviso publicado' : '📚 Nova sessão de monitoria',
                        body: n.message?.slice(0, 100) || 'Você tem uma nova notificação.',
                        tag: `notif-${n.notificationId}`,
                    });

                    setTimeout(() => dismissToast(n.notificationId), TOAST_DURATION);
                });

                newOnes.forEach(n => seenIdsRef.current.add(n.notificationId));
                saveSeenIds(seenIdsRef.current);
            }
        } catch {
            // Silencia erros de polling
        }
    }, [user, pushNotify, loadSeenIds, saveSeenIds, dismissToast]);

    useEffect(() => {
        if (!user) return;

        fetchAndNotify(); 
        const interval = setInterval(fetchAndNotify, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [user, fetchAndNotify]);

    if (toasts.length === 0) return null;

    return (
        <>
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-[340px] w-[calc(100vw-2rem)] pointer-events-none">
                {toasts.map(notif => (
                    <div
                        key={notif.notificationId}
                        className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-4 pointer-events-auto"
                    >
                        <ToastItem notif={notif} onClose={() => dismissToast(notif.notificationId)} />
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
            `}</style>
        </>
    );
};

export default NotificationToast;
