import React, { useEffect, useState } from 'react';
import { AdPlacementId, adManager } from '../../services/ads';
import { Layers } from 'lucide-react';

interface BannerAdSlotProps {
  placement: AdPlacementId;
  className?: string;
}

export const BannerAdSlot: React.FC<BannerAdSlotProps> = ({
  placement,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => adManager.isAdsEnabled());
  const config = adManager.getConfig();

  useEffect(() => {
    const isEnabled = adManager.isAdsEnabled();
    const placementKey = `${placement}Banner` as keyof typeof config.placements;
    const isPlacementActive = config.placements[placementKey];

    if (isEnabled && isPlacementActive) {
      adManager.showBanner(placement);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [placement, config]);

  if (!isVisible) return null;

  return (
    <div
      id={`ad-banner-slot-${placement}`}
      className={`w-full flex items-center justify-center my-3 px-1 transition-all animate-in fade-in duration-200 select-none ${className}`}
      aria-label="Advertisement Placement"
    >
      {/* Standard Mobile Banner Frame (320x50 standard proportion) */}
      <div className="w-full max-w-[360px] h-[52px] rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)]/80 flex items-center justify-between px-3 relative overflow-hidden shadow-xs">
        {/* Subtle background decoration in test mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--app-surface-secondary)]/30 to-transparent pointer-events-none" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-7 h-7 rounded-lg bg-[#5B5BF7]/10 text-[#5B5BF7] dark:text-[#7C6CFF] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-[var(--app-text)] leading-tight">
              مساحة إعلانية تجريبية
            </span>
            <span className="text-[9px] font-mono text-[var(--app-text-secondary)]">
              AdMob Banner • 320x50
            </span>
          </div>
        </div>

        {/* Test Ad indicator badge */}
        <div className="z-10 flex items-center">
          <span className="text-[9px] font-bold font-mono tracking-wider text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-1.5 py-0.5 rounded border border-[var(--app-border)] uppercase">
            Ad Test
          </span>
        </div>
      </div>
    </div>
  );
};
