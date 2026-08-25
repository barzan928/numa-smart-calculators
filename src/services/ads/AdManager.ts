import {
  AdSystemConfig,
  DEFAULT_AD_CONFIG,
  AdPlacementId,
} from './AdConfig';
import { AdFrequencyManager } from './AdFrequencyManager';
import { adConsentManager, AdConsentManager } from './AdConsentManager';
import { nativeAdMobProvider, NativeAdMobProvider } from './AdProvider';
import { analyticsBridge } from './AnalyticsBridge';

export interface AdManagerStatus {
  adsEnabled: boolean;
  premiumEnabled: boolean;
  developmentMode: boolean;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  rewardedEnabled: boolean;
  currentBannerPlacement: AdPlacementId | null;
  frequencyStatus: ReturnType<AdFrequencyManager['getStatus']>;
  consentStatus: string;
  isNativeBridgeConnected: boolean;
  adReady: boolean;
}

export type InterstitialAdListener = (isOpen: boolean, onCloseCallback: () => void) => void;

export class AdManager {
  private static instance: AdManager;
  private config: AdSystemConfig;
  private frequencyManager: AdFrequencyManager;
  private consentManager: AdConsentManager;
  private nativeProvider: NativeAdMobProvider;
  private currentBannerPlacement: AdPlacementId | null = null;
  private isInitialized: boolean = false;
  private interstitialListener: InterstitialAdListener | null = null;

  private constructor() {
    this.config = { ...DEFAULT_AD_CONFIG };
    this.frequencyManager = new AdFrequencyManager(this.config.frequency);
    this.consentManager = adConsentManager;
    this.nativeProvider = nativeAdMobProvider;
    this.loadPersistedSettings();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  private loadPersistedSettings(): void {
    try {
      const stored = localStorage.getItem('numa_ad_settings_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.premiumEnabled === 'boolean') {
          this.config.premiumEnabled = parsed.premiumEnabled;
        }
      }
    } catch {
      // Ignore
    }
  }

  private persistSettings(): void {
    try {
      localStorage.setItem(
        'numa_ad_settings_v1',
        JSON.stringify({
          premiumEnabled: this.config.premiumEnabled,
        })
      );
    } catch {
      // Ignore
    }
  }

  /**
   * Initializes the ad subsystem
   */
  public async initializeAds(customConfig?: Partial<AdSystemConfig>): Promise<boolean> {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
      this.frequencyManager.updateConfig(this.config.frequency);
    }

    // Request consent update asynchronously
    await this.consentManager.requestConsentInfoUpdate();

    // In Android environment, initialize native AdMob app
    const appId = this.config.developmentMode ? 'test-app-id' : 'ca-app-pub-placeholder';
    await this.nativeProvider.initialize(appId);

