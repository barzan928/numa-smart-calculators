export type AppTheme = 'dark' | 'light' | 'system';
export type AppLanguage = 'ar' | 'en';
export type CurrencyCode = 'IQD' | 'USD' | 'EUR' | 'SAR' | 'AED';

export interface CurrencyItem {
  code: CurrencyCode;
  symbol: string;
  nameAr: string;
  nameEn: string;
}

export const AVAILABLE_CURRENCIES: CurrencyItem[] = [
  { code: 'IQD', symbol: 'د.ع', nameAr: 'الدينار العراقي', nameEn: 'Iraqi Dinar' },
  { code: 'USD', symbol: '$', nameAr: 'الدولار الأمريكي', nameEn: 'US Dollar' },
  { code: 'EUR', symbol: '€', nameAr: 'اليورو الأوروبي', nameEn: 'Euro' },
  { code: 'SAR', symbol: 'ر.س', nameAr: 'الريال السعودي', nameEn: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', nameAr: 'الدرهم الإماراتي', nameEn: 'UAE Dirham' },
];

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  currency: CurrencyCode;
  useThousandsSeparator: boolean;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'ar',
  currency: 'IQD',
  useThousandsSeparator: true,
  notificationsEnabled: true,
};

export const APP_CONFIG = {
  name: 'NUMA',
  tagline: 'Smart Calculators',
  taglineAr: 'حاسبات ذكية وشاملة',
  version: '1.0.0',
  descriptionAr:
    'مجموعة أدوات وحاسبات ذكية تساعدك على إنجاز الحسابات اليومية والمالية والرياضية بسرعة ودقة وسهولة.',
  descriptionEn:
    'A suite of smart and fast calculators to help you perform daily, financial, mathematical, and health calculations with ease and precision.',
  supportEmail: 'support@numa.app',
  developer: 'NUMA Team',
  releaseYear: '2026',
};
