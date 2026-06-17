import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

const TodayAgenda = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

    // null = ainda carregando, [] = sem aulas, [...] = tem aulas
    // Separar "carregando" de "lista vazia" evita o pulo de layout:
    // enquanto null mostramos um skeleton com altura fixa em vez de
    // renderizar o bloco vazio que empurra o conteúdo abaixo.
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        apiClient.get('/dashboard/agenda/today')
            .then(data => {
                if (mounted) {
                    setAgenda(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (mounted) {
                    // Em caso de erro mostra lista vazia sem travar a tela
                    setAgenda([]);
                    setLoading(false);
                }
            });
        return () => { mounted = false; };
    }, []);

    // Normaliza resposta da API para o formato { time, endTime, title, location }
    const displayClasses = (agenda || []).map(s => ({
        time: s.startTime,
        endTime: s.endTime,
        title: s.topic || s.title || s.subjectName || 'Sessão',
        location: s.location || s.meetingLink || '-',
    }));

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const weekDays = ["D","S","T","Q","Q","S","S"];

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysArray = Array.from({ length: firstDay }).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else { setCurrentMonth(currentMonth - 1); }
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else { setCurrentMonth(currentMonth + 1); }
    };

    const handleDateSelect = (day) => {
        if (day) {
            setSelectedDate(new Date(currentYear, currentMonth, day));
            setShowCalendar(false);
        }
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const headerTitle = isToday
        ? "Agenda de Hoje"
        : `Agenda: ${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth()+1).toString().padStart(2, '0')}`;

    return (
        <div className='px-4 mb-6'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gradua-inicio'>{headerTitle}</h2>
                <button
                    onClick={() => setShowCalendar(true)}
                    className='text-gradua-inicio text-sm font-semibold flex items-center gap-1 hover:text-gradua-inicio/70 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg'>
                    Ver calendário <CalendarIcon size={16} />
                </button>
            </div>

            {/* Altura mínima garantida para evitar o pulo de layout.
                O skeleton mantém o mesmo espaço que pelo menos 1 card ocupa,
                então o conteúdo abaixo (Announcements, etc.) não se move. */}
            <div className='space-y-4 min-h-[120px]'>
                {loading ? (
                    <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-3 animate-pulse'>
                        <div className='flex flex-col items-center min-w-[56px] gap-1'>
                            <div className='h-6 w-10 bg-gray-200 rounded'/>
                            <div className='h-3 w-6 bg-gray-100 rounded'/>
                            <div className='h-4 w-8 bg-gray-200 rounded'/>
                        </div>
                        <div className='flex-1 space-y-2'>
                            <div className='h-5 bg-gray-200 rounded w-3/4'/>
                            <div className='h-4 bg-gray-100 rounded w-1/2'/>
                        </div>
                    </div>
                ) : displayClasses.length > 0 ? (
                    displayClasses.map((classItem, index) => (
                        <div key={index} className='group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'>
                            <div className='flex items-start gap-3'>
                                <div className='flex flex-col items-center pt-1 min-w-[56px]'>
                                    <span className='text-lg font-bold text-gradua-inicio'>{classItem.time}</span>
                                    <span className='text-xs text-gradua-inicio/50'>-</span>
                                    <span className='text-sm font-semibold text-gradua-inicio/70'>{classItem.endTime}</span>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-lg font-bold text-gradua-inicio mb-1.5 leading-tight'>{classItem.title}</h3>
                                    <div className='flex items-center gap-2 text-sm text-gradua-inicio/60'>
                                        <MapPin size={16} className='text-gradua-inicio/40 mt-0.5' />
                                        <span>{classItem.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center'>
                        <CalendarIcon size={32} className='text-gray-400 mx-auto mb-3' />
                        <h3 className='text-gradua-inicio font-semibold'>Sem sessões de monitoria hoje</h3>
                        <p className='text-gradua-inicio/50 text-sm mt-1'>Aproveite para estudar ou descansar!</p>
                    </div>
                )}
            </div>

            {/* Modal de calendário */}
            {showCalendar && (
                <div className='fixed inset-0 bg-black/30 z-[70] flex items-center justify-center p-4' onClick={() => setShowCalendar(false)}>
                    <div className='bg-white rounded-2xl w-full max-w-[320px] p-5 shadow-2xl animate-fade-in' onClick={e => e.stopPropagation()}>
                        
                        <div className='flex items-center justify-between mb-4'>
                            <button onClick={prevMonth} className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
                                <ChevronLeft size={20} className='text-gray-600' />
                            </button>
                            <h3 className='font-bold text-gray-900'>
                                {monthNames[currentMonth]} {currentYear}
                            </h3>
                            <button onClick={nextMonth} className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
                                <ChevronRight size={20} className='text-gray-600' />
                            </button>
                        </div>

                        <div className='grid grid-cols-7 gap-1 mb-2'>
                            {weekDays.map((day, idx) => (
                                <div key={idx} className='text-center text-xs font-bold text-gray-400 py-1'>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-7 gap-1'>
                            {daysArray.map((day, idx) => {
                                const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
                                const isTodayDate = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={!day}
                                        className={`
                                            h-9 w-full rounded-full flex items-center justify-center text-sm font-medium transition-colors
                                            ${!day ? 'invisible' : 'hover:bg-gray-100 text-gray-700'}
                                            ${isTodayDate && !isSelected ? 'border border-gradua-inicio/20 text-gradua-inicio/60' : ''}
                                            ${isSelected ? 'bg-gradua-inicio/60 text-white hover:bg-gradua-inicio/70' : ''}
                                        `}>
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className='mt-5 pt-4 border-t border-gray-100 flex justify-center'>
                            <button
                                onClick={() => {
                                    setSelectedDate(new Date());
                                    setCurrentMonth(new Date().getMonth());
                                    setCurrentYear(new Date().getFullYear());
                                }}
                                className='text-sm text-gradua-inicio/70 font-semibold hover:text-gradua-inicio'>
                                Voltar para Hoje
                            </button>
                        </div>
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

export default TodayAgenda;
