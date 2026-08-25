import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CategoryInfo } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';

interface CategoryHeaderProps {
  category: CategoryInfo;
  count: number;
  onBackToAll: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  count,
  onBackToAll,
}) => {
  return (
    <div
      id={`category-page-header-${category.id}`}
      className="w-full relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-[var(--app-surface)] border border-[var(--app-border)] mb-4 shadow-sm"
    >
      {/* Top action: Back to all categories button */}
      <div className="flex items-center justify-between mb-3.5">
        <button
          type="button"
          onClick={onBackToAll}
          id="btn-back-to-all-categories"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] bg-[#5B5BF7]/10 hover:bg-[#5B5BF7]/20 border border-[#5B5BF7]/20 transition-all cursor-pointer active:scale-95"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>كل التصنيفات</span>
        </button>

        {/* Real Calculator Count Badge */}
        <span
          id={`category-count-badge-${category.id}`}
          className="text-xs font-bold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-2.5 py-1 rounded-full border border-[var(--app-border)]"
        >
          {count} حاسبات
        </span>
      </div>

      {/* Main Header Content */}
      <div className="flex items-start gap-3.5">
        {/* Prominent Category Icon */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#5B5BF7] to-[#7C4DFF] flex items-center justify-center text-white shadow-md shadow-[#5B5BF7]/25">
          <DynamicIcon name={category.iconName} className="w-7 h-7" />
        </div>

        {/* Title and Detailed Description */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h2
            id={`category-page-title-${category.id}`}
            className="text-lg sm:text-xl font-extrabold text-[var(--app-text)] tracking-tight leading-snug"
          >
            {category.titleAr}
          </h2>
          <p
            id={`category-page-desc-${category.id}`}
            className="text-xs sm:text-sm font-medium text-[var(--app-text-secondary)] mt-1 leading-relaxed"
          >
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};
