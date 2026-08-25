export type CurrencyCode = 'IQD' | 'USD' | 'EUR' | 'SAR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  nameAr: string;
  nameEn: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IQD: { code: 'IQD', symbol: 'د.ع', nameAr: 'دينار عراقي', nameEn: 'Iraqi Dinar' },
  USD: { code: 'USD', symbol: '$', nameAr: 'دولار أمريكي', nameEn: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', nameAr: 'يورو', nameEn: 'Euro' },
  SAR: { code: 'SAR', symbol: 'ر.س', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal' },
  AED: { code: 'AED', symbol: 'د.إ', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham' },
};

export const DEFAULT_CURRENCY: CurrencyConfig = CURRENCIES.IQD;

export interface CalculationResultDetail {
  label: string;
  value: string;
  isHighlighted?: boolean;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export interface CalculationResult {
  title?: string;
  primaryValue: string;
  primaryUnit?: string;
  secondaryLabel?: string;
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'error' | 'primary' | 'neutral';
  };
  details: CalculationResultDetail[];
  shareText: string;
  copyText: string;
}

export interface HistoryItem {
  id: string;
  calculatorId: string;
  calculatorNameAr: string;
  timestamp: number;
  primaryResult: string;
  primaryUnit?: string;
  badgeText?: string;
  inputsSummary: string;
  inputs: Record<string, any>;
  details: CalculationResultDetail[];
}
