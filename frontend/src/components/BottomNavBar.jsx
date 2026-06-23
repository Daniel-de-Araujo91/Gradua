import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageCircle, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNavBar = ({ activeTab: activeProp }) => {
    const navigate    = useNavigate();
    const { pathname } = useLocation();
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const isPrivileged = ['ADMIN', 'PROFESSOR'].includes(user?.role?.toUpperCase() || '');

    const TAB_ROUTES = {
      home:    isPrivileged ? '/admin' : '/',
      agenda:  '/agenda',
      forum:   '/forum',
      profile: '/perfil',
    };

    const activeTab = activeProp || Object.keys(TAB_ROUTES).find(
      (key) => pathname === TAB_ROUTES[key]
    ) || 'home';

    useEffect(() => {
        const handleScroll = (e) => {
            const currentScrollY = e.target.scrollTop;
            const scrollPos = currentScrollY !== undefined ? currentScrollY : window.scrollY;

            if (scrollPos === undefined || scrollPos === null) return;
            if (e.target.clientHeight && e.target.clientHeight < 300) return;
            if (Math.abs(scrollPos - lastScrollY.current) < 5) return;

            if (scrollPos > lastScrollY.current && scrollPos > 50) {
                setIsVisible(false);
            } else if (scrollPos < lastScrollY.current) {
                setIsVisible(true);
            }

            lastScrollY.current = scrollPos;
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const tabs = [
        { id: 'home',    label: isPrivileged ? 'PAINEL' : 'INÍCIO', icon: isPrivileged ? ShieldAlert : Home, activeColors: isPrivileged ? 'text-gradua-perfil bg-gradua-perfil/10' : 'text-gradua-inicio bg-gradua-inicio/10' },
        { id: 'agenda',  label: 'AGENDA', icon: Calendar,      activeColors: 'text-gradua-agenda bg-gradua-agenda/10' },
        { id: 'forum',   label: 'FÓRUM',  icon: MessageCircle, activeColors: 'text-gradua-forum bg-gradua-forum/10' },
        { id: 'profile', label: 'PERFIL', icon: User,          activeColors: 'text-gradua-perfil bg-gradua-perfil/10' },
    ];

    return (
        <nav
            className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 transition-transform duration-300 ease-in-out ${
                isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}
        >
            <div className='flex justify-around items-center max-w-md mx-auto'>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(TAB_ROUTES[tab.id])}
                            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                                isActive ? tab.activeColors : 'text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                            <span className={`text-[10px] sm:text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavBar;
