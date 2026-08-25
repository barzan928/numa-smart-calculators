import React, { useState, useMemo } from 'react';
import {
  Clock,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  Calendar,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { HistoryItem } from '../../calculators/types';
import { CALCULATORS_DATA } from '../../data/calculators';
import { DynamicIcon } from '../common/DynamicIcon';
import { ConfirmModal } from '../common/ConfirmModal';
import { BannerAdSlot } from '../ads/BannerAdSlot';

interface HistoryScreenProps {
  historyItems: HistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
  onSelectCalculator: (calculatorId: string, savedInputs?: Record<string, any>) => void;
  onGoHome: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type TimeGroup = 'today' | 'yesterday' | 'this_week' | 'older';

interface GroupedHistory {
  key: TimeGroup;
  title: string;
  items: HistoryItem[];
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  historyItems,
  onRemoveItem,
  onClearHistory,
  onSelectCalculator,
  onGoHome,
  onShowToast,
}) => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Helper map for calculator icon lookups
  const calcIconMap = useMemo(() => {
    const map = new Map<string, string>();
    CALCULATORS_DATA.forEach((calc) => {
      map.set(calc.id, calc.iconName);
    });
    return map;
  }, []);

  // Format single timestamp into time string like: "12:35 م"
  const formatTimeOnly = (ts: number): string => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString('ar-IQ', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Format card timestamp display: e.g. "اليوم — 12:35" or "أمس — 18:20" or "15 آب — 14:10"
  const formatCardTimestamp = (ts: number): string => {
    try {
      const date = new Date(ts);
      const now = new Date();

      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      const timeStr = formatTimeOnly(ts);

      if (isToday) {
        return `اليوم — ${timeStr}`;
      }
      if (isYesterday) {
        return `أمس — ${timeStr}`;
      }

      const dateStr = date.toLocaleDateString('ar-IQ', {
        day: 'numeric',
        month: 'short',
      });
      return `${dateStr} — ${timeStr}`;
    } catch {
      return '';
    }
  };

  // Group items chronologically: Today, Yesterday, This Week, Older
  const groupedHistory = useMemo((): GroupedHistory[] => {
    if (historyItems.length === 0) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    const startOfThisWeek = startOfToday - 6 * 24 * 60 * 60 * 1000;

    const todayItems: HistoryItem[] = [];
    const yesterdayItems: HistoryItem[] = [];
    const thisWeekItems: HistoryItem[] = [];
    const olderItems: HistoryItem[] = [];

    historyItems.forEach((item) => {
      const ts = item.timestamp;
      if (ts >= startOfToday) {
        todayItems.push(item);
      } else if (ts >= startOfYesterday) {
        yesterdayItems.push(item);
      } else if (ts >= startOfThisWeek) {
        thisWeekItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    const groups: GroupedHistory[] = [];
    if (todayItems.length > 0) {
      groups.push({ key: 'today', title: 'اليوم', items: todayItems });
    }
    if (yesterdayItems.length > 0) {
      groups.push({ key: 'yesterday', title: 'أمس', items: yesterdayItems });
    }
    if (thisWeekItems.length > 0) {
      groups.push({ key: 'this_week', title: 'هذا الأسبوع', items: thisWeekItems });
    }
    if (olderItems.length > 0) {
      groups.push({ key: 'older', title: 'أقدم', items: olderItems });
    }

    return groups;
  }, [historyItems]);

  const handleConfirmClear = () => {
    onClearHistory();
    setIsClearModalOpen(false);
    onShowToast('تم مسح السجل بنجاح', 'info');
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onRemoveItem(id);
    onShowToast('تم حذف العملية', 'info');
  };

  return (
    <div id="history-screen-view" className="w-full flex flex-col pt-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pt-2 pb-4 flex items-center justify-between border-b border-[var(--app-border)]">
        <div>
          <h1
            id="history-screen-title"
            className="text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
          >
            السجل
          </h1>
          <p
            id="history-screen-subtitle"
            className="text-xs font-medium text-[var(--app-text-secondary)] mt-0.5"
          >
            عملياتك الحسابية الأخيرة
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            id="btn-clear-all-history"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-all border border-rose-500/20 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح السجل</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {historyItems.length === 0 ? (
        <div
          id="history-empty-state"
          className="w-full p-8 sm:p-12 rounded-3xl bg-[var(--app-surface)] border border-[var(--app-border)] text-center my-6 shadow-sm flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] mb-4 shadow-sm">
            <Clock className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[var(--app-text)]">
            لا توجد عمليات بعد
          </h2>

          <p className="text-xs font-medium text-[var(--app-text-secondary)] mt-1.5 max-w-xs leading-relaxed">
            ابدأ باستخدام إحدى الحاسبات وستظهر عملياتك هنا.
          </p>

          <button
            type="button"
            id="btn-explore-calcs-from-history"
            onClick={onGoHome}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white text-xs font-bold transition-all shadow-md shadow-[#5B5BF7]/25 cursor-pointer active:scale-95"
          >
            <span>استكشف الحاسبات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Grouped History List */
        <div id="history-items-container" className="space-y-6 pt-4">
          {groupedHistory.map((group) => (
            <div key={group.key} className="space-y-2.5">
              {/* Group Title */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-extrabold text-[#5B5BF7] dark:text-[#7C6CFF] bg-[#5B5BF7]/10 dark:bg-[#7C6CFF]/15 px-2.5 py-0.5 rounded-lg border border-[#5B5BF7]/20">
                  {group.title}
                </span>
                <span className="text-[11px] font-semibold text-[var(--app-text-secondary)]">
                  ({group.items.length})
                </span>
                <div className="flex-1 h-[1px] bg-[var(--app-border)]/60" />
              </div>

              {/* Cards in this group */}
              <div className="space-y-2.5">
                {group.items.map((item) => {
                  const iconName = calcIconMap.get(item.calculatorId) || 'Calculator';

                  return (
                    <div
                      key={item.id}
                      id={`history-card-${item.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectCalculator(item.calculatorId, item.inputs)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectCalculator(item.calculatorId, item.inputs);
                        }
                      }}
                      className="w-full p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[#5B5BF7]/50 hover:bg-[var(--app-surface-secondary)] transition-all duration-200 shadow-sm space-y-2.5 group cursor-pointer text-right select-none active:scale-[0.99]"
                    >
                      {/* Top Row: Icon + Name + Timestamp + Delete */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Calculator Icon */}
                          <div className="w-8 h-8 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] group-hover:bg-[#5B5BF7]/10 shrink-0 transition-colors">
                            <DynamicIcon name={iconName} className="w-4 h-4" />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-[var(--app-text)] truncate group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] transition-colors">
                              {item.calculatorNameAr}
                            </span>
                            <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
                              {formatCardTimestamp(item.timestamp)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Delete Item Button */}
                          <button
                            type="button"
                            id={`btn-delete-history-${item.id}`}
                            onClick={(e) => handleDeleteItem(e, item.id)}
                            aria-label="حذف العملية من السجل"
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--app-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="حذف من السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Main Result Banner */}
                      <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-[var(--app-border)]/50">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-extrabold text-[var(--app-text)] tracking-tight">
                            {item.primaryResult}
                          </span>
                          {item.primaryUnit && (
                            <span className="text-xs font-bold text-[var(--app-text-secondary)]">
                              {item.primaryUnit}
                            </span>
                          )}
                        </div>

                        {item.badgeText && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {item.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Bottom: Inputs summary & Reopen hint */}
                      <div className="flex items-center justify-between text-xs text-[var(--app-text-secondary)] pt-1">
                        <span className="truncate max-w-[200px] sm:max-w-xs font-normal">
                          {item.inputsSummary}
                        </span>
                        <div className="flex items-center gap-1 text-[#5B5BF7] dark:text-[#7C6CFF] font-bold text-[11px] shrink-0 group-hover:-translate-x-0.5 transition-transform">
                          <RotateCcw className="w-3 h-3" />
                          <span>إعادة الفتح</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Centralized Non-intrusive Banner Placement */}
      <BannerAdSlot placement="history" />

      {/* Confirmation Modal for Clearing History */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="مسح السجل؟"
        message="سيتم حذف جميع العمليات المحفوظة ولا يمكن التراجع عن هذا الإجراء."
        confirmLabel="مسح السجل"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
        isDestructive={true}
      />
    </div>
  );
};

