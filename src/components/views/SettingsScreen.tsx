import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Laptop,
  Globe,
  Coins,
  Hash,
  Clock,
  Star,
  Bell,
  Info,
  Shield,
  FileText,
  HeartPulse,
  Trash2,
  ChevronLeft,
  Sparkles,
  Check,
} from 'lucide-react';
import { AppSettings, AVAILABLE_CURRENCIES, CurrencyCode, AppTheme, AppLanguage, APP_CONFIG } from '../../types/settings';
import { ConfirmModal } from '../common/ConfirmModal';
import { AboutView } from './settings/AboutView';
import { PrivacyPolicyView } from './settings/PrivacyPolicyView';
import { TermsOfUseView } from './settings/TermsOfUseView';
import { HealthDisclaimerView } from './settings/HealthDisclaimerView';
import { AdDebugCard } from '../ads/AdDebugCard';

type SettingsSubView = 'main' | 'about' | 'privacy' | 'terms' | 'health';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onClearHistory: () => void;
  onOpenFavorites: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSetting,
  onClearHistory,
  onOpenFavorites,
  onShowToast,
}) => {
  const [subView, setSubView] = useState<SettingsSubView>('main');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Sub-view Routing
  if (subView === 'about') {
    return (
      <AboutView
        onBack={() => setSubView('main')}
        onOpenPrivacy={() => setSubView('privacy')}
        onOpenTerms={() => setSubView('terms')}
        onOpenHealthDisclaimer={() => setSubView('health')}
        onShowToast={onShowToast}
      />
    );
  }

  if (subView === 'privacy') {
    return <PrivacyPolicyView onBack={() => setSubView('main')} />;
  }

  if (subView === 'terms') {
    return (
      <TermsOfUseView
        onBack={() => setSubView('main')}
        onOpenHealthDisclaimer={() => setSubView('health')}
      />
    );
  }

  if (subView === 'health') {
    return <HealthDisclaimerView onBack={() => setSubView('main')} />;
  }

  const handleConfirmClearHistory = () => {
    onClearHistory();
    setIsConfirmClearOpen(false);
    onShowToast('تم مسح السجل بنجاح', 'success');
  };

  return (
    <div id="settings-screen-view" className="w-full flex flex-col pt-3 pb-8 animate-in fade-in duration-150">
      {/* Title */}
      <div className="pt-1 pb-4">
        <h1
          id="settings-screen-title"
          className="text-xl sm:text-2xl font-extrabold text-[var(--app-text)] tracking-tight"
        >
          الإعدادات
        </h1>
        <p
          id="settings-screen-subtitle"
          className="text-xs font-medium text-[var(--app-text-secondary)] mt-0.5"
        >
          تخصيص المظهر وتفضيلات التطبيق والحسابات
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Appearance Section (المظهر) */}
        <section id="settings-section-appearance" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>المظهر</span>
          </span>

          <div className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {/* Dark Mode */}
              <button
                type="button"
                id="btn-theme-dark"
                onClick={() => onUpdateSetting('theme', 'dark')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#151B35] border-[#5B5BF7] text-[#F8FAFF] shadow-sm shadow-[#5B5BF7]/20 ring-1 ring-[#5B5BF7]'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <Moon className="w-4 h-4 text-[#5B5BF7]" />
                <span className="text-[11px]">داكن (Dark)</span>
              </button>

              {/* Light Mode */}
              <button
                type="button"
                id="btn-theme-light"
                onClick={() => onUpdateSetting('theme', 'light')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-[#F1F5F9] border-[#5146E5] text-[#0F172A] shadow-sm shadow-[#5146E5]/20 ring-1 ring-[#5146E5]'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <Sun className="w-4 h-4 text-[#FFB020]" />
                <span className="text-[11px]">فاتح (Light)</span>
              </button>

              {/* System Mode */}
              <button
                type="button"
                id="btn-theme-system"
                onClick={() => onUpdateSetting('theme', 'system')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-[#151B35] border-[#00D4FF] text-[#F8FAFF] shadow-sm shadow-[#00D4FF]/20 ring-1 ring-[#00D4FF]'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <Laptop className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-[11px]">تلقائي (System)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Language Section (اللغة) */}
        <section id="settings-section-language" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>اللغة</span>
          </span>

          <div className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-lang-ar"
                onClick={() => onUpdateSetting('language', 'ar')}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                  settings.language === 'ar'
                    ? 'bg-[#5B5BF7]/10 border-[#5B5BF7] text-[#5B5BF7] dark:text-[#7C6CFF] ring-1 ring-[#5B5BF7]'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>العربية</span>
                  <span className="text-[10px] font-normal opacity-75">(RTL)</span>
                </span>
                {settings.language === 'ar' && <Check className="w-4 h-4 text-[#5B5BF7]" />}
              </button>

              <button
                type="button"
                id="btn-lang-en"
                onClick={() => onUpdateSetting('language', 'en')}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-[#5B5BF7]/10 border-[#5B5BF7] text-[#5B5BF7] dark:text-[#7C6CFF] ring-1 ring-[#5B5BF7]'
                    : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>English</span>
                  <span className="text-[10px] font-normal opacity-75">(LTR)</span>
                </span>
                {settings.language === 'en' && <Check className="w-4 h-4 text-[#5B5BF7]" />}
              </button>
            </div>
          </div>
        </section>

        {/* 3. Default Currency Section (العملة الافتراضية) */}
        <section id="settings-section-currency" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>العملة الافتراضية</span>
          </span>

          <div className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_CURRENCIES.map((curr) => {
                const isSelected = settings.currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    id={`btn-curr-${curr.code}`}
                    onClick={() => onUpdateSetting('currency', curr.code)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5B5BF7]/10 border-[#5B5BF7] text-[var(--app-text)] ring-1 ring-[#5B5BF7]'
                        : 'bg-[var(--app-surface-secondary)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center font-bold text-xs text-[#5B5BF7] dark:text-[#7C6CFF]">
                        {curr.symbol}
                      </span>
                      <span className="truncate">{curr.nameAr}</span>
                    </div>

                    <span className="text-[11px] font-mono text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-1.5 py-0.5 rounded border border-[var(--app-border)]">
                      {curr.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Number Formatting Section (تنسيق الأرقام) */}
        <section id="settings-section-number-format" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>تنسيق الأرقام</span>
          </span>

          <div className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[var(--app-text)] block">
                فواصل الآلاف
              </span>
              <span className="text-[11px] text-[var(--app-text-secondary)] mt-0.5 block">
                {settings.useThousandsSeparator ? 'مثال: 1,000,000' : 'مثال: 1000000'}
              </span>
            </div>

            <button
              type="button"
              id="btn-toggle-thousands-separator"
              role="switch"
              aria-checked={settings.useThousandsSeparator}
              onClick={() => onUpdateSetting('useThousandsSeparator', !settings.useThousandsSeparator)}
              className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                settings.useThousandsSeparator ? 'bg-[#5B5BF7]' : 'bg-[var(--app-surface-secondary)] border border-[var(--app-border)]'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${
                  settings.useThousandsSeparator ? '-translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 5. History & Favorites Section (السجل والمفضلة) */}
        <section id="settings-section-data" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>السجل والمفضلة</span>
          </span>

          <div className="rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] divide-y divide-[var(--app-border)]/60 overflow-hidden shadow-sm">
            {/* Manage Favorites */}
            <button
              type="button"
              id="btn-settings-manage-favorites"
              onClick={onOpenFavorites}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFB020]/10 text-[#FFB020] flex items-center justify-center">
                  <Star className="w-4 h-4 fill-[#FFB020]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#FFB020] block">
                    إدارة المفضلة
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    عرض وتعديل حاسباتك المفضلة
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#FFB020]" />
            </button>

            {/* Clear All History */}
            <button
              type="button"
              id="btn-settings-clear-history"
              onClick={() => setIsConfirmClearOpen(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF5C77]/10 text-[#FF5C77] flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#FF5C77] block">
                    مسح جميع العمليات
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    حذف سجل العمليات الحسابية بالكامل
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#FF5C77]" />
            </button>
          </div>
        </section>

        {/* 6. Notifications Preference Section (الإشعارات) */}
        <section id="settings-section-notifications" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>الإشعارات</span>
          </span>

          <div className="p-3.5 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[var(--app-text)] block">
                تفعيل الإشعارات والتنبيهات
              </span>
              <span className="text-[11px] text-[var(--app-text-secondary)] mt-0.5 block">
                تفضيل محلي للتذكيرات والتحديثات المستقبلية
              </span>
            </div>

            <button
              type="button"
              id="btn-toggle-notifications"
              role="switch"
              aria-checked={settings.notificationsEnabled}
              onClick={() => onUpdateSetting('notificationsEnabled', !settings.notificationsEnabled)}
              className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                settings.notificationsEnabled ? 'bg-[#5B5BF7]' : 'bg-[var(--app-surface-secondary)] border border-[var(--app-border)]'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? '-translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 7. About & Legal Section (حول التطبيق والقانوني) */}
        <section id="settings-section-about" className="space-y-2">
          <span className="text-xs font-bold text-[var(--app-text-secondary)] px-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#5B5BF7]" />
            <span>حول التطبيق والقانوني</span>
          </span>

          <div className="rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] divide-y divide-[var(--app-border)]/60 overflow-hidden shadow-sm">
            {/* About NUMA */}
            <button
              type="button"
              id="btn-open-about"
              onClick={() => setSubView('about')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#5B5BF7]/10 text-[#5B5BF7] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#5B5BF7] block">
                    حول {APP_CONFIG.name}
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    {APP_CONFIG.tagline} • الإصدار {APP_CONFIG.version}
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#5B5BF7]" />
            </button>

            {/* Privacy Policy */}
            <button
              type="button"
              id="btn-open-privacy"
              onClick={() => setSubView('privacy')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#19C37D]/10 text-[#19C37D] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#19C37D] block">
                    سياسة الخصوصية
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    حفظ محلي وحماية تامة للبيانات
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#19C37D]" />
            </button>

            {/* Terms of Use */}
            <button
              type="button"
              id="btn-open-terms"
              onClick={() => setSubView('terms')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#7C4DFF] block">
                    شروط الاستخدام
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    إخلاء المسؤولية الحسابية
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#7C4DFF]" />
            </button>

            {/* Health Disclaimer */}
            <button
              type="button"
              id="btn-open-health-disclaimer"
              onClick={() => setSubView('health')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-[var(--app-surface-secondary)] text-right transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFB020]/10 text-[#FFB020] flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--app-text)] group-hover:text-[#FFB020] block">
                    تنبيه صحي
                  </span>
                  <span className="text-[11px] text-[var(--app-text-secondary)]">
                    النتائج الصحية تقديرية وليست تشخيصاً طبياً
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[var(--app-text-secondary)] group-hover:text-[#FFB020]" />
            </button>
          </div>
        </section>

        {/* 8. Ad Architecture & Diagnostics (Developer / Preview Environment) */}
        <section id="settings-section-ads" className="space-y-2">
          <AdDebugCard onShowToast={onShowToast} />
        </section>

        {/* Footer Brand note */}
        <div className="text-center pt-2 pb-1 text-[11px] text-[var(--app-text-secondary)]/70 font-medium">
          {APP_CONFIG.name} — {APP_CONFIG.tagline} • v{APP_CONFIG.version}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="هل تريد مسح جميع العمليات؟"
        message="سيتم حذف سجل العمليات بالكامل ولا يمكن التراجع عن هذا الإجراء."
        confirmText="مسح السجل"
        cancelText="إلغاء"
        onConfirm={handleConfirmClearHistory}
        onCancel={() => setIsConfirmClearOpen(false)}
        isDestructive={true}
      />
    </div>
  );
};
