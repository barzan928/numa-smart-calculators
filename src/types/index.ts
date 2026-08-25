export type TabId = 'home' | 'calculators' | 'favorites' | 'history' | 'settings';

export type ThemeMode = 'dark' | 'light';

export type CategoryId =
  | 'all'
  | 'finance'
  | 'math'
  | 'conversions'
  | 'time_date'
  | 'health'
  | 'daily_life';

export type SortType = 'default' | 'popular' | 'name' | 'recent';

export interface NavItem {
  id: TabId;
  label: string;
  labelEn: string;
  iconName: 'Home' | 'Grid' | 'Bookmark' | 'Clock' | 'Settings';
}

export interface CalculatorInputField {
  id: string;
  label: string;
  placeholder: string;
  unit?: string;
  type?: 'number' | 'text' | 'select' | 'date';
  defaultValue?: string;
}

export interface CalculatorItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: CategoryId;
  categoryAr: string;
  iconName: string;
  fields: CalculatorInputField[];
  resultPlaceholder?: string;
  isQuick?: boolean;
  keywords?: string[];
  defaultPopularity?: number;
}

export interface CategoryInfo {
  id: CategoryId;
  titleAr: string;
  titleEn: string;
  description: string;
  iconName: string;
}

export * from './settings';

