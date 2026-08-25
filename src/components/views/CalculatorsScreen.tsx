import React, { useState, useMemo, useEffect } from 'react';
import { Search, AlertCircle, X, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { CategoryId, CalculatorItem, SortType } from '../../types';
import { CATEGORIES_DATA, CALCULATORS_DATA } from '../../data/calculators';
import { CalculatorCard } from '../common/CalculatorCard';
import { CategoryHeader } from '../calculators/CategoryHeader';
import { SearchSuggestions } from '../calculators/SearchSuggestions';
import { SortSelector } from '../calculators/SortSelector';
import { QuickDiscoverySection } from '../calculators/QuickDiscoverySection';
import {
  searchCalculators,
  getSearchSuggestions,
  sortCalculators,
} from '../../utils/search';
import { getCalculatorUsageCounts } from '../../utils/usage';
import { BannerAdSlot } from '../ads/BannerAdSlot';

interface CalculatorsScreenProps {
  initialCategory?: CategoryId;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCalculator: (calculator: CalculatorItem) => void;
  recentIds?: string[];
  favoriteIds?: string[];
}

export const CalculatorsScreen: React.FC<CalculatorsScreenProps> = ({
  initialCategory = 'all',
  isFavorite,
  onToggleFavorite,
  onSelectCalculator,
  recentIds = [],
  favoriteIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(initialCategory);
  const [sortType, setSortType] = useState<SortType>('default');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sync initialCategory if updated externally (e.g. from Home category clicks)
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Usage counts from localStorage
  const usageCounts = useMemo(() => {
    return getCalculatorUsageCounts();
  }, []);

  // Compute search suggestions in real-time
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return getSearchSuggestions(CALCULATORS_DATA, searchQuery, 5);
  }, [searchQuery]);

  // Filtered & ranked calculators using smart scoring
  const filteredCalculators = useMemo(() => {
    return searchCalculators(
      CALCULATORS_DATA,
      searchQuery,
      selectedCategory,
      sortType,
      recentIds,
      favoriteIds,
      usageCounts
    );
  }, [searchQuery, selectedCategory, sortType, recentIds, favoriteIds, usageCounts]);

  // Selected Category Meta
  const currentCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES_DATA.find((c) => c.id === selectedCategory) || null;
  }, [selectedCategory]);

  // Real count of calculators in current selected category
  const categoryTotalCount = useMemo(() => {
    if (selectedCategory === 'all') return CALCULATORS_DATA.length;
    return CALCULATORS_DATA.filter((c) => c.category === selectedCategory).length;
  }, [selectedCategory]);

  // Discovery: Most popular calculators
  const popularCalculators = useMemo(() => {
    return sortCalculators(CALCULATORS_DATA, 'popular', recentIds, usageCounts).slice(0, 6);
  }, [recentIds, usageCounts]);

  // Discovery: Recently used calculators (from real history IDs)
  const recentCalculators = useMemo(() => {
    if (!recentIds || recentIds.length === 0) return [];
    const items: CalculatorItem[] = [];
    for (const id of recentIds) {
      const found = CALCULATORS_DATA.find((c) => c.id === id);
      if (found && !items.some((it) => it.id === found.id)) {
        items.push(found);
      }
      if (items.length >= 4) break;
    }
    return items;
  }, [recentIds]);

  // Discovery: Favorite calculators
  const favoriteCalculators = useMemo(() => {
    if (!favoriteIds || favoriteIds.length === 0) return [];
    return CALCULATORS_DATA.filter((c) => favoriteIds.includes(c.id));
  }, [favoriteIds]);

  // Handle resetting search and category
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortType('default');
  };

  const handleSelectFromSuggestion = (calculator: CalculatorItem) => {
    setIsSearchFocused(false);
    onSelectCalculator(calculator);
  };

  return (
    <div id="calculators-screen-view" className="w-full flex flex-col pt-3 pb-8">
      {/* Title & View Toggle */}
      <div className="pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1
            id="calculators-screen-title"
            className="text-xl sm:text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
          >
            الحاسبات
          </h1>
          <p
            id="calculators-screen-subtitle"
            className="text-xs font-medium text-[var(--app-text-secondary)] mt-0.5"
          >
            استكشف {CALCULATORS_DATA.length} حاسبة متخصصة لحساباتك اليومية
          </p>
        </div>

        {/* List / Grid Switcher */}
        <div className="flex items-center gap-1 bg-[var(--app-surface)] border border-[var(--app-border)] p-1 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="عرض قائمة"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#5B5BF7] text-white shadow-xs'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="عرض شبكة"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#5B5BF7] text-white shadow-xs'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Smart Search Input with Clear Button */}
      <div className="relative flex items-center w-full group mb-2">
        <div className="absolute right-3.5 flex items-center pointer-events-none text-[var(--app-text-secondary)] group-focus-within:text-[#5B5BF7] transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="calculators-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="ابحث عن حاسبة..."
          className="w-full h-12 bg-[var(--app-surface)] text-[var(--app-text)] placeholder-[var(--app-text-secondary)]/70 text-xs sm:text-sm font-medium pr-10 pl-10 rounded-2xl border border-[var(--app-border)] focus:border-[#5B5BF7] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            id="btn-clear-calculators-search"
            aria-label="مسح البحث"
            onClick={() => setSearchQuery('')}
            className="absolute left-3 w-6 h-6 rounded-md flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-secondary)] active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Interactive Search Suggestions Dropdown */}
      {isSearchFocused && searchQuery.trim() && searchSuggestions.length > 0 && (
        <SearchSuggestions
          suggestions={searchSuggestions}
          query={searchQuery}
          onSelect={handleSelectFromSuggestion}
          onClose={() => setIsSearchFocused(false)}
        />
      )}

      {/* 3. Category Page Header (When a single category is chosen) */}
      {currentCategoryInfo && (
        <CategoryHeader
          category={currentCategoryInfo}
          count={categoryTotalCount}
          onBackToAll={() => setSelectedCategory('all')}
        />
      )}

      {/* 4. Horizontal Categories Filter Bar */}
      <div
        id="category-filter-bar"
        className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-2.5 mb-2"
      >
        <button
          type="button"
          id="filter-chip-all"
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white shadow-sm shadow-[#5B5BF7]/30'
              : 'bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:text-[var(--app-text)]'
          }`}
        >
          كل الحاسبات ({CALCULATORS_DATA.length})
        </button>

        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const catCount = CALCULATORS_DATA.filter((c) => c.category === cat.id).length;
          return (
            <button
              key={cat.id}
              id={`filter-chip-${cat.id}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white shadow-sm shadow-[#5B5BF7]/30'
                  : 'bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:text-[var(--app-text)]'
              }`}
            >
              {cat.titleAr} ({catCount})
            </button>
          );
        })}
      </div>

      {/* 5. Sort Selector & Quick Access Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-2 border-b border-[var(--app-border)]/60">
        <SortSelector currentSort={sortType} onSortChange={setSortType} />

        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--app-text-secondary)] mr-auto">
          <span>النتائج:</span>
          <span className="text-[#5B5BF7] dark:text-[#7C6CFF] bg-[#5B5BF7]/10 px-2 py-0.5 rounded-full border border-[#5B5BF7]/20">
            {filteredCalculators.length}
          </span>
        </div>
      </div>

      {/* 6. Quick Discovery Sections (Only on 'all' with no search & default sort) */}
      {selectedCategory === 'all' && !searchQuery.trim() && sortType === 'default' && (
        <QuickDiscoverySection
          popularCalculators={popularCalculators}
          recentCalculators={recentCalculators}
          favoriteCalculators={favoriteCalculators}
          onSelectCalculator={onSelectCalculator}
        />
      )}

      {/* 7. All Matching Calculator Cards List / Grid or Empty State */}
      {filteredCalculators.length > 0 ? (
        <section id="calculators-main-list-section" className="space-y-3">
          {selectedCategory === 'all' && !searchQuery.trim() && sortType === 'default' && (
            <div className="flex items-center justify-between px-1 pt-1">
              <h3 className="text-xs sm:text-sm font-bold text-[var(--app-text)]">
                جميع الحاسبات ({filteredCalculators.length})
              </h3>
            </div>
          )}

          <div
            id="calculators-items-list"
            className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:gap-3' : 'space-y-2.5'}
          >
            {filteredCalculators.map((calc) => (
              <CalculatorCard
                key={calc.id}
                calculator={calc}
                isFavorite={isFavorite(calc.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectCalculator}
                variant={viewMode}
              />
            ))}
          </div>
        </section>
      ) : (
        /* 8. Empty Search State */
        <div
          id="search-empty-state"
          className="w-full flex flex-col items-center justify-center text-center py-12 px-4 bg-[var(--app-surface)] rounded-2xl border border-[var(--app-border)] my-3 shadow-sm"
        >
          <div className="w-13 h-13 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--app-text)]">
            لم نجد ما تبحث عنه
          </h3>
          <p className="text-xs font-medium text-[var(--app-text-secondary)] mt-1 max-w-xs">
            جرّب كلمة مختلفة أو اختر أحد التصنيفات.
          </p>

          <button
            type="button"
            id="btn-show-all-calculators-empty"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white text-xs font-bold shadow-sm shadow-[#5B5BF7]/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض جميع الحاسبات</span>
          </button>
        </div>
      )}

      {/* Centralized Non-intrusive Banner Placement */}
      <BannerAdSlot placement="calculators" />
    </div>
  );
};
