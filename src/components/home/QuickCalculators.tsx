import React from 'react';
import { Star, ChevronLeft, Sparkles } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { CALCULATORS_DATA } from '../../data/calculators';
import { DynamicIcon } from '../common/DynamicIcon';

interface QuickCalculatorsProps {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCalculator: (calculator: CalculatorItem) => void;
}

interface QuickConfig {
  id: string;
  themeColor: 'purple' | 'blue' | 'green' | 'orange';
  accentText: string;
  accentBg: string;
  accentBorder: string;
  badge: string;
}

const QUICK_CONFIGS: Record<string, QuickConfig> = {
  discount: {
    id: 'discount',
    themeColor: 'purple',
    accentText: '#9D62FF',
    accentBg: 'rgba(157, 98, 255, 0.12)',
    accentBorder: 'rgba(157, 98, 255, 0.25)',
    badge: 'توفير',
  },
  percentage: {
    id: 'percentage',
    themeColor: 'blue',
    accentText: '#00D4FF',
    accentBg: 'rgba(0, 212, 255, 0.12)',
    accentBorder: 'rgba(0, 212, 255, 0.25)',
    badge: 'سريع',
  },
  'profit-loss': {
    id: 'profit-loss',
    themeColor: 'green',
    accentText: '#19C37D',
    accentBg: 'rgba(25, 195, 125, 0.12)',
    accentBorder: 'rgba(25, 195, 125, 0.25)',
    badge: 'أعمال',
  },
  installments: {
    id: 'installments',
    themeColor: 'orange',
    accentText: '#FFB020',
    accentBg: 'rgba(255, 176, 32, 0.12)',
    accentBorder: 'rgba(255, 176, 32, 0.25)',
    badge: 'تمويل',
  },
};

export const QuickCalculators: React.FC<QuickCalculatorsProps> = ({
  isFavorite,
  onToggleFavorite,
  onSelectCalculator,
}) => {
  const quickCalcIds = ['discount', 'percentage', 'profit-loss', 'installments'];
  const quickCalculators = quickCalcIds
    .map((id) => CALCULATORS_DATA.find((c) => c.id === id))
    .filter((c): c is CalculatorItem => Boolean(c));

  return (
    <section id="quick-calculators-section" className="pt-4 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2
            id="quick-calculators-title"
            className="text-sm sm:text-base font-bold text-[var(--app-text)] flex items-center gap-1.5"
          >
            <span>الحاسبات السريعة</span>
          </h2>
          <span className="text-[10px] font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2 py-0.5 rounded-full border border-[#5B5BF7]/20">
            الأكثر طلباً
          </span>
        </div>
      </div>

      {/* 2x2 Grid of Refined Cards */}
      <div id="quick-calculators-grid" className="grid grid-cols-2 gap-3">
        {quickCalculators.map((item) => {
          const config = QUICK_CONFIGS[item.id] || QUICK_CONFIGS.percentage;
          const fav = isFavorite(item.id);

          return (
            <div
              key={item.id}
              id={`quick-calc-card-${item.id}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCalculator(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCalculator(item);
                }
              }}
              className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] active:scale-[0.98] transition-all duration-200 cursor-pointer text-right shadow-sm select-none overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div
                className="absolute top-0 right-0 left-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: config.accentText }}
              />

              {/* Top row: Icon container + Favorite button */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
                  style={{
                    backgroundColor: config.accentBg,
                    border: `1px solid ${config.accentBorder}`,
                    color: config.accentText,
                  }}
                >
                  <DynamicIcon name={item.iconName} className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: config.accentBg,
                      color: config.accentText,
                    }}
                  >
                    {config.badge}
                  </span>

                  <button
                    type="button"
                    id={`fav-btn-quick-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    aria-label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[#5B5BF7] active:scale-90 transition-all cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 transition-all ${
                        fav
                          ? 'fill-[#FFB020] text-[#FFB020]'
                          : 'text-[var(--app-text-secondary)]/50 group-hover:text-[var(--app-text-secondary)]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Title and Short Description */}
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] transition-colors leading-snug truncate">
                  {item.nameAr}
                </h3>
                <p className="text-[11px] font-medium text-[var(--app-text-secondary)] mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
