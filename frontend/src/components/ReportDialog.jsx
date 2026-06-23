import React, { useState } from 'react';
import { X, Flag, Loader2 } from 'lucide-react';

const ReportDialog = ({ open, title, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-red-500" />
            <h3 className="text-lg font-black text-gradua-perfil">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Descreva o motivo do report..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gradua-perfil outline-none bg-gray-50 focus:bg-white transition-all font-medium min-h-[100px] resize-none"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
            {loading ? 'Enviando...' : 'Reportar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
