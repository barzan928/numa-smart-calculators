import React from 'react';
import { Sparkles } from 'lucide-react';

export const GreetingSection: React.FC = () => {
  return (
    <section id="greeting-section" className="pt-5 pb-3">
      {/* Welcome Pill */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5B5BF7]/10 border border-[#5B5BF7]/20 text-[#5B5BF7] dark:text-[#7C6CFF] text-xs font-semibold mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>مرحباً بك في NUMA</span>
      </div>

      {/* Main Heading */}
      <h1
        id="main-greeting-title"
        className="text-2xl font-extrabold text-[var(--app-text)] leading-tight tracking-tight"
      >
        ماذا تريد أن تحسب اليوم؟
      </h1>

      <p
        id="main-greeting-subtitle"
        className="text-xs font-medium text-[var(--app-text-secondary)] mt-1.5"
      >
        احسب بسرعة وببساطة وبدقة عالية مع أكثر من 20 أداة ذكية
      </p>
    </section>
  );
};
