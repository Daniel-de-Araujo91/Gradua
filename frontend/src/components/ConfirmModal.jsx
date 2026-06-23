import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gradua-perfil">{title}</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 font-medium mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-bold py-3 rounded-xl text-sm transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gradua-perfil hover:opacity-90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
