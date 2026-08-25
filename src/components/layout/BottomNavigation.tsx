import React from 'react';
import { Home, LayoutGrid, Bookmark, History, Settings } from 'lucide-react';
import { NavItem, TabId } from '../../types';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  language?: 'ar' | 'en';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', labelEn: 'Home', iconName: 'Home' },
  { id: 'calculators', label: 'الحاسبات', labelEn: 'Calculators', iconName: 'Grid' },
  { id: 'favorites', label: 'المفضلة', labelEn: 'Favorites', iconName: 'Bookmark' },
  { id: 'history', label: 'السجل', labelEn: 'History', iconName: 'Clock' },
  { id: 'settings', label: 'الإعدادات', labelEn: 'Settings', iconName: 'Settings' },
];

const renderNavIcon = (iconName: NavItem['iconName'], isActive: boolean) => {
  const iconProps = {
    className: `w-[19px] h-[19px] transition-transform duration-200 ${
      isActive ? 'text-[#5B5BF7] dark:text-[#7C6CFF] scale-105 stroke-[2.3]' : 'text-[var(--app-text-secondary)] stroke-[1.8]'
    }`,
  };

  switch (iconName) {
    case 'Home':
      return <Home {...iconProps} />;
    case 'Grid':
      return <LayoutGrid {...iconProps} />;
    case 'Bookmark':
      return <Bookmark {...iconProps} />;
    case 'Clock':
      return <History {...iconProps} />;
    case 'Settings':
      return <Settings {...iconProps} />;
    default:
      return <Home {...iconProps} />;
  }
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language = 'ar',
}) => {
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="التنقل الرئيسي"
      className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="w-full max-w-[440px] bg-[var(--app-nav-bg)] backdrop-blur-xl border border-[var(--app-border)] rounded-2xl shadow-xl shadow-black/20 px-2 py-1.5 flex items-center justify-around pointer-events-auto transition-all">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const displayLabel = language === 'en' ? item.labelEn : item.label;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#5B5BF7]/10 dark:bg-[#5B5BF7]/15 text-[#5B5BF7] dark:text-[#7C6CFF]'
                  : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1 w-5 h-0.5 rounded-full bg-gradient-to-r from-[#5B5BF7] to-[#00D4FF]" />
              )}

              <div className="mt-0.5">{renderNavIcon(item.iconName, isActive)}</div>

              <span
                className={`text-[10.5px] mt-0.5 leading-none transition-colors ${
                  isActive ? 'font-bold text-[#5B5BF7] dark:text-[#7C6CFF]' : 'font-medium text-[var(--app-text-secondary)]'
                }`}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