    this.isInitialized = true;
    return true;
  }

  /**
   * Register a listener for showing the web/test Interstitial overlay modal
   */
  public setInterstitialListener(listener: InterstitialAdListener | null): void {
    this.interstitialListener = listener;
  }

  /**
   * Master check if advertising is active for the current user
   */
  public isAdsEnabled(): boolean {
    if (!this.config.adsEnabled) return false;
    if (this.config.premiumEnabled) return false;
    return true;
  }

  /**
   * Premium check
   */
  public isPremium(): boolean {
    return this.config.premiumEnabled;
  }

  /**
   * Toggle premium status (e.g. ad-free pass or test toggle)
   */
  public setPremium(isPremium: boolean): void {
    this.config.premiumEnabled = isPremium;
    this.persistSettings();
    if (isPremium) {
      this.hideBanner();
    }
  }

  /**
   * Check / update Ad Ready status
   */
  public isAdReady(): boolean {
    return this.frequencyManager.isAdReady();
  }

  public setAdReady(ready: boolean): void {
    this.frequencyManager.setAdReady(ready);
  }

  /**
   * Get active ad unit ID based on development vs production
   */
  private getAdUnit(type: 'banner' | 'interstitial' | 'rewarded'): string {
    const units = this.config.developmentMode ? this.config.testAdUnits : this.config.prodAdUnits;
    if (type === 'banner') return units.bannerId;
    if (type === 'interstitial') return units.interstitialId;
    return units.rewardedId;
  }

  /**
   * Displays a banner on supported page placements
   */
  public async showBanner(placement: AdPlacementId): Promise<boolean> {
    if (!this.isAdsEnabled() || !this.config.bannerEnabled) {
      return false;
    }

    // Check placement configuration
    const placementKey = `${placement}Banner` as keyof typeof this.config.placements;
    if (!this.config.placements[placementKey]) {
      return false;
    }

    this.currentBannerPlacement = placement;
    const unitId = this.getAdUnit('banner');
    const shown = await this.nativeProvider.showBanner(placement, unitId);

    if (shown) {
      analyticsBridge.trackAdShown('banner', placement);
    }
    return shown;
  }

  /**
   * Hides the current banner ad
   */
  public async hideBanner(): Promise<boolean> {
    this.currentBannerPlacement = null;
    return await this.nativeProvider.hideBanner();
  }

  /**
   * Notify manager of a successful user calculation event
   * Sequence:
   * 1. Result rendered & saved in history
   * 2. Counter increments (successfulCalculationCount += 1)
   * 3. If count reaches 5 (and cooldown passed and ad ready), triggers Interstitial gracefully
   */
  public onCalculationPerformed(calculatorId: string, category: string): void {
    const { count, reachedThreshold } = this.frequencyManager.recordSuccessfulCalculation();
    analyticsBridge.trackCalculatorUsed(calculatorId, category);

    // If threshold reached and ads enabled, attempt to show interstitial after natural delay
    if (this.isAdsEnabled() && this.config.interstitialEnabled && reachedThreshold) {
      // Small timeout ensuring UI rendering of the result is completely settled first
      setTimeout(() => {
        this.attemptInterstitialIfAllowed('calculator_threshold_5');
      }, 700);
    }
  }

  /**
   * Internal helper to attempt displaying an interstitial if all cooldown and readiness rules allow it
   */
  private async attemptInterstitialIfAllowed(context: string): Promise<boolean> {
    if (!this.isAdsEnabled() || !this.config.interstitialEnabled) {
      return false;
    }

    const check = this.frequencyManager.canShowInterstitial();
    if (!check.allowed) {
      return false;
    }

    return await this.executeShowInterstitial(context);
  }

  /**
   * Executes the actual display of the interstitial (via native bridge or web test modal)
   */
  private executeShowInterstitial(context: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (this.nativeProvider.isNativeBridgeAvailable()) {
          const unitId = this.getAdUnit('interstitial');
          this.nativeProvider.showInterstitial(unitId).then((success) => {
            if (success) {
              this.frequencyManager.recordInterstitialShown();
              analyticsBridge.trackAdShown('interstitial', context);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else if (this.interstitialListener) {
          // Web test environment: trigger the visual AdMob Test Interstitial modal
          this.interstitialListener(true, () => {
            this.frequencyManager.recordInterstitialShown();
            analyticsBridge.trackAdShown('interstitial', context);
            resolve(true);
          });
        } else {
          // Graceful fallback in headless mode
          this.frequencyManager.recordInterstitialShown();
          analyticsBridge.trackAdShown('interstitial', context);
          resolve(true);
        }
      } catch (err) {
        console.warn('[AdManager] Interstitial execution error:', err);
        resolve(false);
      }
    });
  }

  /**
   * Explicitly requests to show an interstitial ad (e.g. from debug card)
   */
  public async showInterstitial(context: string = 'general'): Promise<{ shown: boolean; reason?: string }> {
    if (!this.isAdsEnabled() || !this.config.interstitialEnabled) {
      return { shown: false, reason: 'Ads or Interstitials are disabled' };
    }

    const check = this.frequencyManager.canShowInterstitial();
    if (!check.allowed) {
      return { shown: false, reason: check.reason };
    }

    const shown = await this.executeShowInterstitial(context);
    if (shown) {
      return { shown: true };
    }

    return { shown: false, reason: 'Failed to display interstitial' };
  }

  /**
   * Reset calculation counter (for testing)
   */
  public resetCalculationCounter(): void {
    this.frequencyManager.resetCalculationCount();
  }

  /**
   * Requests an opt-in rewarded ad
   */
  public async showRewarded(options: {
    rewardType?: string;
    onRewardEarned: () => void;
    onAdClosed?: () => void;
  }): Promise<{ shown: boolean; rewarded: boolean }> {
    if (!this.isAdsEnabled() || !this.config.rewardedEnabled) {
      options.onAdClosed?.();
      return { shown: false, rewarded: false };
    }

    const unitId = this.getAdUnit('rewarded');
    const result = await this.nativeProvider.showRewarded(unitId);

    if (result.earned) {
      const rewardType = options.rewardType || 'ad_free_reward';
      analyticsBridge.trackAdRewardEarned(rewardType);
      options.onRewardEarned();
      options.onAdClosed?.();
      return { shown: true, rewarded: true };
    }

    options.onAdClosed?.();
    return { shown: true, rewarded: false };
  }

  /**
   * Returns current diagnostic and debug status
   */
  public getStatus(): AdManagerStatus {
    return {
      adsEnabled: this.config.adsEnabled,
      premiumEnabled: this.config.premiumEnabled,
      developmentMode: this.config.developmentMode,
      bannerEnabled: this.config.bannerEnabled,
      interstitialEnabled: this.config.interstitialEnabled,
      rewardedEnabled: this.config.rewardedEnabled,
      currentBannerPlacement: this.currentBannerPlacement,
      frequencyStatus: this.frequencyManager.getStatus(),
      consentStatus: this.consentManager.getConsentStatus(),
      isNativeBridgeConnected: this.nativeProvider.isNativeBridgeAvailable(),
      adReady: this.frequencyManager.isAdReady(),
    };
  }

  public getConfig(): AdSystemConfig {
    return this.config;
  }
}

export const adManager = AdManager.getInstance();
