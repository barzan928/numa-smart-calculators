import React, { useState, useMemo } from 'react';
import { Header } from '../layout/Header';
import { GreetingSection } from '../home/GreetingSection';
import { SearchBar } from '../home/SearchBar';
import { QuickCalculators } from '../home/QuickCalculators';
import { CategoriesSection } from '../home/CategoriesSection';
import { RecentActivitySection } from '../home/RecentActivitySection';
import { CalculatorItem, CategoryId, ThemeMode } from '../../types';
import { CALCULATORS_DATA } from '../../data/calculators';
import { searchCalculators, getSearchSuggestions } from '../../utils/search';
import { SearchSuggestions } from '../calculators/SearchSuggestions';
import { CalculatorCard } from '../common/CalculatorCard';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { BannerAdSlot } from '../ads/BannerAdSlot';

interface HomeScreenProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCalculator: (calculator: CalculatorItem) => void;
  onSelectCategory: (category: CategoryId) => void;
  recentIds?: string[];
  favoriteIds?: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme = 'dark',
  onToggleTheme,
  onOpenSettings,
  onOpenHistory,
  isFavorite,
  onToggleFavorite,
  onSelectCalculator,
  onSelectCategory,
  recentIds = [],
  favoriteIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCalculators(
      CALCULATORS_DATA,
      searchQuery,
      'all',
      'default',
      recentIds,
      favoriteIds
    );
  }, [searchQuery, recentIds, favoriteIds]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return getSearchSuggestions(CALCULATORS_DATA, searchQuery, 4);
  }, [searchQuery]);

  const handleSelectFromSuggestion = (calculator: CalculatorItem) => {
    setIsSearchFocused(false);
    onSelectCalculator(calculator);
  };

  return (
    <div id="home-screen-view" className="w-full flex flex-col">
      {/* 1. Header */}
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSettings={onOpenSettings}
      />

      {/* 2. Greeting */}
      <GreetingSection />

      {/* 3. Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onFilterClick={() => onSelectCategory('all')}
        showFilterButton={true}
        placeholder="ابحث عن حاسبة..."
      />

      {/* Instant Search Suggestions */}
      {isSearchFocused && searchQuery.trim() && searchSuggestions.length > 0 && (
        <SearchSuggestions
          suggestions={searchSuggestions}
          query={searchQuery}
          onSelect={handleSelectFromSuggestion}
          onClose={() => setIsSearchFocused(false)}
        />
      )}

      {/* If user is typing search query on Home screen */}
      {searchQuery.trim() ? (
        <div id="home-search-results" className="pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--app-text)]">
              نتائج البحث عن "{searchQuery}" ({searchResults.length})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              مسح البحث
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-2.5">
              {searchResults.map((calc) => (
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
            <div
              id="home-search-empty-state"
              className="w-full flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--app-surface)] rounded-2xl border border-[var(--app-border)] my-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] mb-2.5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--app-text)]">
                لم نجد ما تبحث عنه
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] mt-1 max-w-xs">
                جرّب كلمة مختلفة أو اختر أحد التصنيفات.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-[var(--app-surface-secondary)] hover:bg-[var(--app-surface)] text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] border border-[var(--app-border)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>عرض جميع الحاسبات</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 4. Quick Calculators (الحاسبات السريعة) */}
          <QuickCalculators
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onSelectCalculator={onSelectCalculator}
          />

          {/* 5. Categories (التصنيفات - 2 Column Grid) */}
          <CategoriesSection onSelectCategory={onSelectCategory} />

          {/* 6. Recent Activity (آخر العمليات) */}
          <RecentActivitySection
            onOpenHistory={onOpenHistory || (() => {})}
            onSelectCalculator={onSelectCalculator}
          />

          {/* Centralized Non-intrusive AdMob Banner Placement */}
          <BannerAdSlot placement="home" />
        </>
      )}
    </div>
  );
};
