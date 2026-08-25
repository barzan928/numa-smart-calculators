import { AdFrequencyConfig } from './AdConfig';

const FREQUENCY_STORAGE_KEY = 'numa_ad_frequency_v2';

export class AdFrequencyManager {
  private config: AdFrequencyConfig;
  private successfulCalculationCount: number = 0;
  private totalCalculationCount: number = 0;
  private lastInterstitialTimestamp: number = 0;
  private pendingInterstitial: boolean = false;
  private adReady: boolean = true; // In web/dev, test interstitial is preloaded/ready

  constructor(config: AdFrequencyConfig) {
    this.config = config;
    this.loadPersistedData();
  }

  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem(FREQUENCY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.successfulCalculationCount = typeof parsed.successfulCalculationCount === 'number' ? parsed.successfulCalculationCount : 0;
        this.totalCalculationCount = typeof parsed.totalCalculations === 'number' ? parsed.totalCalculations : 0;
        this.lastInterstitialTimestamp = typeof parsed.lastInterstitialTime === 'number' ? parsed.lastInterstitialTime : 0;
        this.pendingInterstitial = !!parsed.pendingInterstitial;
      }
    } catch {
      this.successfulCalculationCount = 0;
      this.totalCalculationCount = 0;
      this.lastInterstitialTimestamp = 0;
      this.pendingInterstitial = false;
    }
  }

  private persistData(): void {
    try {
      localStorage.setItem(
        FREQUENCY_STORAGE_KEY,
        JSON.stringify({
          successfulCalculationCount: this.successfulCalculationCount,
          totalCalculations: this.totalCalculationCount,
          lastInterstitialTime: this.lastInterstitialTimestamp,
          pendingInterstitial: this.pendingInterstitial,
        })
      );
    } catch {
      // Safe fallback
    }
  }

  /**
   * Update frequency configuration dynamically
   */
  public updateConfig(config: Partial<AdFrequencyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set whether the Interstitial ad is loaded and ready
   */
  public setAdReady(ready: boolean): void {
    this.adReady = ready;
  }

  /**
   * Get whether the ad is ready
   */
  public isAdReady(): boolean {
    return this.adReady;
  }

  /**
   * Record a successful calculation operation (when result is computed and saved)
   */
  public recordSuccessfulCalculation(): { count: number; reachedThreshold: boolean } {
    this.successfulCalculationCount += 1;
    this.totalCalculationCount += 1;

    const target = this.config.calculationTriggerInterval || 5;
    const reachedThreshold = this.successfulCalculationCount >= target;

    if (reachedThreshold) {
      this.pendingInterstitial = true;
    }

    this.persistData();
    return { count: this.successfulCalculationCount, reachedThreshold };
  }

  /**
   * Check if cooldown (2 minutes = 120 seconds) is currently active
   */
  public getCooldownStatus(): { isActive: boolean; remainingSeconds: number } {
    if (!this.lastInterstitialTimestamp) {
      return { isActive: false, remainingSeconds: 0 };
    }
    const elapsedSeconds = (Date.now() - this.lastInterstitialTimestamp) / 1000;
    const cooldownPeriod = this.config.minIntervalSeconds || 120;
    if (elapsedSeconds < cooldownPeriod) {
      const remaining = Math.ceil(cooldownPeriod - elapsedSeconds);
      return { isActive: true, remainingSeconds: remaining };
    }
    return { isActive: false, remainingSeconds: 0 };
  }

  /**
   * Evaluates all frequency, cooldown, and readiness rules to decide if an interstitial ad is permitted
   */
  public canShowInterstitial(): { allowed: boolean; reason?: string } {
    const target = this.config.calculationTriggerInterval || 5;

    // 1. Ad Ready check
    if (!this.adReady) {
      return {
        allowed: false,
        reason: 'الإعلان غير جاهز (Ad Not Ready)',
      };
    }

    // 2. Calculation threshold check (must be at least 5 or have pending interstitial)
    if (this.successfulCalculationCount < target && !this.pendingInterstitial) {
      return {
        allowed: false,
        reason: `لم يصل إلى الحد المطلوب (${this.successfulCalculationCount}/${target})`,
      };
    }

    // 3. Cooldown check (2 minutes = 120s minimum interval)
    const cooldown = this.getCooldownStatus();
    if (cooldown.isActive) {
      // Retain pending flag so when cooldown expires, next opportunity will show it
      this.pendingInterstitial = true;
      this.persistData();
      return {
        allowed: false,
        reason: `فترة الانتظار نشطة (متبقي ${cooldown.remainingSeconds} ثانية)`,
      };
    }

    return { allowed: true };
  }

  /**
   * Record that an interstitial was successfully displayed and closed
   * Resets successfulCalculationCount to 0 and clears pending flag
   */
  public recordInterstitialShown(): void {
    this.lastInterstitialTimestamp = Date.now();
    this.successfulCalculationCount = 0;
    this.pendingInterstitial = false;
    this.persistData();
  }

  /**
   * Reset calculation counter manually (e.g. for testing)
   */
  public resetCalculationCount(): void {
    this.successfulCalculationCount = 0;
    this.pendingInterstitial = false;
    this.persistData();
  }

  /**
   * Returns summary state for diagnostics & debug card
   */
  public getStatus() {
    const cooldown = this.getCooldownStatus();
    const target = this.config.calculationTriggerInterval || 5;

    return {
      successfulCalculationCount: this.successfulCalculationCount,
      calculationTriggerInterval: target,
      totalCalculationCount: this.totalCalculationCount,
      adReady: this.adReady,
      cooldownActive: cooldown.isActive,
      cooldownRemainingSeconds: cooldown.remainingSeconds,
      pendingInterstitial: this.pendingInterstitial,
      lastInterstitialTimestamp: this.lastInterstitialTimestamp,
    };
  }
}
