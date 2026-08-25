import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  isDestructive = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        id="confirm-modal-card"
        className="w-full max-w-sm bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-[#FF5C77]/10 text-[#FF5C77] border border-[#FF5C77]/20'
                  : 'bg-[#5B5BF7]/10 text-[#5B5BF7] border border-[#5B5BF7]/20'
              }`}
            >
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--app-text)] leading-snug">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            id="btn-confirm-modal-cancel"
            onClick={onCancel}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--app-surface-secondary)] hover:bg-[var(--app-surface)] text-xs font-bold text-[var(--app-text)] border border-[var(--app-border)] transition-colors cursor-pointer active:scale-95"
          >
            {cancelText}
          </button>

          <button
            type="button"
            id="btn-confirm-modal-action"
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 text-white ${
              isDestructive
                ? 'bg-[#FF5C77] hover:bg-[#FF4564] shadow-[#FF5C77]/30'
                : 'bg-[#5B5BF7] hover:bg-[#4E4EEB] shadow-[#5B5BF7]/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
