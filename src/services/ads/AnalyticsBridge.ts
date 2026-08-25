/**
 * Clean Analytics Interface & Abstraction Layer
 * Ready for future Google Analytics 4 / Firebase Analytics / Mixpanel integration
 */

export interface AnalyticsEventPayload {
  eventName: string;
  parameters?: Record<string, string | number | boolean | undefined>;
  timestamp: number;
}

export type AnalyticsListener = (event: AnalyticsEventPayload) => void;

export class AnalyticsBridge {
  private listeners: AnalyticsListener[] = [];
  private isEnabled: boolean = true;

  /**
   * Register a future Analytics adapter (e.g. Firebase Analytics on Android)
   */
  public addListener(listener: AnalyticsListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Log an event across all registered providers
   */
  public logEvent(name: string, parameters?: Record<string, string | number | boolean | undefined>): void {
    if (!this.isEnabled) return;

    const payload: AnalyticsEventPayload = {
      eventName: name,
      parameters,
      timestamp: Date.now(),
    };

    // Dispatch to registered adapters
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.warn(`[AnalyticsBridge] Listener error for ${name}:`, err);
      }
    });

    // In development mode, log structured event in console if needed
    if (typeof window !== 'undefined' && (window as any).__NUMA_DEBUG_ANALYTICS__) {
      console.log(`📊 [Analytics] ${name}`, parameters);
    }
  }

  // --- Specialized standard helper methods ---

  public trackCalculatorUsed(calculatorId: string, category: string): void {
    this.logEvent('calculator_used', {
      calculator_id: calculatorId,
      category,
    });
  }

  public trackAdShown(adType: 'banner' | 'interstitial' | 'rewarded', placement: string): void {
    this.logEvent('ad_impression', {
      ad_type: adType,
      ad_placement: placement,
    });
  }

  public trackAdRewardEarned(rewardType: string): void {
    this.logEvent('ad_reward_earned', {
      reward_type: rewardType,
    });
  }

  public trackFavoriteAdded(calculatorId: string): void {
    this.logEvent('favorite_added', {
      calculator_id: calculatorId,
    });
  }

  public trackFavoriteRemoved(calculatorId: string): void {
    this.logEvent('favorite_removed', {
      calculator_id: calculatorId,
    });
  }

  public trackSearch(query: string, resultCount: number): void {
    this.logEvent('search_performed', {
      search_term: query.substring(0, 40),
      result_count: resultCount,
    });
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

export const analyticsBridge = new AnalyticsBridge();
