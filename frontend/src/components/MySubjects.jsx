import { useState, useEffect } from 'react';
import { ChevronRight, X, Clock, MapPin, User, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Tooltip, Button } from 'flowbite-react';

const MySubjects = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        import('../services/apiClient').then(({ apiClient }) => {
            apiClient.get('/dashboard/subjects').then(data => {
                if (!mounted) return;
                const mapped = (data || []).map(s => ({
                    id: s.id,
                    code: s.code,
                    name: s.name,
                    schedule: s.schedule,
                    location: s.location,
                    type: s.type,
                    professor: s.professor,
                    participants: s.participants,
                    monitors: s.monitors || [],
                    grades: s.grades || { ab1: null, ab2: null, reav: null, final: null },
                    absences: s.absences || { registered: 0, remaining: 15 },
                    deliveryRate: s.deliveryRate || 'Em dia'
                }));
                setSubjects(mapped);
            }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
        });
        return () => { mounted = false; };
    }, []);

    const openModal = (subject) => {
        setSelectedSubject(subject);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSubject(null);
    };

    const translateSchedule = (code) => {
        const daysMap = {2: "Seg", 3: "Ter", 4: "Qua", 5: "Qui", 6: "Sex", 7: "Sáb", 1: "Dom"};
        const shiftMap = {M: "Manhã", T: "Tarde", N: "Noite"};

        const match = code.match(/(\d+)([MTN])(\d+)/);
        if (!match) return code;

        const [_, days, shift, hours] = match;

        const daysArray = days.split('').map(d => daysMap[d]);
        let daysText = daysArray[0];
        if (daysArray.length > 1) {
            const lastDay = daysArray.pop();
            daysText = `${daysArray.join(', ')} e ${lastDay}`;
        }

        const shiftText = shiftMap[shift];

        const hoursArray = hours.split('').map(h => `${h}ª`);
        let hoursText = hoursArray[0];
        if (hoursArray.length > 1) {
            const lastHour = hoursArray.pop();
            hoursText = `${hoursArray.join(', ')} e ${lastHour}`;
        }

        return `${daysText} - ${shiftText} - ${hoursText} Aula`;
    };

    return (
        <>
            <div className='px-4 mb-6 pb-4'> 
                <div className='flex justify-between items-center mb-3'>
                    <h2 className='text-lg font-semibold text-gray-900'>Grade Ativa</h2>
                    <Tooltip content='Seu período atual' placement='bottom'>
                        <p className='text-xs text-gray-500'>2026.1</p>
                    </Tooltip>
                </div>
                
                <div className='space-y-3'>
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => openModal(subject)}
                            className='w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left'>
                            <div className='flex justify-between items-start mb-2'>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded'>
                                            {subject.code}
                                        </span>
                                        <Tooltip content={translateSchedule(subject.schedule)} placement='bottom'>
                                            <span className='text-xs text-gray-500 font-medium border-b border-dashed border-gray-400 cursor-help'>
                                                {subject.schedule}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <h3 className='font-semibold text-gray-900'>{subject.name}</h3>
                                </div>
                                <ChevronRight size={18} className='text-gray-400' />
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className='text-xs text-gray-500'>{subject.location}</p>
                                <span className='text-xs text-gray-400'>{subject.type}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {showModal && selectedSubject && (
                <div className='fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4' onClick={closeModal}>
                    <div 
                        className='bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-fade-in shadow-xl'
                        onClick={(e) => e.stopPropagation()}>
                        <div className='sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-10'>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded'>
                                        {selectedSubject.code}
                                    </span>
                                    <Tooltip content={translateSchedule(selectedSubject.schedule)} placement='bottom' >
                                        <span className='text-xs text-gray-500 font-medium border-b border-dashed border-gray-400 cursor-help'>
                                            {selectedSubject.schedule}
                                            </span>
                                    </Tooltip>
                                </div>
                                <h2 className='text-xl font-bold text-gray-900 mt-1'>{selectedSubject.name}</h2>
                            </div>
                            <button onClick={closeModal} className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
                                <X size={24} className='text-gray-500' />
                            </button>
                        </div>

                        <div className='p-4 space-y-4 pb-8'>
                            <div className='space-y-3'>
                                <div className='flex items-start gap-3'>
                                    <MapPin size={18} className='text-gray-400 mt-0.5' />
                                    <div>
                                        <p className='text-xs text-gray-500'>LOCAL</p>
                                        <p className='text-sm font-medium text-gray-800'>{selectedSubject.location}</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <User size={18} className='text-gray-400 mt-0.5' />
                                    <div>
                                        <p className='text-xs text-gray-500'>PROFESSOR</p>
                                        <p className='text-sm font-medium text-gray-800'>{selectedSubject.professor}</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <Users size={18} className='text-gray-400 mt-0.5' />
                                    <div>
                                        <p className='text-xs text-gray-500'>PARTICIPANTES</p>
                                        <p className='text-sm font-medium text-gray-800'>{selectedSubject.participants}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedSubject.monitors && selectedSubject.monitors.length > 0 && (
                                <div className='border-t border-gray-100 pt-3'>
                                    <p className='text-xs text-gray-500 mb-2'>MONITORES</p>
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedSubject.monitors.map((monitor, index) => (
                                            <span key={index} className='bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full'>
                                                {monitor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='border-t border-gray-100 pt-3'>
                                <p className='text-xs text-gray-500 mb-2'>NOTAS</p>
                                <div className='grid grid-cols-4 gap-2'>
                                    <div className='bg-gray-50 rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500'>AB1</p>
                                        <p className='text-lg font-bold text-gray-800'>{selectedSubject.grades.ab1 || '—'}</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500'>AB2</p>
                                        <p className='text-lg font-bold text-gray-800'>{selectedSubject.grades.ab2 || '—'}</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500'>REAV</p>
                                        <p className='text-lg font-bold text-gray-800'>{selectedSubject.grades.reav || '—'}</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg p-2 text-center'>
                                        <p className='text-xs text-gray-500'>FINAL</p>
                                        <p className='text-lg font-bold text-gray-800'>{selectedSubject.grades.final || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='border-t border-gray-100 pt-3'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='text-xs text-gray-500'>FALTAS</p>
                                        <p className='text-sm font-medium text-gray-800'>
                                            {selectedSubject.absences.registered} registradas
                                        </p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-xs text-gray-500'>RESTANTES</p>
                                        <p className='text-sm font-medium text-gray-800'>{selectedSubject.absences.remaining}</p>
                                    </div>
                                </div>
                                <div className='mt-2 bg-gray-200 rounded-full h-1.5'>
                                    <div 
                                        className='bg-red-700 rounded-full h-1.5' 
                                        style={{ width: `${(selectedSubject.absences.registered / 15) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className='border-t border-gray-100 pt-3'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-xs text-gray-500'>TAXA DE ENTREGA</p>
                                    <div className='flex items-center gap-1'>
                                        {selectedSubject.deliveryRate === 'Em dia' ? (
                                            <CheckCircle size={14} className='text-green-700' />
                                        ) : (
                                            <AlertCircle size={14} className='text-red-700' />
                                        )}
                                        <span className={`text-sm font-medium ${
                                            selectedSubject.deliveryRate === 'Em dia' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {selectedSubject.deliveryRate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                 @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};

export default MySubjects;
