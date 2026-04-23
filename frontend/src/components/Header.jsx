import { useState } from 'react';
import { Bell, X, Info } from 'lucide-react';

const Header = ({ userName = "Tester", onNavigate }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "Nota Lançada", message: "Sua nota de PROG 3 já está no sistema.", time: "2h atrás", unread: true },
        { id: 2, title: "Aviso do Professor", message: "A aula de amanhã será via Google Meet.", time: "5h atrás", unread: true },
        { id: 3, title: "Fórum", message: "Nova resposta no tópico de Teoria da Computação.", time: "1 dia atrás", unread: false },
    ]);

    const toggleNotification = (id) => {
        setNotifications(currentNotifications => 
            currentNotifications.map(notif => 
                notif.id === id ? { ...notif, unread: !notif.unread } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(currentNotifications => 
            currentNotifications.map(notif => ({ ...notif, unread: false }))
        );
    };

    return (
        <header className='bg-white px-4 pt-4 pb-2 relative'>
            <div className='flex justify-between items-start mb-4'>
                
                <div className='flex items-center gap-3'>
                    <img 
                        src='/images/perfil.png' 
                        alt='Perfil' 
                        className='w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => onNavigate('profile')} 
                    />
                    <div>
                        <h1 className='text-2xl font-bold text-blue-900'>
                            Olá, <span className='text-blue-900'>{userName}</span>
                        </h1>
                        <div className='flex items-center gap-2 mt-1'>
                            <span className='px-2 py-0.5 bg-green-200 text-green-900 text-xs font-semibold rounded-full'>
                                ATIVO
                            </span>
                            <span className='text-gray-500 text-xs font-semibold'>
                                xxxxxxxxx
                            </span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowNotifications(true)}
                    className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
                    <Bell size={24} className='text-gray-600' />
                    {notifications.some(n => n.unread) && (
                        <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white' />
                    )}
                </button>
            </div>

            {showNotifications && (
                <div 
                    className='fixed inset-0 bg-black/20 z-[60] flex items-start justify-end p-4 sm:p-6' 
                    onClick={() => setShowNotifications(false)}>
                    <div 
                        className='bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl mt-14 animate-fade-in'
                        onClick={(e) => e.stopPropagation()}>
                        
                        <div className='sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center z-10 rounded-t-2xl'>
                            <h2 className='text-lg font-bold text-gray-900'>Notificações</h2>
                            <button onClick={() => setShowNotifications(false)} className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
                                <X size={20} className='text-gray-500' />
                            </button>
                        </div>

                        <div className='p-2 overflow-y-auto'>
                            {notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => toggleNotification(notif.id)} 
                                    className={`p-3 mb-1 rounded-xl flex gap-3 items-start transition-colors hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50/40' : 'bg-white'}`}>
                                    <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Info size={16} />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className={`text-sm ${notif.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {notif.title}
                                        </h3>
                                        <p className='text-xs text-gray-600 mt-0.5 leading-relaxed'>{notif.message}</p>
                                        <span className='text-[10px] font-semibold text-gray-400 mt-1 block'>{notif.time}</span>
                                    </div>
                                    {notif.unread && (
                                        <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                                    )}
                                </div>
                            ))}
                        </div>

                        {notifications.some(n => n.unread) && (
                            <div className='border-t border-gray-100 p-3'>
                                <button 
                                    onClick={markAllAsRead}
                                    className='w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 p-2 transition-colors rounded-lg hover:bg-blue-50'>
                                    Marcar todas como lidas
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <style jsx>{`
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