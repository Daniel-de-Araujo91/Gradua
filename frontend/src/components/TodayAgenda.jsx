import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, Loader2, Trash2, X, Pencil, Video, User } from 'lucide-react';
import { agendaService } from '../services/agendaService';
import { classOnDay } from '../utils/scheduleParser';

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const TodayAgenda = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const [agenda, setAgenda] = useState({ classes: [], monitorSessions: [], reminders: [] });
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    setLoading(true);
    agendaService.getDay(formatDate(selectedDate))
      .then(data => {
        setAgenda(data);
        setLoading(false);
      })
      .catch(() => {
        setAgenda({ classes: [], monitorSessions: [], reminders: [] });
        setLoading(false);
      });
  }, [selectedDate]);

  const allItems = (() => {
    const dayLabels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const dayLabel = dayLabels[selectedDate.getDay()];
    const items = [];
    (agenda.classes || []).forEach(c => {
      const parsed = classOnDay(c.schedule, dayLabel);
      if (!parsed) return;
      items.push({
        id: `class-${c.classId}`,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        title: c.subjectName || c.subjectCode || 'Aula',
        abbr: c.subjectCode,
        location: c.location || 'A definir',
        status: `${parsed.shiftKey}${parsed.periods.join('/')}`,
        statusType: 'confirmed',
        professor: null,
        meetingLink: null,
        isReminder: false,
        reminderId: null,
      });
    });
    (agenda.monitorSessions || []).forEach(s => {
      items.push({
        id: `session-${s.sessionId}`,
        startTime: s.startTime ? s.startTime.substring(0, 5) : '',
        endTime: s.endTime ? s.endTime.substring(0, 5) : '',
        title: s.topic || s.subjectName || 'Sessão de Monitoria',
        abbr: s.subjectName,
        location: s.location || '',
        status: 'MONITORIA',
        statusType: 'lab',
        professor: s.monitorName,
        meetingLink: s.meetingLink,
        isReminder: false,
        reminderId: null,
      });
    });
    (agenda.reminders || []).forEach(r => {
      items.push({
        id: `rem-${r.reminderId}`,
        startTime: r.time ? r.time.substring(0, 5) : '',
        endTime: '',
        title: r.title,
        abbr: '',
        location: r.location || 'A definir',
        status: 'LEMBRETE',
        statusType: 'normal',
        professor: null,
        meetingLink: null,
        isReminder: true,
        reminderId: r.reminderId,
      });
    });
    items.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return items;
  })();

  const removeReminder = async (reminderId) => {
    try {
      await agendaService.deleteReminder(reminderId);
      const newData = {
        ...agenda,
        reminders: (agenda.reminders || []).filter(r => r.reminderId !== reminderId)
      };
      setAgenda(newData);
    } catch {}
  };

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
        ) : allItems.length > 0 ? (
          allItems.map((item) => (
            <div key={item.id} className="rounded-2xl overflow-hidden flex-shrink-0 relative group bg-white shadow-[0_2px_8px_rgba(30,58,95,0.08)]">
              {item.isReminder && (
                <div className="absolute top-3 right-3">
                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-2 bg-red-50 rounded-full px-2 py-1 animate-fade-in">
                      <span className="text-[10px] font-bold text-red-600">Excluir?</span>
                      <button onClick={() => removeReminder(item.reminderId)} className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full">
                        <Trash2 size={12} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-gray-500 hover:bg-gray-200 bg-gray-100 rounded-full">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate('/agenda')} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(item.id)} className="p-1.5 text-gray-300 active:text-red-500 active:bg-red-50 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {item.meetingLink && (
                <a href={item.meetingLink} target="_blank" rel="noopener noreferrer"
                  className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors">
                  <Video size={16} />
                </a>
              )}

              <div className="flex">
                <div className="flex flex-col items-center justify-center px-4 py-5 min-w-[80px] border-r border-slate-100">
                  <span className="text-base font-black leading-none text-gradua-inicio">{item.startTime}</span>
                  {item.endTime && (
                    <span className="text-[10px] font-semibold mt-1 text-gray-400">até {item.endTime}</span>
                  )}
                </div>

                <div className="flex-1 px-4 py-4 break-words pr-16">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="text-base font-black text-gradua-inicio">{item.abbr || item.title}</h3>
                    {item.status && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                        item.statusType === 'confirmed' ? 'bg-gradua-inicio/15 text-gradua-inicio' :
                          item.statusType === 'lab' ? 'bg-gradua-inicio/15 text-gradua-inicio' :
                            'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>

                  {item.abbr && item.abbr !== item.title && (
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

                  {item.meetingLink && (
                    <a href={item.meetingLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 mt-1">
                      <Video size={12} /> Link da monitoria
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center'>
            <CalendarIcon size={32} className='text-gray-400 mx-auto mb-3' />
            <h3 className='text-gradua-inicio font-semibold'>Nenhum evento neste dia</h3>
            <p className='text-gradua-inicio/50 text-sm mt-1'>Sem aulas, monitorias ou lembretes cadastrados.</p>
          </div>
        )}
      </div>

      {showCalendar && (
        <div className='fixed inset-0 bg-black/30 z-[70] flex items-center justify-center p-4' onClick={() => setShowCalendar(false)}>
          <div className='bg-white rounded-2xl w-full max-w-[320px] p-5 shadow-2xl animate-fade-in' onClick={e => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-4'>
              <button onClick={prevMonth} className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
                <ChevronLeft size={20} className='text-gray-600' />
              </button>
              <h3 className='font-bold text-gray-900'>{monthNames[currentMonth]} {currentYear}</h3>
              <button onClick={nextMonth} className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
                <ChevronRight size={20} className='text-gray-600' />
              </button>
            </div>

            <div className='grid grid-cols-7 gap-1 mb-2'>
              {weekDays.map((day, idx) => (
                <div key={idx} className='text-center text-xs font-bold text-gray-400 py-1'>{day}</div>
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
