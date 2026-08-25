import React from 'react';
import { Calculator, Moon, Sun, Bell } from 'lucide-react';
import { ThemeMode } from '../../types';

interface HeaderProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme = 'dark',
  onToggleTheme,
  onOpenSettings,
}) => {
  return (
    <header
      id="numa-header"
      className="w-full pt-5 pb-3.5 flex items-center justify-between border-b border-[var(--app-border)] transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Brand Logo Badge with subtle gradient & glow */}
        <div
          id="brand-logo-badge"
          className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B5BF7] to-[#7C4DFF] p-[1px] shadow-sm shadow-[#5B5BF7]/20 flex items-center justify-center text-white"
        >
          <div className="w-full h-full rounded-[15px] bg-[#10152A]/40 backdrop-blur-sm flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white stroke-[2.3]" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span
              id="brand-name"
              className="text-xl font-extrabold tracking-tight text-[var(--app-text)] font-sans"
            >
              NUMA
            </span>
            <span
              id="brand-smart-badge"
              className="text-[10px] font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2 py-0.5 rounded-full border border-[#5B5BF7]/20"
            >
              PRO
            </span>
          </div>
          <span
            id="brand-tagline"
            className="text-[11px] font-medium text-[var(--app-text-secondary)] tracking-wide -mt-0.5"
          >
            Smart Calculators
          </span>
        </div>
      </div>

      {/* Action Buttons: Theme Toggle & Notifications */}
      <div className="flex items-center gap-1.5">
        {onToggleTheme && (
          <button
            type="button"
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            className="w-9 h-9 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:border-[var(--app-border-hover)] active:scale-95 transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFB020] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#5B5BF7] transition-transform hover:-rotate-12" />
            )}
          </button>
        )}

        <button
          type="button"
          id="btn-header-bell"
          onClick={onOpenSettings}
          aria-label="التنبيهات والإعدادات"
          className="w-9 h-9 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:border-[var(--app-border-hover)] active:scale-95 transition-all cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
        </button>
      </div>
    </header>
  );
};
