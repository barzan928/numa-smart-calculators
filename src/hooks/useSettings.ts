import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS, AppTheme } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'numa_settings_v1';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<'dark' | 'light'>(getSystemTheme());

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective theme (dark or light)
  const effectiveTheme: 'dark' | 'light' =
    settings.theme === 'system' ? systemPrefersDark : settings.theme;

  // Persist settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage:', e);
    }

    // Set document direction and language attribute
    if (typeof document !== 'undefined') {
      document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = settings.language;
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setTheme = useCallback((theme: AppTheme) => {
    updateSetting('theme', theme);
  }, [updateSetting]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    effectiveTheme,
    updateSetting,
    setTheme,
    resetSettings,
  };
}
