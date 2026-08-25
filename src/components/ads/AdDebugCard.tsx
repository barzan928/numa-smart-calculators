import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Terminal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Film,
  RefreshCw,
  PlusCircle,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { adManager, AdManagerStatus } from '../../services/ads';

interface AdDebugCardProps {
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdDebugCard: React.FC<AdDebugCardProps> = ({ onShowToast }) => {
  const [status, setStatus] = useState<AdManagerStatus>(() => adManager.getStatus());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isWatchingRewarded, setIsWatchingRewarded] = useState<boolean>(false);

  const refreshStatus = () => {
    setStatus(adManager.getStatus());
  };

  useEffect(() => {
    refreshStatus();
    // Auto refresh status interval for active cooldown countdown
    const interval = setInterval(refreshStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePremium = () => {
    const nextState = !status.premiumEnabled;
    adManager.setPremium(nextState);
    refreshStatus();
    if (onShowToast) {
      onShowToast(
        nextState ? 'تم تفعيل وضع Premium التجريبي (إيقاف الإعلانات)' : 'تم إلغاء وضع Premium (تفعيل الإعلانات)',
        'info'
      );
    }
  };

  const handleToggleAdReady = () => {
    const nextState = !status.adReady;
    adManager.setAdReady(nextState);
    refreshStatus();
    if (onShowToast) {
      onShowToast(
        nextState ? 'تم تعيين حالة الإعلان: جاهز (Ad Ready)' : 'تم تعيين حالة الإعلان: غير جاهز (Not Ready)',
        'info'
      );
    }
  };

  const handleSimulateCalculation = () => {
    adManager.onCalculationPerformed('debug_test', 'testing');
    refreshStatus();
    if (onShowToast) {
      onShowToast('تمت محاكاة عملية حسابية ناجحة بنجاح (+1)', 'info');
    }
  };

  const handleResetCalculationCounter = () => {
    adManager.resetCalculationCounter();
    refreshStatus();
    if (onShowToast) {
      onShowToast('تم تصفير عداد العمليات الحسابية (0/5)', 'info');
    }
  };

  const handleTestInterstitial = async () => {
    const result = await adManager.showInterstitial('debug_test_button');
    refreshStatus();
    if (onShowToast) {
      if (result.shown) {
        onShowToast('تم عرض الإعلان البيني التجريبي (Interstitial) بنجاح 🎉', 'success');
      } else {
        onShowToast(`تم حجب الإعلان البيني: ${result.reason}`, 'info');
      }
    }
  };

  const handleTestRewarded = async () => {
    setIsWatchingRewarded(true);
    if (onShowToast) {
      onShowToast('جاري تشغيل إعلان المكافأة التجريبي (Rewarded Ad)...', 'info');
    }

    setTimeout(async () => {
      await adManager.showRewarded({
        rewardType: 'temporary_ad_free',
        onRewardEarned: () => {
          if (onShowToast) {
            onShowToast('تمت مشاهدة الإعلان بنجاح! حصلت على المكافأة التجريبية 🎉', 'success');
          }
        },
        onAdClosed: () => {
          setIsWatchingRewarded(false);
          refreshStatus();
        },
      });
    }, 1200);
  };

  // Do not render debug diagnostics if not in development mode
  if (!status.developmentMode) {
    return null;
  }

  const { frequencyStatus } = status;
  const calculationsText = `${frequencyStatus.successfulCalculationCount} / ${frequencyStatus.calculationTriggerInterval}`;
  const interstitialReadyText = status.adReady ? 'Ready' : 'Not Ready';
  const cooldownText = frequencyStatus.cooldownActive
    ? `Active (${frequencyStatus.cooldownRemainingSeconds}s)`
    : 'Available';
  const premiumText = status.premiumEnabled ? 'Yes' : 'No';

  return (
    <div
      id="ad-debug-system-card"
      className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-3"
      dir="rtl"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5B5BF7]/10 text-[#5B5BF7] dark:text-[#7C6CFF] flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--app-text)] block">
              نظام الإعلانات (Ad Architecture & Pacing)
            </span>
            <span className="text-[10px] text-[var(--app-text-secondary)] font-mono">
              Calculations: {calculationsText} • Cooldown: {cooldownText}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="text-[11px] font-bold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline"
        >
          {isExpanded ? 'إخفاء التفاصيل' : 'فحص المعمارية'}
        </button>
      </div>

      {/* Expanded Diagnostic Panel */}
      {isExpanded && (
        <div className="pt-2 border-t border-[var(--app-border)] space-y-3 text-xs animate-in fade-in duration-150">
          {/* Exact Requirements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {/* Calculations: X / 5 */}
            <div className="p-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] space-y-1">
              <span className="text-[10px] text-[var(--app-text-secondary)] block font-mono">
                Calculations:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-[#5B5BF7] dark:text-[#7C6CFF]">
                  {calculationsText}
                </span>
                {frequencyStatus.pendingInterstitial && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFB020]/20 text-[#FFB020] font-bold">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Interstitial: Ready / Not Ready */}
            <div className="p-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] space-y-1">
              <span className="text-[10px] text-[var(--app-text-secondary)] block font-mono">
                Interstitial:
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                {status.adReady ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D]" />
                    <span className="text-[#19C37D] font-mono">{interstitialReadyText}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-[#FF5C77]" />
                    <span className="text-[#FF5C77] font-mono">{interstitialReadyText}</span>
                  </>
                )}
              </div>
            </div>

            {/* Cooldown: Active / Available */}
            <div className="p-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] space-y-1">
              <span className="text-[10px] text-[var(--app-text-secondary)] block font-mono">
                Cooldown (2m):
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                {frequencyStatus.cooldownActive ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-[#FFB020] animate-pulse" />
                    <span className="text-[#FFB020] font-mono text-[10px] truncate">
                      {cooldownText}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D]" />
                    <span className="text-[#19C37D] font-mono">{cooldownText}</span>
                  </>
                )}
              </div>
            </div>

            {/* Premium: Yes / No */}
            <div className="p-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] space-y-1">
              <span className="text-[10px] text-[var(--app-text-secondary)] block font-mono">
                Premium:
              </span>
              <div className="flex items-center gap-1.5 font-bold">
                {status.premiumEnabled ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                    <span className="text-[#FFB020] font-mono">{premiumText}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--app-text-secondary)]" />
                    <span className="text-[var(--app-text)] font-mono">{premiumText}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test & Simulation Controls */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--app-text-secondary)] block">
              أدوات محاكاة واختبار النظام (Developer Actions):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {/* Simulate Successful Calculation (+1) */}
              <button
                type="button"
                onClick={handleSimulateCalculation}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#5B5BF7] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#5B5BF7]" />
                <span>حساب ناجح (+1)</span>
              </button>

              {/* Test Interstitial Trigger */}
              <button
                type="button"
                onClick={handleTestInterstitial}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#5B5BF7] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#5B5BF7]" />
                <span>فحص Interstitial</span>
              </button>

              {/* Toggle Ad Ready (Ready / Not Ready) */}
              <button
                type="button"
                onClick={handleToggleAdReady}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#5B5BF7] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{status.adReady ? 'تبديل لـ Not Ready' : 'تبديل لـ Ready'}</span>
              </button>

              {/* Toggle Premium Mode */}
              <button
                type="button"
                onClick={handleTogglePremium}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#FFB020] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>{status.premiumEnabled ? 'إلغاء Premium' : 'تفعيل Premium'}</span>
              </button>

              {/* Reset Calculation Counter */}
              <button
                type="button"
                onClick={handleResetCalculationCounter}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#FF5C77] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF5C77]" />
                <span>تصفير العداد</span>
              </button>

              {/* Test Rewarded Flow */}
              <button
                type="button"
                disabled={isWatchingRewarded}
                onClick={handleTestRewarded}
                className="py-2 px-2.5 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] hover:border-[#19C37D] text-[11px] font-bold text-[var(--app-text)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-[#19C37D]" />
                <span>{isWatchingRewarded ? 'جاري العرض...' : 'تجربة Rewarded'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
