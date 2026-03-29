import { Calendar, Clock, MapPin } from 'lucide-react';

const TodayAgenda = () => {
    const classes = [
        {
            time: "15:20",
            endTime: "17:20",
            title: "Programação 3",
            location: "Bloco CC, Sala 102",
        },
        {
            time: "13:30",
            endTime: "15:10",
            title: "Teoria da Computação",
            location: "Laboratório 04",
        },
    ];

    return (
        <div className='px-4 mb-6'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Agenda de Hoje</h2>
                <button className='text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors'>
                    Ver calendário <Calendar size={16} />
                </button>
            </div>
            <div className='space-y-4'>
                {classes.map((classItem, index) => (
                    <div key={index} className='group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'>
                        <div className='flex items-start gap-3'>
                            <div className='flex flex-col items-center pt-1 min-w-[56px]'>
                                <span className='text-lg font-bold text-gray-900'>{classItem.time}</span>
                                <span className='text-xs text-gray-500'>-</span>
                                <span className='text-sm font-semibold text-gray-700'>{classItem.endTime}</span>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-lg font-bold text-gray-900 mb-1.5 leading-tight'>{classItem.title}</h3>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <MapPin size={16} className='text-gray-400 mt-0.5' />
                                    <span>{classItem.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayAgenda;