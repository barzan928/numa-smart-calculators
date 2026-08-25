import React, { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Mail,
  Send,
  Check,
  Shield,
  FileText,
  HeartPulse,
  ExternalLink,
} from 'lucide-react';
import { APP_CONFIG } from '../../../types/settings';

interface AboutViewProps {
  onBack: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenHealthDisclaimer: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onBack,
  onOpenPrivacy,
  onOpenTerms,
  onOpenHealthDisclaimer,
  onShowToast,
}) => {
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactMessage.trim()) {
      onShowToast('يرجى ملء الموضوع والرسالة', 'error');
      return;
    }

    setIsSent(true);
    onShowToast('تم إرسال رسالتك بنجاح، شكراً لتواصلك معنا!', 'success');
    setTimeout(() => {
      setContactSubject('');
      setContactMessage('');
      setIsSent(false);
    }, 2500);
  };

  return (
    <div id="about-numa-view" className="w-full flex flex-col pt-3 pb-8 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
        <button
          type="button"
          id="btn-about-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للإعدادات</span>
        </button>

        <span className="text-xs font-bold text-[var(--app-text-secondary)]">
          حول NUMA
        </span>
      </div>

      {/* Brand Hero Card */}
      <div className="flex flex-col items-center text-center p-6 my-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#5B5BF7]/10 rounded-full blur-3xl pointer-events-none" />

        {/* App Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B5BF7] to-[#7C4DFF] p-[1.5px] shadow-lg shadow-[#5B5BF7]/25 flex items-center justify-center text-white mb-3">
          <div className="w-full h-full rounded-[14px] bg-[#10152A]/50 backdrop-blur-sm flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-[var(--app-text)] font-sans">
            {APP_CONFIG.name}
          </h1>
          <span className="text-[10px] font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2 py-0.5 rounded-full border border-[#5B5BF7]/20">
            PRO
          </span>
        </div>

        <p className="text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] mt-0.5">
          {APP_CONFIG.tagline}
        </p>

        <p className="text-xs text-[var(--app-text-secondary)] max-w-sm mt-3 leading-relaxed">
          {APP_CONFIG.descriptionAr}
        </p>

        {/* Version Badge */}
        <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-[var(--app-text-secondary)] bg-[var(--app-surface-secondary)] px-3 py-1 rounded-xl border border-[var(--app-border)]">
          <span>الإصدار:</span>
          <span className="text-[var(--app-text)] font-mono">v{APP_CONFIG.version}</span>
        </div>
      </div>

      {/* Quick Legal & Health Navigation */}
      <div className="space-y-2 mb-5">
        <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1">
          المعلومات والسياسات
        </span>

        <div className="rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] divide-y divide-[var(--app-border)]/60 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5B5BF7]/10 text-[#5B5BF7] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7]">
                سياسة الخصوصية
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--app-text-secondary)]/50 group-hover:text-[#5B5BF7]" />
          </button>

          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#7C4DFF]">
                شروط الاستخدام
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--app-text-secondary)]/50 group-hover:text-[#7C4DFF]" />
          </button>

          <button
            type="button"
            onClick={onOpenHealthDisclaimer}
            className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFB020]/10 text-[#FFB020] flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#FFB020]">
                تنبيه صحي ومعلومات طبية
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--app-text-secondary)]/50 group-hover:text-[#FFB020]" />
          </button>
        </div>
      </div>

      {/* Contact Us UI Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>تواصل معنا ومقترحاتك</span>
          </span>
          <span className="text-[11px] font-mono text-[var(--app-text-secondary)]">
            {APP_CONFIG.supportEmail}
          </span>
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-3"
        >
          <div>
            <label className="text-xs font-bold text-[var(--app-text)] block mb-1.5">
              موضوع الرسالة
            </label>
            <input
              type="text"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="مثال: اقتراح حاسبة جديدة أو ملاحظة"
              className="w-full h-10 px-3 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] text-xs text-[var(--app-text)] placeholder-[var(--app-text-secondary)]/60 focus:outline-none focus:border-[#5B5BF7]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--app-text)] block mb-1.5">
              تفاصيل الرسالة
            </label>
            <textarea
              rows={3}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="شاركنا رأيك أو استفسارك لتحسين NUMA..."
              className="w-full p-3 rounded-xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] text-xs text-[var(--app-text)] placeholder-[var(--app-text-secondary)]/60 focus:outline-none focus:border-[#5B5BF7] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSent}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isSent
                ? 'bg-[#19C37D] text-white'
                : 'bg-gradient-to-r from-[#5B5BF7] to-[#7C4DFF] text-white shadow-[#5B5BF7]/30 hover:opacity-95 active:scale-98'
            }`}
          >
            {isSent ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم الإرسال بنجاح</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الرسالة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
