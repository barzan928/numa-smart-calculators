import React from 'react';
import { ThemeMode } from '../../types';

interface AppShellProps {
  children: React.ReactNode;
  theme?: ThemeMode;
  dir?: 'rtl' | 'ltr';
}

export const AppShell: React.FC<AppShellProps> = ({ children, theme = 'dark', dir = 'rtl' }) => {
  return (
    <div
      id="numa-app-container"
      dir={dir}
      className={`w-full min-h-screen flex justify-center selection:bg-[#5B5BF7]/30 selection:text-white transition-colors duration-200 ${
        theme === 'light' ? 'light-theme bg-[#F7F8FC] text-[#0F172A]' : 'bg-[#070A14] text-[#F8FAFF]'
      }`}
    >
      {/* Mobile-first centered frame container with smooth borders and subtle shadow */}
      <main
        id="numa-mobile-frame"
        className="w-full max-w-[480px] min-h-screen flex flex-col relative pb-28 px-4 sm:px-5"
      >
        {children}
      </main>
    </div>
  );
};
