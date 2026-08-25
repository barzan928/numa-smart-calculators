/**
 * NUMA Design System Tokens
 * Mobile-first mathematical design tokens with Dark & Light theme palettes.
 */

export const THEME_TOKENS = {
  dark: {
    background: '#070A14',
    surface: '#10152A',
    surfaceSecondary: '#151B35',
    primary: '#5B5BF7',
    primaryLight: '#7C6CFF',
    accent: '#00D4FF',
    success: '#19C37D',
    warning: '#FFB020',
    error: '#FF5C77',
    text: '#F8FAFF',
    textSecondary: '#A7B0C3',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    cardShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
  },
  light: {
    background: '#F7F8FC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    primary: '#5146E5',
    primaryLight: '#6366F1',
    accent: '#0284C7',
    success: '#16A34A',
    warning: '#D97706',
    error: '#E11D48',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.16)',
    cardShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #5B5BF7 0%, #7C4DFF 100%)',
    accent: 'linear-gradient(135deg, #00D4FF 0%, #5B5BF7 100%)',
    purpleCard: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(91, 91, 247, 0.05) 100%)',
    blueCard: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(91, 91, 247, 0.05) 100%)',
    greenCard: 'linear-gradient(135deg, rgba(25, 195, 125, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
    orangeCard: 'linear-gradient(135deg, rgba(255, 176, 32, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
  },
  quickColors: {
    discount: {
      accent: '#9D62FF',
      bg: 'rgba(157, 98, 255, 0.12)',
      border: 'rgba(157, 98, 255, 0.25)',
      badge: 'خصم',
    },
    percentage: {
      accent: '#00D4FF',
      bg: 'rgba(0, 212, 255, 0.12)',
      border: 'rgba(0, 212, 255, 0.25)',
      badge: 'نسبة',
    },
    profit: {
      accent: '#19C37D',
      bg: 'rgba(25, 195, 125, 0.12)',
      border: 'rgba(25, 195, 125, 0.25)',
      badge: 'أرباح',
    },
    installments: {
      accent: '#FFB020',
      bg: 'rgba(255, 176, 32, 0.12)',
      border: 'rgba(255, 176, 32, 0.25)',
      badge: 'أقساط',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    pill: '9999px',
  },
  touchTarget: '44px',
} as const;

export const APP_CONFIG = {
  name: 'NUMA',
  tagline: 'Smart Calculators',
  taglineAr: 'الحاسبات الذكية',
  version: '1.0.0',
  defaultLanguage: 'ar',
  defaultTheme: 'dark',
} as const;
