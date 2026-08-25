import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { APP_CONFIG } from '../../types/settings';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 950,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out slightly before completion
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 250);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      id="numa-splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A14] text-[#F8FAFF] transition-opacity duration-300 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#5B5BF7]/20 to-[#7C4DFF]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Brand Container */}
      <div className="relative flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500 z-10">
        {/* Brand Logo Icon */}
        <div className="relative w-18 h-18 rounded-3xl bg-gradient-to-br from-[#5B5BF7] to-[#7C4DFF] p-[1.5px] shadow-xl shadow-[#5B5BF7]/30 flex items-center justify-center text-white">
          <div className="w-full h-full rounded-[22px] bg-[#0E1328]/70 backdrop-blur-md flex items-center justify-center">
            <Calculator className="w-9 h-9 text-white stroke-[2.3]" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white font-sans">
              {APP_CONFIG.name}
            </h1>
            <span className="text-[10px] font-bold text-[#5B5BF7] bg-[#5B5BF7]/15 px-2 py-0.5 rounded-full border border-[#5B5BF7]/30">
              PRO
            </span>
          </div>

          <p className="text-xs font-semibold text-[#A7B0C3] tracking-widest uppercase">
            {APP_CONFIG.tagline}
          </p>
        </div>
      </div>

      {/* Subtle loader pulse at the bottom */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF7] animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF7]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF7]/30" />
        </div>
        <span className="text-[10px] text-[#A7B0C3]/60 font-medium">
          v{APP_CONFIG.version}
        </span>
      </div>
    </div>
  );
};
