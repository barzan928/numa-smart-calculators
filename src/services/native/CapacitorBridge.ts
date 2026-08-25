import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen as CapSplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

export class CapacitorBridge {
  private static isInitialized = false;

  /**
   * Check if running on Android or iOS native platform
   */
  public static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Initializes native app listeners and environment
   */
  public static async init(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    try {
      // Hide native splash screen smoothly when web app is ready
      await CapSplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
    } catch {
      // Ignore if not supported
    }

    try {
      // Enable keyboard accessories / auto scroll
      if (Capacitor.getPlatform() === 'android') {
        await Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Updates the Status Bar theme dynamically according to app dark/light mode
   */
  public static async updateStatusBarTheme(isDark: boolean): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      if (isDark) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0F1218' });
      } else {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#F7F9FC' });
      }
    } catch (err) {
      console.debug('[CapacitorBridge] StatusBar update skipped:', err);
    }
  }

  /**
   * Registers a native Android hardware Back Button listener
   */
  public static registerBackButton(handler: () => boolean | void): () => void {
    if (!Capacitor.isNativePlatform()) {
      return () => {};
    }

    let removeListener: (() => void) | null = null;

    CapApp.addListener('backButton', () => {
      const handled = handler();
      // If handler returns false or not handled and at root, app can exit
      if (handled === false) {
        CapApp.exitApp();
      }
    }).then((handle) => {
      removeListener = () => handle.remove();
    });

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }
}
