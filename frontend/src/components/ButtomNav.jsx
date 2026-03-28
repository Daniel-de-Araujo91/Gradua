import { Home, Calendar, MessageCircle, User} from 'lucide-react';

const ButtomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home', label: 'INÍCIO', icon: Home },
        { id: 'agenda', label: 'AGENDA', icon: Calendar },
        { id: 'forum', label: 'FÓRUM', icon: MessageCircle },
        { id: 'profile', label: 'PERFIL', icon: User },
    ];


    return (
        <nav className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2'>
            <div className='flex justify-around items-center max-w-md mx-auto'>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab == tab.id;

                    return (
                        <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                        }`} 
                        >
                            <Icon size={24} strokeWidth={isActive ? 2 : 1.5}></Icon>
                            <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default ButtomNav;