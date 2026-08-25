import React, { useState } from 'react';
import { Copy, Share2, RotateCcw, Check } from 'lucide-react';

export interface ResultDetailItem {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

export interface ResultCardProps {
  calculatorTitle?: string;
  primaryResult: string;
  primaryUnit?: string;
  badgeText?: string;
  badgeColor?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'gray';
  details?: ResultDetailItem[];
  onReset: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  calculatorTitle = 'NUMA',
  primaryResult,
  primaryUnit,
  badgeText,
  badgeColor = 'indigo',
  details = [],
  onReset,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'gray':
        return 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
      case 'indigo':
      default:
        return 'bg-[#5B5BF7]/10 text-[#5B5BF7] border-[#5B5BF7]/20';
    }
  };

  const generateFullText = () => {
    let text = `${calculatorTitle.startsWith('NUMA') ? calculatorTitle : `NUMA — ${calculatorTitle}`}\n\n`;
    if (details.length > 0) {
      details.forEach((d) => {
        text += `${d.label}: ${d.value}\n`;
      });
    } else {
      text += `النتيجة: ${primaryResult} ${primaryUnit || ''}\n`;
    }
    if (badgeText) {
      text += `الحالة: ${badgeText}\n`;
    }
    return text.trim();
  };

  const handleCopy = async () => {
    try {
      const text = generateFullText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('تم نسخ النتيجة', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('تعذر النسخ إلى الحافظة', 'error');
    }
  };

  const handleShare = async () => {
    const textToShare = generateFullText();
    const shareData = {
      title: calculatorTitle || 'NUMA Smart Calculators',
      text: textToShare,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('تمت المشاركة بنجاح', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to copy silently if sharing failed
          try {
            await navigator.clipboard.writeText(textToShare);
            onShowToast('تم نسخ النتيجة للمشاركة', 'success');
          } catch {
            // Do not show technical errors
          }
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(textToShare);
        onShowToast('تم نسخ النتيجة للمشاركة', 'success');
      } catch {
        onShowToast('تعذر النسخ إلى الحافظة', 'error');
      }
    }
  };

  return (
    <div
      id="calculator-result-card"
      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Primary Result Banner */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--app-border)]/60">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[var(--app-text-secondary)]">
            النتيجة
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--app-text)] tracking-tight">
              {primaryResult}
            </span>
            {primaryUnit && (
              <span className="text-base sm:text-lg font-bold text-[var(--app-text-secondary)]">
                {primaryUnit}
              </span>
            )}
          </div>
        </div>

        {badgeText && (
          <span
            className={`px-3 py-1 text-xs font-bold rounded-xl border shrink-0 mt-1 ${getBadgeStyle()}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Details List */}
      {details.length > 0 && (
        <div className="space-y-2">
          {details.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                item.isHighlighted
                  ? 'bg-[#5B5BF7]/10 text-[#5B5BF7] border border-[#5B5BF7]/20'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text)] border border-transparent'
              }`}
            >
              <span className="text-[var(--app-text-secondary)] font-medium">
                {item.label}
              </span>
              <span className="tracking-wide">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons (Copy / Share / Recalculate) */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--app-border)]">
        {/* Copy Result Button */}
        <button
          type="button"
          id="btn-copy-result"
          onClick={handleCopy}
          className="h-11 rounded-2xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[var(--app-text-secondary)]" />
              <span>نسخ النتيجة</span>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          id="btn-share-result"
          onClick={handleShare}
          className="h-11 rounded-2xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <span>مشاركة</span>
        </button>

        {/* Recalculate Button */}
        <button
          type="button"
          id="btn-recalculate"
          onClick={onReset}
          className="h-11 rounded-2xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] hover:text-[#5B5BF7] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <span>إعادة الحساب</span>
        </button>
      </div>
    </div>
  );
};

