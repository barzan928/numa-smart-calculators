import { useState, useMemo, useEffect, useRef } from 'react';
import { TabId, CategoryId, CalculatorItem } from './types';
import { AppShell } from './components/layout/AppShell';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { HomeScreen } from './components/views/HomeScreen';
import { CalculatorsScreen } from './components/views/CalculatorsScreen';
import { FavoritesScreen } from './components/views/FavoritesScreen';
import { CalculatorDetailView } from './components/views/CalculatorDetailView';
import { HistoryScreen } from './components/views/HistoryScreen';
import { SettingsScreen } from './components/views/SettingsScreen';
import { Toast } from './components/common/Toast';
import { SplashScreen } from './components/common/SplashScreen';
import { useFavorites } from './hooks/useFavorites';
import { useHistory } from './hooks/useHistory';
import { useToast } from './hooks/useToast';
import { useSettings } from './hooks/useSettings';
import { CALCULATORS_DATA } from './data/calculators';
import { trackCalculatorUsage } from './utils/usage';
import { adManager } from './services/ads';
import { InterstitialAdModal } from './components/ads/InterstitialAdModal';
import { CapacitorBridge, AdMobBridge } from './services/native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [activeCalculator, setActiveCalculator] = useState<CalculatorItem | null>(null);
  const [savedCalculatorInputs, setSavedCalculatorInputs] = useState<Record<string, any> | undefined>(
    undefined
  );

  // Interstitial Ad Modal state for Web preview / test environment
  const [isInterstitialOpen, setIsInterstitialOpen] = useState<boolean>(false);
  const [interstitialCloseHandler, setInterstitialCloseHandler] = useState<(() => void) | null>(null);

  const { settings, effectiveTheme, updateSetting, setTheme } = useSettings();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { historyItems, addHistoryItem, removeHistoryItem, clearHistory } = useHistory();
  const { toast, showToast, closeToast } = useToast();

  const lastBackPressTimeRef = useRef<number>(0);

  // Initialize centralized advertising architecture & modal listener on launch
  useEffect(() => {
    CapacitorBridge.init();
    AdMobBridge.initializeAds();
    adManager.initializeAds();
    adManager.setInterstitialListener((isOpen, onClose) => {
      setIsInterstitialOpen(isOpen);
      setInterstitialCloseHandler(() => onClose);
    });

    return () => {
      adManager.setInterstitialListener(null);
    };
  }, []);

  // Sync Android Status Bar style whenever theme changes
  useEffect(() => {
    CapacitorBridge.updateStatusBarTheme(effectiveTheme === 'dark');
  }, [effectiveTheme]);

  // Handle native Android hardware back button
  useEffect(() => {
    const unregister = CapacitorBridge.registerBackButton(() => {
      // 1. If Interstitial Modal is open, close it first
      if (isInterstitialOpen) {
        handleCloseInterstitial();
        return true;
      }

      // 2. If viewing a specific calculator, return to previous list
      if (activeCalculator) {
        handleBackFromDetail();
        return true;
      }

      // 3. If on a sub-tab (Calculators, Favorites, History, Settings), switch back to Home
      if (activeTab !== 'home') {
        handleTabChange('home');
        return true;
      }

      // 4. If already on Home tab: double back press to exit gracefully
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        return false; // Tells Capacitor to exit app
      }

      lastBackPressTimeRef.current = now;
      showToast(
        settings.language === 'ar' ? 'اضغط مرة أخرى للخروج من NUMA' : 'Press back again to exit NUMA',
        'info'
      );
      return true;
    });

    return () => {
      unregister();
    };
  }, [isInterstitialOpen, activeCalculator, activeTab, settings.language]);

  const handleCloseInterstitial = () => {
    setIsInterstitialOpen(false);
    if (interstitialCloseHandler) {
      interstitialCloseHandler();
      setInterstitialCloseHandler(null);
    }
  };

  // Extract unique recently used calculator IDs from history
  const recentCalculatorIds = useMemo(() => {
    const ids: string[] = [];
    for (const item of historyItems) {
      if (!ids.includes(item.calculatorId)) {
        ids.push(item.calculatorId);
      }
    }
    return ids;
  }, [historyItems]);

  const handleToggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  const handleSelectCalculator = (calc: CalculatorItem, inputs?: Record<string, any>) => {
    trackCalculatorUsage(calc.id);
    setActiveCalculator(calc);
    setSavedCalculatorInputs(inputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveHistoryAndNotifyAds = (data: Parameters<typeof addHistoryItem>[0]) => {
    addHistoryItem(data);
    const foundCalc = CALCULATORS_DATA.find((c) => c.id === data.calculatorId);
    adManager.onCalculationPerformed(data.calculatorId, foundCalc?.category || 'general');
  };

  const handleSelectCalculatorById = (calculatorId: string, inputs?: Record<string, any>) => {
    const found = CALCULATORS_DATA.find((c) => c.id === calculatorId);
    if (found) {
      handleSelectCalculator(found, inputs);
    } else {
      // Fallback search
      const fallback = CALCULATORS_DATA.find((c) => c.id.includes(calculatorId));
      if (fallback) {
        handleSelectCalculator(fallback, inputs);
      }
    }
  };

  const handleBackFromDetail = () => {
    setActiveCalculator(null);
    setSavedCalculatorInputs(undefined);
  };

  const handleCategorySelectFromHome = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setActiveCalculator(null);
    setSavedCalculatorInputs(undefined);
    setActiveTab('calculators');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabId) => {
    setActiveCalculator(null);
    setSavedCalculatorInputs(undefined);
    setActiveTab(tab);
    if (tab === 'calculators') {
      setSelectedCategory('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fast & Professional Initial Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <AppShell theme={effectiveTheme} dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Global Toast Notification */}
        <Toast toast={toast} onClose={closeToast} />

        {/* 1. If a specific calculator is open, show its detail screen */}
        {activeCalculator ? (
          <CalculatorDetailView
            calculator={activeCalculator}
            isFavorite={isFavorite(activeCalculator.id)}
            onToggleFavorite={toggleFavorite}
            onBack={handleBackFromDetail}
            savedInputs={savedCalculatorInputs}
            onSaveHistory={handleSaveHistoryAndNotifyAds}
            onShowToast={showToast}
          />
        ) : activeTab === 'home' ? (
          /* 2. Home Screen */
          <HomeScreen
            theme={effectiveTheme}
            onToggleTheme={handleToggleTheme}
            onOpenSettings={() => handleTabChange('settings')}
            onOpenHistory={() => handleTabChange('history')}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectCalculator={handleSelectCalculator}
            onSelectCategory={handleCategorySelectFromHome}
            recentIds={recentCalculatorIds}
            favoriteIds={favoriteIds}
          />
        ) : activeTab === 'calculators' ? (
          /* 3. Calculators Screen */
          <CalculatorsScreen
            initialCategory={selectedCategory}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectCalculator={handleSelectCalculator}
            recentIds={recentCalculatorIds}
            favoriteIds={favoriteIds}
          />
        ) : activeTab === 'favorites' ? (
          /* 4. Favorites Screen */
          <FavoritesScreen
            favoriteIds={favoriteIds}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectCalculator={handleSelectCalculator}
            onExploreCalculators={() => handleTabChange('calculators')}
          />
        ) : activeTab === 'history' ? (
          /* 5. Rich History Screen */
          <HistoryScreen
            historyItems={historyItems}
            onRemoveItem={removeHistoryItem}
            onClearHistory={clearHistory}
            onSelectCalculator={handleSelectCalculatorById}
            onGoHome={() => handleTabChange('calculators')}
            onShowToast={showToast}
          />
        ) : (
          /* 6. Settings Screen */
          <SettingsScreen
            settings={settings}
            onUpdateSetting={updateSetting}
            onClearHistory={clearHistory}
            onOpenFavorites={() => handleTabChange('favorites')}
            onShowToast={showToast}
          />
        )}

        {/* Fixed Floating Mobile Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={settings.language}
        />

        {/* Centralized AdMob Interstitial Ad Simulation for Development Mode */}
        <InterstitialAdModal
          isOpen={isInterstitialOpen}
          onClose={handleCloseInterstitial}
        />
      </AppShell>
    </>
  );
}


