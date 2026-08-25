import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';

interface SearchSuggestionsProps {
  suggestions: CalculatorItem[];
  query: string;
  onSelect: (calculator: CalculatorItem) => void;
  onClose: () => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  query,
  onSelect,
}) => {
  if (!query || suggestions.length === 0) return null;

  return (
    <div
      id="search-suggestions-dropdown"
      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl p-2 shadow-lg mb-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-20"
    >
      <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-[var(--app-text-secondary)] border-b border-[var(--app-border)]/60 mb-1">
        <span className="flex items-center gap-1">
          <Search className="w-3 h-3 text-[#5B5BF7]" />
          <span>اقتراحات سريعة</span>
        </span>
        <span>{suggestions.length} نتائج</span>
      </div>

      {suggestions.map((item) => (
        <button
          key={item.id}
          id={`suggestion-item-${item.id}`}
          type="button"
          onClick={() => onSelect(item)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-secondary)] group-hover:bg-[#5B5BF7]/10 flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] shrink-0 transition-colors">
              <DynamicIcon name={item.iconName} className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] truncate">
                {item.nameAr}
              </span>
              <span className="text-[10px] text-[var(--app-text-secondary)] truncate">
                {item.categoryAr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pr-2">
            <span className="text-[10px] font-semibold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-1.5 py-0.5 rounded border border-[var(--app-border)]">
              {item.categoryAr}
            </span>
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--app-text-secondary)] group-hover:text-[#5B5BF7] group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
};
