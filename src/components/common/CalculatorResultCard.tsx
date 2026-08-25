import React, { useState } from 'react';
import { Copy, Share2, RotateCcw, Check } from 'lucide-react';
import { CalculationResult } from '../../calculators/types';

interface CalculatorResultCardProps {
  calculatorTitle?: string;
  result: CalculationResult;
  onReset: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CalculatorResultCard: React.FC<CalculatorResultCardProps> = ({
  calculatorTitle = 'NUMA',
  result,
  onReset,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const generateFullText = () => {
    let text = `${calculatorTitle.startsWith('NUMA') ? calculatorTitle : `NUMA — ${calculatorTitle}`}\n\n`;
    if (result.details && result.details.length > 0) {
      result.details.forEach((d) => {
        text += `${d.label}: ${d.value}\n`;
      });
    } else {
      text += `النتيجة: ${result.primaryValue} ${result.primaryUnit || ''}\n`;
    }
    if (result.badge) {
      text += `الحالة: ${result.badge.text}\n`;
    }
    return text.trim();
  };

  const handleCopy = async () => {
    try {
      const textToCopy = generateFullText();
      await navigator.clipboard.writeText(textToCopy);
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
      title: result.title || calculatorTitle || 'NUMA Calculators',
      text: textToShare,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('تمت المشاركة بنجاح', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(textToShare);
            onShowToast('تم نسخ النتيجة للمشاركة', 'success');
          } catch {
            // silent fallback
          }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        onShowToast('تم نسخ النتيجة للمشاركة', 'success');
      } catch {
        onShowToast('تعذر النسخ إلى الحافظة', 'error');
      }
    }
  };

  const getBadgeClasses = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-[#19C37D]/10 text-[#19C37D] border-[#19C37D]/20';
      case 'error':
        return 'bg-[#FF5C77]/10 text-[#FF5C77] border-[#FF5C77]/20';
      case 'warning':
        return 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20';
      case 'primary':
        return 'bg-[#5B5BF7]/10 text-[#5B5BF7] border-[#5B5BF7]/20';
      default:
        return 'bg-[var(--app-surface-secondary)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
    }
  };

  return (
    <div
      id="calculator-result-card"
      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header Result Summary */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--app-border)]/60">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[var(--app-text-secondary)]">
            النتيجة
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--app-text)] tracking-tight">
              {result.primaryValue}
            </span>
            {result.primaryUnit && (
              <span className="text-base sm:text-lg font-bold text-[var(--app-text-secondary)]">
                {result.primaryUnit}
              </span>
            )}
          </div>

          {result.secondaryLabel && (
            <p className="text-xs font-medium text-[var(--app-text-secondary)] pt-0.5">
              {result.secondaryLabel}
            </p>
          )}
        </div>

        {/* Status Badge */}
        {result.badge && (
          <span
            className={`px-3 py-1 text-xs font-bold rounded-xl border shrink-0 mt-1 ${getBadgeClasses(
              result.badge.type
            )}`}
          >
            {result.badge.text}
          </span>
        )}
      </div>

      {/* Detailed Breakdown */}
      {result.details && result.details.length > 0 && (
        <div className="space-y-2">
          {result.details.map((detail, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                detail.isHighlighted
                  ? 'bg-[#5B5BF7]/10 text-[#5B5BF7] border border-[#5B5BF7]/20'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text)] border border-transparent'
              }`}
            >
              <span className="text-[var(--app-text-secondary)] font-medium">
                {detail.label}
              </span>

              <span
                className={`font-bold tracking-wide ${
                  detail.type === 'success'
                    ? 'text-[#19C37D]'
                    : detail.type === 'error'
                    ? 'text-[#FF5C77]'
                    : detail.type === 'warning'
                    ? 'text-[#F5A623]'
                    : ''
                }`}
              >
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons (Copy / Share / Recalculate) */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--app-border)]">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          id="btn-copy-result"
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
          onClick={handleShare}
          id="btn-share-result"
          className="h-11 rounded-2xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <span>مشاركة</span>
        </button>

        {/* Recalculate Button */}
        <button
          type="button"
          onClick={onReset}
          id="btn-recalculate"
          className="h-11 rounded-2xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] hover:text-[#5B5BF7] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <span>إعادة الحساب</span>
        </button>
      </div>
    </div>
  );
};

