import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from '@capacitor-community/admob';
import { AdPlacementId } from './AdConfig';

export interface NativeAdMobBridge {
  isAvailable: () => boolean;
  initialize: (appId: string) => Promise<boolean>;
  showBanner: (placement: AdPlacementId, unitId: string) => Promise<boolean>;
  hideBanner: () => Promise<boolean>;
  loadInterstitial: (unitId: string) => Promise<boolean>;
  showInterstitial: () => Promise<boolean>;
  loadRewarded: (unitId: string) => Promise<boolean>;
  showRewarded: () => Promise<{ earned: boolean; amount?: number; type?: string }>;
}

/**
 * Global interface augmentation for Android WebView / Capacitor injection
 */
declare global {
  interface Window {
    AndroidAdMob?: NativeAdMobBridge;
    __NUMA_DEBUG_ADS__?: boolean;
  }
}

export class NativeAdMobProvider {
  /**
   * Checks if running inside an Android native environment with AdMob capability
   */
  public isNativeBridgeAvailable(): boolean {
    if (Capacitor.isNativePlatform()) {
      return true;
    }
    return typeof window !== 'undefined' && !!window.AndroidAdMob && typeof window.AndroidAdMob.showBanner === 'function';
  }

  public async initialize(appId: string): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.initialize({
          initializeForTesting: true,
        });
        return true;
      } catch (err) {
        console.warn('[AdProvider] Capacitor AdMob init error:', err);
        return false;
      }
    }

    if (this.isNativeBridgeAvailable() && window.AndroidAdMob) {
      try {
        return await window.AndroidAdMob.initialize(appId);
      } catch (err) {
        console.warn('[AdProvider] Native initialization error:', err);
        return false;
      }
    }
    return true; // Graceful no-op on Web preview
  }

  public async showBanner(placement: AdPlacementId, unitId: string): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const options: BannerAdOptions = {
          adId: unitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true,
        };
        await AdMob.showBanner(options);
        return true;
      } catch (err) {
        console.debug('[AdProvider] Capacitor banner error:', err);
        return false;
      }
    }

    if (this.isNativeBridgeAvailable() && window.AndroidAdMob) {
      try {
        return await window.AndroidAdMob.showBanner(placement, unitId);
      } catch (err) {
        console.warn('[AdProvider] Native banner error:', err);
        return false;
      }
    }
    return true;
  }

  public async hideBanner(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.hideBanner().catch(() => {});
        await AdMob.removeBanner().catch(() => {});
        return true;
      } catch (err) {
        console.debug('[AdProvider] Capacitor hideBanner error:', err);
        return false;
      }
    }

    if (this.isNativeBridgeAvailable() && window.AndroidAdMob) {
      try {
        return await window.AndroidAdMob.hideBanner();
      } catch (err) {
        console.warn('[AdProvider] Native hideBanner error:', err);
        return false;
      }
    }
    return true;
  }

  public async showInterstitial(unitId: string): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.prepareInterstitial({
          adId: unitId,
          isTesting: true,
        });
        await AdMob.showInterstitial();
        return true;
      } catch (err) {
        console.debug('[AdProvider] Capacitor interstitial error:', err);
        return false;
      }
    }

    if (this.isNativeBridgeAvailable() && window.AndroidAdMob) {
      try {
        await window.AndroidAdMob.loadInterstitial(unitId);
        return await window.AndroidAdMob.showInterstitial();
      } catch (err) {
        console.warn('[AdProvider] Native interstitial error:', err);
        return false;
      }
    }
    return true;
  }

  public async showRewarded(unitId: string): Promise<{ earned: boolean; type?: string }> {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.prepareRewardVideoAd({
          adId: unitId,
          isTesting: true,
        });
        const res = await AdMob.showRewardVideoAd();
        return { earned: !!res, type: 'capacitor_reward' };
      } catch (err) {
        console.debug('[AdProvider] Capacitor rewarded error:', err);
        return { earned: false };
      }
    }

    if (this.isNativeBridgeAvailable() && window.AndroidAdMob) {
      try {
        await window.AndroidAdMob.loadRewarded(unitId);
        const res = await window.AndroidAdMob.showRewarded();
        return { earned: !!res.earned, type: res.type };
      } catch (err) {
        console.warn('[AdProvider] Native rewarded error:', err);
        return { earned: false };
      }
    }
    return { earned: true, type: 'test_reward' };
  }
}

export const nativeAdMobProvider = new NativeAdMobProvider();
