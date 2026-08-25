import React from 'react';
import { Flame, Clock, Star, ArrowLeft } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';

interface QuickDiscoverySectionProps {
  popularCalculators: CalculatorItem[];
  recentCalculators: CalculatorItem[];
  favoriteCalculators: CalculatorItem[];
  onSelectCalculator: (calculator: CalculatorItem) => void;
  onOpenTab?: (tab: 'popular' | 'recent' | 'favorites') => void;
}

export const QuickDiscoverySection: React.FC<QuickDiscoverySectionProps> = ({
  popularCalculators,
  recentCalculators,
  favoriteCalculators,
  onSelectCalculator,
}) => {
  return (
    <div id="quick-discovery-container" className="space-y-4 mb-4">
      {/* 1. Recently Used (استخدمتها مؤخراً) - Only if items exist */}
      {recentCalculators.length > 0 && (
        <section id="recent-used-calculators-section">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--app-text)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5B5BF7]" />
              <span>استخدمتها مؤخراً</span>
            </h3>
            <span className="text-[11px] font-semibold text-[var(--app-text-secondary)]">
              {recentCalculators.length} حاسبات
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {recentCalculators.slice(0, 4).map((calc) => (
              <button
                key={calc.id}
                id={`recent-calc-card-${calc.id}`}
                type="button"
                onClick={() => onSelectCalculator(calc)}
                className="group flex flex-col p-3 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] text-right transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--app-surface-secondary)] group-hover:bg-[#5B5BF7]/10 flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] transition-colors">
                    <DynamicIcon name={calc.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-1.5 py-0.5 rounded border border-[var(--app-border)]">
                    {calc.categoryAr}
                  </span>
                </div>
                <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] truncate">
                  {calc.nameAr}
                </span>
                <span className="text-[10px] text-[var(--app-text-secondary)] mt-0.5 truncate">
                  {calc.description}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 2. Most Popular (الأكثر استخداماً) */}
      {popularCalculators.length > 0 && (
        <section id="popular-calculators-section">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--app-text)] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF7043]" />
              <span>الأكثر استخداماً</span>
            </h3>
            <span className="text-[11px] font-semibold text-[var(--app-text-secondary)]">
              أدوات شائعة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {popularCalculators.slice(0, 6).map((calc) => (
              <button
                key={calc.id}
                id={`popular-calc-card-${calc.id}`}
                type="button"
                onClick={() => onSelectCalculator(calc)}
                className="group flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] text-right transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#5B5BF7]/10 to-[#7C4DFF]/10 border border-[#5B5BF7]/20 group-hover:from-[#5B5BF7]/20 flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] transition-colors">
                  <DynamicIcon name={calc.iconName} className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] truncate">
                    {calc.nameAr}
                  </span>
                  <span className="text-[10px] text-[var(--app-text-secondary)] truncate">
                    {calc.categoryAr}
                  </span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--app-text-secondary)]/40 group-hover:text-[#5B5BF7] shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. Favorites Quick Strip (if any) */}
      {favoriteCalculators.length > 0 && (
        <section id="favorites-quick-strip">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--app-text)] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#FFB020] fill-[#FFB020]" />
              <span>المفضلة السريعة</span>
            </h3>
            <span className="text-[11px] font-semibold text-[var(--app-text-secondary)]">
              {favoriteCalculators.length} مفضلة
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {favoriteCalculators.map((calc) => (
              <button
                key={calc.id}
                id={`favorite-quick-btn-${calc.id}`}
                type="button"
                onClick={() => onSelectCalculator(calc)}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] text-right transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--app-surface-secondary)] flex items-center justify-center text-[#5B5BF7] shrink-0">
                  <DynamicIcon name={calc.iconName} className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] whitespace-nowrap">
                  {calc.nameAr}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
