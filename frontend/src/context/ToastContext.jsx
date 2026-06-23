import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_DURATION = 4000;

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-600' },
    error: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-600' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-600' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-600' },
  };
  const style = icons[toast.type] || icons.info;
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 ${style.bg} border ${style.border} rounded-2xl px-4 py-3 shadow-lg animate-slide-up max-w-sm w-full`}
    >
      <Icon size={18} className={`${style.color} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-semibold flex-1 ${style.color}`}>{toast.message}</p>
      <button onClick={onClose} className={`${style.color} hover:opacity-70 flex-shrink-0`}>
        <X size={16} />
      </button>
    </div>
  );
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto" onClick={() => dismissToast(t.id)}>
            <ToastItem toast={t} onClose={() => dismissToast(t.id)} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}
