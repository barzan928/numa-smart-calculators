import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  AdMobError,
} from '@capacitor-community/admob';
import { adManager } from '../ads/AdManager';
import { DEFAULT_AD_CONFIG } from '../ads/AdConfig';

export class AdMobBridge {
  private static isInitialized = false;
  private static isInterstitialLoaded = false;
  private static isInterstitialLoading = false;
  private static isBannerShowing = false;
  private static activePlacement: string | null = null;
  private static hasRegisteredListeners = false;

  /**
   * Check if running on Android or iOS native platform
   */
  public static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Initializes the Google Mobile Ads SDK on native platform
   */
  public static async initializeAds(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      // In web preview, initialize central AdManager in test/preview mode
      await adManager.initializeAds();
      return true;
    }

    if (this.isInitialized) {
      return true;
    }

    try {
      await AdMob.initialize({
        initializeForTesting: true,
      });

      this.isInitialized = true;
      this.setupAdMobEventListeners();

      // Preload the first interstitial ad in the background
      this.preloadInterstitial();

      return true;
    } catch (err) {
      console.warn('[AdMobBridge] Native AdMob initialization error:', err);
      return false;
    }
  }

  /**
   * Set up event listeners for lifecycle management
   */
  private static setupAdMobEventListeners(): void {
    if (!Capacitor.isNativePlatform() || this.hasRegisteredListeners) {
      return;
    }

    this.hasRegisteredListeners = true;

    try {
      // Interstitial ad loaded
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
        this.isInterstitialLoaded = true;
        this.isInterstitialLoading = false;
        adManager.setAdReady(true);
      });

      // Interstitial ad failed to load
      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error: AdMobError) => {
        console.debug('[AdMobBridge] Interstitial failed to load:', error);
        this.isInterstitialLoaded = false;
        this.isInterstitialLoading = false;
        adManager.setAdReady(false);
      });

      // Interstitial ad dismissed by user
      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        this.isInterstitialLoaded = false;
        adManager.resetCalculationCounter();
        // Preload next interstitial for the next cycle
        setTimeout(() => {
          this.preloadInterstitial();
        }, 2000);
      });

      // Interstitial ad failed to show
      AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
        this.isInterstitialLoaded = false;
        setTimeout(() => {
          this.preloadInterstitial();
        }, 3000);
      });

      // Banner ad events
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        this.isBannerShowing = true;
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
        this.isBannerShowing = false;
      });

      AdMob.addListener(BannerAdPluginEvents.SizeChanged, () => {
        // Handle size change if necessary
      });
    } catch (e) {
      console.debug('[AdMobBridge] Failed to register event listeners:', e);
    }
  }

  /**
   * Preload an Interstitial Ad in advance
   */
  public static async preloadInterstitial(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || !this.isInitialized) {
      return false;
    }

    if (adManager.isPremium() || !adManager.isAdsEnabled()) {
      return false;
    }

    if (this.isInterstitialLoaded || this.isInterstitialLoading) {
      return true;
    }

    try {
      this.isInterstitialLoading = true;
      const testUnitId = DEFAULT_AD_CONFIG.testAdUnits.interstitialId;

      await AdMob.prepareInterstitial({
        adId: testUnitId,
        isTesting: true,
      });

      return true;
    } catch (err) {
      console.debug('[AdMobBridge] Preload interstitial error:', err);
      this.isInterstitialLoading = false;
      this.isInterstitialLoaded = false;
      return false;
    }
  }

  /**
   * Check if an interstitial is loaded and ready to present
   */
  public static isInterstitialReady(): boolean {
    if (!Capacitor.isNativePlatform()) {
      return adManager.isAdReady();
    }
    return this.isInterstitialLoaded;
  }

  /**
   * Displays an Anchored Adaptive Banner
   */
  public static async showBanner(placement: string = 'bottom'): Promise<boolean> {
    if (adManager.isPremium() || !adManager.isAdsEnabled()) {
      await this.hideBanner();
      return false;
    }

    if (!Capacitor.isNativePlatform()) {
      // In web preview, the React bottom banner UI renders
      return true;
    }

    if (!this.isInitialized) {
      await this.initializeAds();
    }

    try {
      this.activePlacement = placement;
      const testUnitId = DEFAULT_AD_CONFIG.testAdUnits.bannerId;

      const options: BannerAdOptions = {
        adId: testUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      };

      await AdMob.showBanner(options);
      this.isBannerShowing = true;
      return true;
    } catch (err) {
      console.debug('[AdMobBridge] Show banner error:', err);
      this.isBannerShowing = false;
      return false;
    }
  }

  /**
   * Hides the active banner ad
   */
  public static async hideBanner(): Promise<boolean> {
    this.activePlacement = null;

    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      if (this.isBannerShowing) {
        await AdMob.hideBanner().catch(() => {});
        await AdMob.removeBanner().catch(() => {});
        this.isBannerShowing = false;
      }
      return true;
    } catch (err) {
      console.debug('[AdMobBridge] Hide banner error:', err);
      return false;
    }
  }

  /**
   * Shows an Interstitial Ad if available
   */
  public static async showInterstitial(context: string = 'general'): Promise<boolean> {
    if (adManager.isPremium() || !adManager.isAdsEnabled()) {
      return false;
    }

    if (!Capacitor.isNativePlatform()) {
      // Trigger Web preview modal via adManager
      const res = await adManager.showInterstitial(context);
      return res.shown;
    }

    try {
      if (!this.isInterstitialLoaded) {
        await this.preloadInterstitial();
      }

      await AdMob.showInterstitial();
      this.isInterstitialLoaded = false;
      return true;
    } catch (err) {
      console.debug('[AdMobBridge] Show interstitial error:', err);
      this.isInterstitialLoaded = false;
      // Preload next
      this.preloadInterstitial();
      return false;
    }
  }

  /**
   * Sets premium ad-free state and destroys visible ads immediately
   */
  public static setPremiumAdFree(isPremium: boolean): void {
    adManager.setPremium(isPremium);
    if (isPremium) {
      this.hideBanner();
      this.isInterstitialLoaded = false;
    }
  }
}
