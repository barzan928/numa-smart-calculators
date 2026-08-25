import React from 'react';
import { ArrowUpDown, Flame, Type, Clock, Sparkles } from 'lucide-react';
import { SortType } from '../../types';

interface SortSelectorProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const SORT_OPTIONS: { id: SortType; label: string; icon: React.ReactNode }[] = [
  { id: 'default', label: 'الافتراضي', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'popular', label: 'الأكثر استخداماً', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'name', label: 'الاسم (أ-ي)', icon: <Type className="w-3.5 h-3.5" /> },
  { id: 'recent', label: 'الأحدث', icon: <Clock className="w-3.5 h-3.5" /> },
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  currentSort,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--app-text-secondary)] shrink-0 pl-1">
        <ArrowUpDown className="w-3 h-3 text-[#5B5BF7]" />
        <span>الترتيب:</span>
      </div>

      {SORT_OPTIONS.map((opt) => {
        const isSelected = currentSort === opt.id;
        return (
          <button
            key={opt.id}
            id={`sort-btn-${opt.id}`}
            type="button"
            onClick={() => onSortChange(opt.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#5B5BF7] text-white shadow-sm shadow-[#5B5BF7]/30'
                : 'bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:text-[var(--app-text)]'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
