import { AdConsentStatus } from './AdConfig';

const CONSENT_STORAGE_KEY = 'numa_ad_consent_v1';

export class AdConsentManager {
  private consentStatus: AdConsentStatus = 'UNKNOWN';
  private personalizedAdsAllowed: boolean = false;

  constructor() {
    this.loadPersistedConsent();
  }

  private loadPersistedConsent(): void {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.consentStatus = parsed.status || 'UNKNOWN';
        this.personalizedAdsAllowed = !!parsed.personalized;
      }
    } catch {
      this.consentStatus = 'UNKNOWN';
      this.personalizedAdsAllowed = false;
    }
  }

  private persistConsent(): void {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          status: this.consentStatus,
          personalized: this.personalizedAdsAllowed,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  /**
   * Returns current consent status
   */
  public getConsentStatus(): AdConsentStatus {
    return this.consentStatus;
  }

  /**
   * Are personalized ads allowed according to user consent
   */
  public isPersonalizedAllowed(): boolean {
    return this.consentStatus === 'OBTAINED' && this.personalizedAdsAllowed;
  }

  /**
   * Update consent status (e.g., after Google UMP consent form resolution)
   */
  public setConsent(status: AdConsentStatus, allowPersonalized: boolean = false): void {
    this.consentStatus = status;
    this.personalizedAdsAllowed = allowPersonalized;
    this.persistConsent();
  }

  /**
   * Hook for requesting Google UMP (User Messaging Platform) consent flow on Android
   */
  public async requestConsentInfoUpdate(): Promise<AdConsentStatus> {
    // In Web / Development environment: gracefully default to OBTAINED (non-personalized/standard)
    if (this.consentStatus === 'UNKNOWN') {
      this.setConsent('OBTAINED', false);
    }
    return this.consentStatus;
  }
}

export const adConsentManager = new AdConsentManager();
