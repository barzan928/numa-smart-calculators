export type AdPlacementId = 'home' | 'calculators' | 'category' | 'history' | 'favorites';

export type AdConsentStatus = 'UNKNOWN' | 'REQUIRED' | 'OBTAINED' | 'NOT_REQUIRED' | 'DENIED';

export interface AdUnitConfig {
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
}

export interface AdFrequencyConfig {
  /** Minimum seconds that must elapse between two interstitial ads (2 minutes = 120s) */
  minIntervalSeconds: number;
  /** Number of successful calculations required to trigger an interstitial */
  calculationTriggerInterval: number;
  /** Maximum number of interstitial ads per app session */
  maxInterstitialsPerSession: number;
}

export interface AdPlacementConfig {
  homeBanner: boolean;
  calculatorsBanner: boolean;
  categoryBanner: boolean;
  historyBanner: boolean;
  favoritesBanner: boolean;
}

export interface AdSystemConfig {
  /** Master switch for ads across the entire app */
  adsEnabled: boolean;
  /** Toggle banner ads */
  bannerEnabled: boolean;
  /** Toggle interstitial (full-screen) ads */
  interstitialEnabled: boolean;
  /** Toggle rewarded (opt-in) ads */
  rewardedEnabled: boolean;
  /** When true, ads are completely turned off (e.g. for premium/ad-free users) */
  premiumEnabled: boolean;
  /** Development mode uses safe test placeholders and logs events without calling real networks */
  developmentMode: boolean;
  /** Per-placement toggle flags */
  placements: AdPlacementConfig;
  /** Frequency and pacing rules */
  frequency: AdFrequencyConfig;
  /** Ad unit IDs (Standard official AdMob test identifiers used in development) */
  testAdUnits: AdUnitConfig;
  /** Ad unit IDs for production (Placeholders to be configured during Android release) */
  prodAdUnits: AdUnitConfig;
}

export const DEFAULT_AD_CONFIG: AdSystemConfig = {
  adsEnabled: true,
  bannerEnabled: true,
  interstitialEnabled: true,
  rewardedEnabled: true,
  premiumEnabled: false,
  developmentMode: true, // Safe default for web preview / development

  placements: {
    homeBanner: true,
    calculatorsBanner: true,
    categoryBanner: true,
    historyBanner: true,
    favoritesBanner: true,
  },

  frequency: {
    minIntervalSeconds: 120, // 2 minutes cooldown between interstitials
    calculationTriggerInterval: 5, // Trigger interstitial every 5 successful calculations
    maxInterstitialsPerSession: 10, // Safe session limit
  },

  // Official Google AdMob sample test unit IDs (Safe for testing / mock Android builds)
  testAdUnits: {
    bannerId: 'ca-app-pub-3940256099942544/9214589741',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  },

  // Production placeholder IDs - To be replaced when deploying official Android APK
  prodAdUnits: {
    bannerId: 'ADMOB_BANNER_PLACEHOLDER_ID',
    interstitialId: 'ADMOB_INTERSTITIAL_PLACEHOLDER_ID',
    rewardedId: 'ADMOB_REWARDED_PLACEHOLDER_ID',
  },
};
