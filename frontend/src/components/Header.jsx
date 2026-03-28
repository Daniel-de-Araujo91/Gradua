import { Bell, ChevronRight } from 'lucide-react';

const Header = ({ userName = "Guilherme" }) => {
    return (
        <header className='bg-white px-4 pt-4 pb-2'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h1  className='text-2xl font-bold text-gray-900'>
                        Olá, <span className='text-blue-600'>{userName}</span>
                    </h1 >
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full'>
                            ATIVO
                        </span>
                        <span className='text-gray-500 text-sm'>
                            CC • 2024.1
                        </span>
                    </div>
                </div>

                <button className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
                    <Bell size={24} className='text-gray-600'></Bell>
                    <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'>
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;