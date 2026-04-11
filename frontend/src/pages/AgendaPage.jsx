import { useState } from 'react';
import { Bell, MapPin, User, BellPlus, X, Trash2 } from 'lucide-react';
import BottomNavBar from '../components/BottomNavBar';
import Header from '../components/Header';

const AgendaPage = ({ onNavigate }) => {
    const [selectedDay, setSelectedDay] = useState('SEG');
    const [showAddModal, setShowAddModal] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newLocation, setNewLocation] = useState('');

    const weekDays = [
        { label: 'SEG', day: 18 },
        { label: 'TER', day: 19 },
        { label: 'QUA', day: 20 },
        { label: 'QUI', day: 21 },
        { label: 'SEX', day: 22 },
    ];

    const [classes, setClasses] = useState([
        {
            id: 1, 
            time: "08:00", period: "AM",
            title: "PROG 3",
            status: "CONFIRMADA", statusType: "confirmed",
            location: "Prédio Central, Sala 204",
            professor: "Prof. Dr. Ricardo Santos",
        },
        {
            id: 2,
            time: "13:30", period: "PM",
            title: "Teoria da Computação",
            status: "LABORATÓRIO", statusType: "lab",
            location: "CCEN, Lab 04",
            professor: "Prof. Dra. Maria Oliveira",
        },
        {
            id: 3,
            time: "15:20", period: "PM",
            title: "Sistemas Operacionais",
            status: null, statusType: "normal",
            location: "Bloco de Engenharias, Sala 12",
            professor: null,
        },
    ]);

    const dayNames = {
        SEG: 'Segunda-feira', TER: 'Terça-feira', QUA: 'Quarta-feira',
        QUI: 'Quinta-feira',  SEX: 'Sexta-feira',
    };

    const removeClass = (idToRemove) => {
        setClasses(currentClasses => currentClasses.filter(c => c.id !== idToRemove));
    };

    const handleAddReminder = (e) => {
        e.preventDefault(); 
        if (!newTitle || !newTime) return;

        const hour = parseInt(newTime.split(':')[0], 10);
        const period = hour >= 12 ? 'PM' : 'AM';

        const newReminder = {
            id: Date.now(), 
            time: newTime,
            period: period,
            title: newTitle,
            status: "LEMBRETE", 
            statusType: "normal",
            location: newLocation || "A definir",
            professor: null,
        };

        setClasses([...classes, newReminder]);
        setShowAddModal(false);
        setNewTitle('');
        setNewTime('');
        setNewLocation('');
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50">
            <Header onNavigate={onNavigate} />
            
            <div className="px-4 py-4" style={{ backgroundColor: '#f0f2f7' }}>
                <div className="flex gap-2 overflow-x-auto">
                    {weekDays.map((day) => (
                        <button
                            key={day.label}
                            onClick={() => setSelectedDay(day.label)}
                            className="flex flex-col items-center justify-center py-2 px-4 rounded-2xl flex-shrink-0 transition-all"
                            style={
                                selectedDay === day.label
                                    ? { backgroundColor: '#1e3a5f', color: '#fff', minWidth: 56 }
                                    : { backgroundColor: '#ffffff', color: '#4a5568', minWidth: 56, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} >
                            <span className="text-xs font-bold uppercase tracking-wide">{day.label}</span>
                            <span className="text-2xl font-black mt-0.5">{day.day}</span>
                            {selectedDay === day.label && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-5 pt-5 pb-4 flex justify-between items-center" style={{ backgroundColor: '#f0f2f7' }}>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>{dayNames[selectedDay]}</h2>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ backgroundColor: '#1e3a5f', color: '#fff' }}>
                            {classes.length} {classes.length === 1 ? 'AULA/LEMBRETE' : 'AULAS/LEMBRETES'} HOJE
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-28"  
                style={{ maxHeight: 'calc(100vh - 280px)' }}>  
                
                {classes.map((classItem) => (
                    <div key={classItem.id} className="rounded-2xl overflow-hidden flex-shrink-0 relative group"  
                        style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(30,58,95,0.08)' }}>
                        
                        <button 
                            onClick={() => removeClass(classItem.id)}
                            className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="flex">
                            <div className="flex flex-col items-center justify-center px-4 py-5 min-w-[80px]"
                                style={{ borderRight: '1px solid #edf2f7' }}>
                                <span className="text-xl font-black leading-none" style={{ color: '#1a7fe8' }}>
                                    {classItem.time}
                                </span>
                                <span className="text-xs font-semibold mt-0.5" style={{ color: '#7a8cb0' }}>
                                    {classItem.period}
                                </span>
                            </div>

                            <div className="flex-1 px-4 py-4 break-words pr-10">
                                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">  
                                    <h3 className="text-base font-black" style={{ color: '#1e3a5f' }}>
                                        {classItem.title}
                                    </h3>
                                    {classItem.status && (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                                            style={
                                                classItem.statusType === 'confirmed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } :
                                                classItem.statusType === 'lab' ? { backgroundColor: '#ede9fe', color: '#7c3aed' } :
                                                { backgroundColor: '#e2e8f0', color: '#475569' } 
                                            }>
                                            {classItem.status}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-start gap-1.5 mb-1">
                                    <MapPin size={13} style={{ color: '#7a8cb0', marginTop: 2, flexShrink: 0 }} />
                                    <span className="text-xs break-words flex-1" style={{ color: '#4a5568' }}>  
                                        {classItem.location}
                                    </span>
                                </div>
                                
                                {classItem.professor && (
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} style={{ color: '#7a8cb0', flexShrink: 0 }} />
                                        <span className="text-xs break-words" style={{ color: '#7a8cb0' }}> 
                                            {classItem.professor}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {classes.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Nenhuma aula ou lembrete para hoje.</p>
                    </div>
                )}

                <button 
                    onClick={() => setShowAddModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-sm font-bold transition-opacity hover:opacity-90 shadow-sm"
                    style={{ color: '#fff', backgroundColor: '#1e3a5f', borderRadius: '14px' }}>
                    <BellPlus size={16} />
                    Adicionar Lembrete
                </button>
            </div>

            <BottomNavBar activeTab="agenda" onTabChange={onNavigate} />

            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div 
                        className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-fade-in"
                        onClick={e => e.stopPropagation()} >
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-900">Novo Lembrete</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddReminder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Ex: Entrega de Trabalho"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Horário</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Local (Opcional)</label>
                                    <input 
                                        type="text" 
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                        placeholder="Ex: Lab 02"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-6 transition-colors">
                                Salvar Lembrete
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
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