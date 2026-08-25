import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [canClose, setCanClose] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setCanClose(false);
      return;
    }

    setCountdown(3);
    setCanClose(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="interstitial-ad-overlay"
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="Google AdMob Test Interstitial Ad"
    >
      {/* Top Bar: Close button & Test badge */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 text-xs font-mono font-bold tracking-wide border border-white/20">
            AdMob Test Interstitial
          </span>
        </div>

        {canClose ? (
          <button
            type="button"
            id="btn-close-interstitial-ad"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-lg border border-white/30"
          >
            <span>إغلاق الإعلان</span>
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-mono font-medium border border-white/10">
            <span>يمكنك التخطي بعد {countdown}ث</span>
          </div>
        )}
      </div>

      {/* Main Ad Content Simulation */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 text-white shadow-2xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#5B5BF7]/20 border border-[#5B5BF7]/40 flex items-center justify-center text-[#5B5BF7] shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D4FF]">
            Google Mobile Ads (Test)
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            إعلان شاشة كاملة تجريبي (Interstitial)
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed px-2">
            تم تفعيل هذا الإعلان البيني بعد إكمال 5 عمليات حسابية ناجحة مع الالتزام بفترة الانتظار (2 دقيقة).
          </p>
        </div>

        <div className="w-full p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between text-xs font-mono text-neutral-300">
          <span>Ad Unit: ca-app-pub-394025...</span>
          <span className="text-[#19C37D] font-bold">READY</span>
        </div>

        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#5B5BF7] hover:bg-[#4848D0] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <span>العودة إلى تطبيق NUMA</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom disclaimer */}
      <div className="w-full text-center pb-2 text-[10px] text-white/40 flex items-center justify-center gap-1">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>وضع التطوير: لن يتم عرض إعلانات حقيقية أو طلب رسوم في هذه النسخة.</span>
      </div>
    </div>
  );
};
