import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onFilterClick,
  showFilterButton = true,
  placeholder = 'ابحث عن حاسبة...',
}) => {
  return (
    <div id="search-bar-container" className="my-2 relative">
      <div className="flex items-center gap-2 w-full">
        {/* Search input container */}
        <div className="relative flex-1 flex items-center group">
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[var(--app-text-secondary)] group-focus-within:text-[#5B5BF7] transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            id="calculator-search-input"
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 bg-[var(--app-surface)] text-[var(--app-text)] placeholder-[var(--app-text-secondary)]/70 text-xs sm:text-sm font-medium pr-10 pl-10 rounded-2xl border border-[var(--app-border)] focus:border-[#5B5BF7] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 shadow-sm transition-all"
          />

          {value && (
            <button
              type="button"
              id="btn-clear-search"
              aria-label="مسح البحث"
              onClick={() => onChange?.('')}
              className="absolute left-3 w-6 h-6 rounded-md flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-secondary)] active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {showFilterButton && onFilterClick && (
          <button
            type="button"
            id="btn-search-filter"
            onClick={onFilterClick}
            aria-label="تصفية التصنيفات"
            className="h-12 w-12 shrink-0 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[#5B5BF7] active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

