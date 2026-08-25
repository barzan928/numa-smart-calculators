import React from 'react';
import {
  History,
  Settings,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { TabId, ThemeMode } from '../../types';

interface PlaceholderViewProps {
  tab: TabId;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  onGoHome: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tab,
  theme = 'dark',
  onThemeChange,
  onGoHome,
}) => {
  if (tab === 'history') {
    return (
      <div id="history-screen-view" className="w-full flex flex-col pt-4 pb-6">
        {/* Title */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                id="history-screen-title"
                className="text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
              >
                السجل
              </h1>
              <p
                id="history-screen-subtitle"
                className="text-xs font-medium text-[var(--app-text-secondary)] mt-1"
              >
                سجل العمليات الحسابية السابقة
              </p>
            </div>
            <span className="text-xs font-bold text-[#19C37D] bg-[#19C37D]/10 px-2.5 py-1 rounded-full border border-[#19C37D]/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>حفظ تلقائي</span>
            </span>
          </div>
        </div>

        {/* Empty / Ready State Card */}
        <div className="w-full p-8 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] text-center my-6 shadow-sm flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] mb-4">
            <Clock className="w-7 h-7 stroke-[1.8]" />
          </div>

          <h2 className="text-base font-bold text-[var(--app-text)]">
            لا توجد عمليات سابقة بعد
          </h2>

          <p className="text-xs font-medium text-[var(--app-text-secondary)] mt-1.5 max-w-xs leading-relaxed">
            عندما تقوم بإجراء عمليات حسابية في أي أداة، ستظهر جميع نتائجك هنا مع التاريخ والتفاصيل.
          </p>

          <button
            type="button"
            onClick={onGoHome}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--app-surface-secondary)] hover:bg-[var(--app-surface)] text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] border border-[var(--app-border)] transition-colors cursor-pointer"
          >
            <span>ابدأ بحساب جديد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (tab === 'settings') {
    return (
      <div id="settings-screen-view" className="w-full flex flex-col pt-4 pb-6">
        {/* Title */}
        <div className="pt-2 pb-4">
          <h1
            id="settings-screen-title"
            className="text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
          >
            الإعدادات
          </h1>
          <p
            id="settings-screen-subtitle"
            className="text-xs font-medium text-[var(--app-text-secondary)] mt-1"
          >
            تخصيص المظهر وتفضيلات التطبيق
          </p>
        </div>

        {/* Appearance Setting Section */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1">
            المظهر والألوان
          </span>

          <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[var(--app-text)]">
                الوضع الليلي / النهاري
              </span>
              <span className="text-xs font-semibold text-[#5B5BF7] dark:text-[#7C6CFF]">
                {theme === 'dark' ? 'داكن (Dark Mode)' : 'فاتح (Light Mode)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onThemeChange?.('dark')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#151B35] border-[#5B5BF7] text-[#F8FAFF] shadow-sm'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <Moon className="w-4 h-4 text-[#5B5BF7]" />
                <span>الوضع الداكن</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange?.('light')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#FFFFFF] border-[#5146E5] text-[#0F172A] shadow-sm'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <Sun className="w-4 h-4 text-[#D97706]" />
                <span>الوضع الفاتح</span>
              </button>
            </div>
          </div>
        </div>

        {/* Brand & App Info Section */}
        <div className="space-y-3 pt-5">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1">
            حول التطبيق
          </span>

          <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#5B5BF7]/10 flex items-center justify-center text-[#5B5BF7]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[var(--app-text)] block">
                    NUMA Smart Calculators
                  </span>
                  <span className="text-[10px] text-[var(--app-text-secondary)]">
                    الإصدار 1.0.0
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2 py-0.5 rounded-full border border-[#5B5BF7]/20">
                PRO EDITION
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--app-border)] flex items-center justify-between text-xs text-[var(--app-text-secondary)]">
              <span>اللغة الأساسية</span>
              <span className="font-semibold text-[var(--app-text)]">العربية (RTL)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
