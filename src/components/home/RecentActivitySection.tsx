import React from 'react';
import { History, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { CalculatorItem } from '../../types';

interface RecentActivitySectionProps {
  onOpenHistory: () => void;
  onSelectCalculator?: (calculator: CalculatorItem) => void;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  onOpenHistory,
}) => {
  return (
    <section id="recent-activity-section" className="pt-4 pb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2
            id="recent-activity-title"
            className="text-sm sm:text-base font-bold text-[var(--app-text)] flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-[var(--app-text-secondary)]" />
            <span>آخر العمليات</span>
          </h2>
        </div>

        <button
          type="button"
          id="btn-view-all-history"
          onClick={onOpenHistory}
          className="text-xs font-semibold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>عرض الكل</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sleek Recent Operations Card */}
      <div
        id="recent-activity-card"
        onClick={onOpenHistory}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenHistory();
          }
        }}
        className="group relative p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] transition-all duration-200 cursor-pointer flex items-center justify-between shadow-sm select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#5B5BF7]/10 border border-[#5B5BF7]/20 flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] group-hover:scale-105 transition-transform">
            <History className="w-5 h-5" />
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--app-text)]">
                سجل العمليات الحسابية
              </span>
              <span className="text-[10px] font-bold text-[#19C37D] bg-[#19C37D]/10 px-1.5 py-0.5 rounded border border-[#19C37D]/20 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                تلقائي
              </span>
            </div>
            <span className="text-xs font-medium text-[var(--app-text-secondary)] mt-0.5">
              يتم حفظ نتائج حساباتك تلقائياً للرجوع إليها في أي وقت
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--app-text-secondary)]/50 group-hover:text-[#5B5BF7] group-hover:-translate-x-0.5 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};
