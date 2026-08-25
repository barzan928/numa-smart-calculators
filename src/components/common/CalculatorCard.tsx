import React from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';

interface CalculatorCardProps {
  calculator: CalculatorItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (calculator: CalculatorItem) => void;
  variant?: 'grid' | 'list';
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  isFavorite,
  onToggleFavorite,
  onClick,
  variant = 'list',
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(calculator.id);
  };

  if (variant === 'grid') {
    return (
      <div
        id={`calculator-grid-card-${calculator.id}`}
        role="button"
        tabIndex={0}
        onClick={() => onClick(calculator)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(calculator);
          }
        }}
        className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] active:scale-[0.98] transition-all duration-200 cursor-pointer text-right shadow-sm select-none"
      >
        {/* Top bar: Icon + Favorite toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] group-hover:bg-[#5B5BF7]/10 group-hover:border-[#5B5BF7]/30 transition-colors">
            <DynamicIcon name={calculator.iconName} className="w-5 h-5" />
          </div>

          <button
            type="button"
            id={`fav-btn-grid-${calculator.id}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[#5B5BF7] hover:bg-[var(--app-surface-secondary)] transition-colors cursor-pointer"
          >
            <Star
              className={`w-4 h-4 transition-all ${
                isFavorite
                  ? 'fill-[#FFB020] text-[#FFB020]'
                  : 'text-[var(--app-text-secondary)]/50 group-hover:text-[var(--app-text-secondary)]'
              }`}
            />
          </button>
        </div>

        {/* Content: Title and Subtitle */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-1.5 py-0.5 rounded border border-[var(--app-border)]">
              {calculator.categoryAr}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] transition-colors leading-snug line-clamp-1">
            {calculator.nameAr}
          </h3>
          <p className="text-[11px] font-medium text-[var(--app-text-secondary)] mt-1 line-clamp-1">
            {calculator.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`calculator-list-card-${calculator.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onClick(calculator)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(calculator);
        }
      }}
      className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm select-none"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Leading Icon */}
        <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] group-hover:bg-[#5B5BF7]/10 group-hover:border-[#5B5BF7]/30 transition-colors">
          <DynamicIcon name={calculator.iconName} className="w-5 h-5" />
        </div>

        {/* Title and Short Description */}
        <div className="flex flex-col text-right min-w-0 pr-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] transition-colors truncate">
              {calculator.nameAr}
            </span>
            <span className="text-[10px] font-semibold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-1.5 py-0.5 rounded border border-[var(--app-border)]">
              {calculator.categoryAr}
            </span>
          </div>
          <span className="text-xs font-medium text-[var(--app-text-secondary)] mt-0.5 line-clamp-1">
            {calculator.description}
          </span>
        </div>
      </div>

      {/* Trailing actions: Favorite + Chevron */}
      <div className="flex items-center gap-1 shrink-0 mr-1">
        <button
          type="button"
          id={`fav-btn-list-${calculator.id}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[#5B5BF7] hover:bg-[var(--app-surface-secondary)] transition-colors cursor-pointer"
        >
          <Star
            className={`w-4 h-4 transition-all ${
              isFavorite
                ? 'fill-[#FFB020] text-[#FFB020]'
                : 'text-[var(--app-text-secondary)]/50 group-hover:text-[var(--app-text-secondary)]'
            }`}
          />
        </button>

        <div className="w-6 h-6 flex items-center justify-center text-[var(--app-text-secondary)]/40 group-hover:text-[#5B5BF7] group-hover:-translate-x-0.5 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

