export interface UnitDefinition {
  id: string;
  nameAr: string;
  symbolAr: string;
  symbolEn: string;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

export interface UnitCategoryConfig {
  id: string;
  titleAr: string;
  baseUnit: string;
  units: UnitDefinition[];
  defaultFrom: string;
  defaultTo: string;
}

export const UNIT_CATEGORIES: Record<string, UnitCategoryConfig> = {
  length: {
    id: 'length',
    titleAr: 'تحويل الطول والمسافات',
    baseUnit: 'm',
    defaultFrom: 'm',
    defaultTo: 'cm',
    units: [
      {
        id: 'mm',
        nameAr: 'مليمتر',
        symbolAr: 'ملم',
        symbolEn: 'mm',
        toBase: (v) => v / 1000,
        fromBase: (b) => b * 1000,
      },
      {
        id: 'cm',
        nameAr: 'سنتيمتر',
        symbolAr: 'سم',
        symbolEn: 'cm',
        toBase: (v) => v / 100,
        fromBase: (b) => b * 100,
      },
      {
        id: 'm',
        nameAr: 'متر',
        symbolAr: 'م',
        symbolEn: 'm',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'km',
        nameAr: 'كيلومتر',
        symbolAr: 'كم',
        symbolEn: 'km',
        toBase: (v) => v * 1000,
        fromBase: (b) => b / 1000,
      },
      {
        id: 'in',
        nameAr: 'بوصة (إنش)',
        symbolAr: 'إنش',
        symbolEn: 'in',
        toBase: (v) => v * 0.0254,
        fromBase: (b) => b / 0.0254,
      },
      {
        id: 'ft',
        nameAr: 'قدم',
        symbolAr: 'قدم',
        symbolEn: 'ft',
        toBase: (v) => v * 0.3048,
        fromBase: (b) => b / 0.3048,
      },
      {
        id: 'yd',
        nameAr: 'ياردة',
        symbolAr: 'ياردة',
        symbolEn: 'yd',
        toBase: (v) => v * 0.9144,
        fromBase: (b) => b / 0.9144,
      },
      {
        id: 'mi',
        nameAr: 'ميل',
        symbolAr: 'ميل',
        symbolEn: 'mi',
        toBase: (v) => v * 1609.344,
        fromBase: (b) => b / 1609.344,
      },
    ],
  },

  weight: {
    id: 'weight',
    titleAr: 'تحويل الوزن والكتلة',
    baseUnit: 'kg',
    defaultFrom: 'kg',
    defaultTo: 'g',
    units: [
      {
        id: 'mg',
        nameAr: 'مليغرام',
        symbolAr: 'مجم',
        symbolEn: 'mg',
        toBase: (v) => v / 1000000,
        fromBase: (b) => b * 1000000,
      },
      {
        id: 'g',
        nameAr: 'غرام',
        symbolAr: 'غم',
        symbolEn: 'g',
        toBase: (v) => v / 1000,
        fromBase: (b) => b * 1000,
      },
      {
        id: 'kg',
        nameAr: 'كيلوغرام',
        symbolAr: 'كجم',
        symbolEn: 'kg',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'ton',
        nameAr: 'طن متري',
        symbolAr: 'طن',
        symbolEn: 'ton',
        toBase: (v) => v * 1000,
        fromBase: (b) => b / 1000,
      },
      {
        id: 'oz',
        nameAr: 'أونصة (أوقية)',
        symbolAr: 'أونصة',
        symbolEn: 'oz',
        toBase: (v) => v * 0.028349523125,
        fromBase: (b) => b / 0.028349523125,
      },
      {
        id: 'lb',
        nameAr: 'رطل (باوند)',
        symbolAr: 'رطل',
        symbolEn: 'lb',
        toBase: (v) => v * 0.45359237,
        fromBase: (b) => b / 0.45359237,
      },
    ],
  },

  area: {
    id: 'area',
    titleAr: 'تحويل المساحة',
    baseUnit: 'sqm',
    defaultFrom: 'sqm',
    defaultTo: 'sqft',
    units: [
      {
        id: 'sqcm',
        nameAr: 'سنتيمتر مربع',
        symbolAr: 'سم²',
        symbolEn: 'cm²',
        toBase: (v) => v / 10000,
        fromBase: (b) => b * 10000,
      },
      {
        id: 'sqm',
        nameAr: 'متر مربع',
        symbolAr: 'م²',
        symbolEn: 'm²',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'sqkm',
        nameAr: 'كيلومتر مربع',
        symbolAr: 'كم²',
        symbolEn: 'km²',
        toBase: (v) => v * 1000000,
        fromBase: (b) => b / 1000000,
      },
      {
        id: 'sqft',
        nameAr: 'قدم مربع',
        symbolAr: 'قدم²',
        symbolEn: 'ft²',
        toBase: (v) => v * 0.09290304,
        fromBase: (b) => b / 0.09290304,
      },
      {
        id: 'acre',
        nameAr: 'فدان / آكر',
        symbolAr: 'فدان',
        symbolEn: 'acre',
        toBase: (v) => v * 4046.8564224,
        fromBase: (b) => b / 4046.8564224,
      },
      {
        id: 'hectare',
        nameAr: 'هكتار',
        symbolAr: 'هكتار',
        symbolEn: 'ha',
        toBase: (v) => v * 10000,
        fromBase: (b) => b / 10000,
      },
    ],
  },

  volume: {
    id: 'volume',
    titleAr: 'تحويل الحجم والسعة',
    baseUnit: 'l',
    defaultFrom: 'l',
    defaultTo: 'ml',
    units: [
      {
        id: 'ml',
        nameAr: 'مليلتر',
        symbolAr: 'مل',
        symbolEn: 'ml',
        toBase: (v) => v / 1000,
        fromBase: (b) => b * 1000,
      },
      {
        id: 'l',
        nameAr: 'لتر',
        symbolAr: 'لتر',
        symbolEn: 'L',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'cbm',
        nameAr: 'متر مكعب',
        symbolAr: 'م³',
        symbolEn: 'm³',
        toBase: (v) => v * 1000,
        fromBase: (b) => b / 1000,
      },
      {
        id: 'gal',
        nameAr: 'غالون (أمريكي)',
        symbolAr: 'غالون',
        symbolEn: 'gal',
        toBase: (v) => v * 3.785411784,
        fromBase: (b) => b / 3.785411784,
      },
      {
        id: 'cup',
        nameAr: 'كوب معياري',
        symbolAr: 'كوب',
        symbolEn: 'cup',
        toBase: (v) => v * 0.24,
        fromBase: (b) => b / 0.24,
      },
      {
        id: 'floz',
        nameAr: 'أونصة سائلة',
        symbolAr: 'أونصة سائلة',
        symbolEn: 'fl oz',
        toBase: (v) => v * 0.0295735,
        fromBase: (b) => b / 0.0295735,
      },
    ],
  },

  temperature: {
    id: 'temperature',
    titleAr: 'تحويل درجة الحرارة',
    baseUnit: 'c',
    defaultFrom: 'c',
    defaultTo: 'f',
    units: [
      {
        id: 'c',
        nameAr: 'مئوية (سيليزيوس)',
        symbolAr: '°C',
        symbolEn: '°C',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'f',
        nameAr: 'فهرنهايت',
        symbolAr: '°F',
        symbolEn: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (b) => (b * 9) / 5 + 32,
      },
      {
        id: 'k',
        nameAr: 'كلفن',
        symbolAr: 'K',
        symbolEn: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (b) => b + 273.15,
      },
    ],
  },

  speed: {
    id: 'speed',
    titleAr: 'تحويل السرعة',
    baseUnit: 'kmh',
    defaultFrom: 'kmh',
    defaultTo: 'ms',
    units: [
      {
        id: 'kmh',
        nameAr: 'كيلومتر / ساعة',
        symbolAr: 'كم/س',
        symbolEn: 'km/h',
        toBase: (v) => v,
        fromBase: (b) => b,
      },
      {
        id: 'ms',
        nameAr: 'متر / ثانية',
        symbolAr: 'م/ث',
        symbolEn: 'm/s',
        toBase: (v) => v * 3.6,
        fromBase: (b) => b / 3.6,
      },
      {
        id: 'mph',
        nameAr: 'ميل / ساعة',
        symbolAr: 'ميل/س',
        symbolEn: 'mph',
        toBase: (v) => v * 1.609344,
        fromBase: (b) => b / 1.609344,
      },
      {
        id: 'knot',
        nameAr: 'عقدة بحرية',
        symbolAr: 'عقدة',
        symbolEn: 'kn',
        toBase: (v) => v * 1.852,
        fromBase: (b) => b / 1.852,
      },
    ],
  },
};
