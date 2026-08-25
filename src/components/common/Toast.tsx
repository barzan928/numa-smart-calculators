import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 2500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      id="app-toast-notification"
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--app-surface)] text-[var(--app-text)] border border-[var(--app-border)] shadow-2xl shadow-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-[#FF5C77] shrink-0" />
      ) : toast.type === 'info' ? (
        <Info className="w-4 h-4 text-[#00D4FF] shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#19C37D] shrink-0" />
      )}

      <span className="text-xs font-bold whitespace-nowrap">{toast.text}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="إغلاق التنبيه"
        className="p-1 -ml-1 text-[var(--app-text-secondary)] hover:text-[var(--app-text)] rounded-lg"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
