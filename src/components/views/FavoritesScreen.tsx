import React from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { CALCULATORS_DATA } from '../../data/calculators';
import { CalculatorCard } from '../common/CalculatorCard';
import { BannerAdSlot } from '../ads/BannerAdSlot';

interface FavoritesScreenProps {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCalculator: (calculator: CalculatorItem) => void;
  onExploreCalculators: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favoriteIds,
  isFavorite,
  onToggleFavorite,
  onSelectCalculator,
  onExploreCalculators,
}) => {
  const favoriteCalculators = CALCULATORS_DATA.filter((calc) =>
    favoriteIds.includes(calc.id)
  );

  return (
    <div id="favorites-screen-view" className="w-full flex flex-col pt-4 pb-12 animate-in fade-in duration-200">
      {/* Title and Subtitle */}
      <div className="pt-2 pb-4 border-b border-[var(--app-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h1
              id="favorites-screen-title"
              className="text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
            >
              المفضلة
            </h1>
            <p
              id="favorites-screen-subtitle"
              className="text-xs font-medium text-[var(--app-text-secondary)] mt-1"
            >
              حاسباتك التي تستخدمها بشكل متكرر
            </p>
          </div>
          {favoriteCalculators.length > 0 && (
            <span className="text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] bg-[#5B5BF7]/10 dark:bg-[#7C6CFF]/15 px-3 py-1 rounded-xl border border-[#5B5BF7]/20 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#FFB020] text-[#FFB020]" />
              <span>{favoriteCalculators.length} حاسبات</span>
            </span>
          )}
        </div>
      </div>

      {favoriteCalculators.length > 0 ? (
        <div id="favorites-items-list" className="space-y-2.5 pt-4">
          {favoriteCalculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              calculator={calc}
              isFavorite={isFavorite(calc.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onSelectCalculator}
              variant="list"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          id="favorites-empty-state"
          className="w-full p-8 sm:p-12 rounded-3xl bg-[var(--app-surface)] border border-[var(--app-border)] text-center my-6 shadow-sm flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] mb-4 shadow-sm">
            <Star className="w-8 h-8 stroke-[1.8] text-[#FFB020]" />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[var(--app-text)]">
            لا توجد مفضلات بعد
          </h2>

          <p className="text-xs font-medium text-[var(--app-text-secondary)] mt-1.5 max-w-xs leading-relaxed">
            أضف الحاسبات التي تستخدمها كثيراً للوصول إليها بسرعة.
          </p>

          <button
            id="btn-explore-calcs-from-favs"
            type="button"
            onClick={onExploreCalculators}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white text-xs font-bold transition-all shadow-md shadow-[#5B5BF7]/25 cursor-pointer active:scale-95"
          >
            <span>استكشف الحاسبات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Centralized Non-intrusive Banner Placement */}
      <BannerAdSlot placement="favorites" />
    </div>
  );
};

