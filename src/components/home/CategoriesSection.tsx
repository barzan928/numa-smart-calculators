import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { CategoryId } from '../../types';
import { CATEGORIES_DATA, CALCULATORS_DATA } from '../../data/calculators';
import { DynamicIcon } from '../common/DynamicIcon';

interface CategoriesSectionProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="pt-4 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="categories-title"
          className="text-sm sm:text-base font-bold text-[var(--app-text)]"
        >
          التصنيفات
        </h2>
        <span className="text-xs font-medium text-[var(--app-text-secondary)]">
          {CATEGORIES_DATA.length} أقسام رئيسية
        </span>
      </div>

      {/* Modern 2-Column Grid */}
      <div id="categories-grid" className="grid grid-cols-2 gap-3">
        {CATEGORIES_DATA.map((cat) => {
          const count = CALCULATORS_DATA.filter((c) => c.category === cat.id).length;

          return (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                }
              }}
              className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-border-hover)] hover:bg-[var(--app-surface-secondary)] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none text-right"
            >
              {/* Top row: Category Icon + Arrow */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] dark:text-[#7C6CFF] group-hover:bg-[#5B5BF7]/10 group-hover:border-[#5B5BF7]/30 transition-colors">
                  <DynamicIcon name={cat.iconName} className="w-5 h-5" />
                </div>

                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--app-text-secondary)]/40 group-hover:text-[#5B5BF7] group-hover:-translate-x-0.5 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Category Title & Count */}
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] dark:group-hover:text-[#7C6CFF] transition-colors truncate">
                  {cat.titleAr}
                </h3>
                <p className="text-[11px] font-medium text-[var(--app-text-secondary)] mt-0.5">
                  {count} حاسبات ذكية
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
