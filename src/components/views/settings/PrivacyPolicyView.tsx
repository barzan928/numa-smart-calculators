import React from 'react';
import { ArrowRight, ShieldCheck, Database, Lock, EyeOff, Smartphone, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../../../types/settings';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  return (
    <div id="privacy-policy-view" className="w-full flex flex-col pt-3 pb-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
        <button
          type="button"
          id="btn-privacy-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للإعدادات</span>
        </button>

        <span className="text-xs font-bold text-[var(--app-text-secondary)]">
          سياسة الخصوصية
        </span>
      </div>

      {/* Header Banner */}
      <div className="p-5 my-4 rounded-2xl bg-gradient-to-br from-[#5B5BF7]/10 via-[var(--app-surface)] to-[var(--app-surface)] border border-[#5B5BF7]/20 shadow-sm flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#5B5BF7]/15 text-[#5B5BF7] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[var(--app-text)]">
            سياسة الخصوصية في {APP_CONFIG.name}
          </h1>
          <p className="text-xs text-[var(--app-text-secondary)] mt-1 leading-relaxed">
            نحن نضع خصوصيتك وأمان بياناتك في قمة أولوياتنا. يعمل تطبيق {APP_CONFIG.name} بنموذج حفظ محلي (Offline-first) لحماية بياناتك.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 text-xs leading-relaxed text-[var(--app-text-secondary)]">
        {/* Section 1: Local Storage */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Database className="w-4 h-4 text-[#5B5BF7]" />
            <span>1. البيانات التي يتم حفظها محلياً على جهازك</span>
          </div>
          <p>
            يقوم التطبيق بحفظ بعض البيانات محلياً على ذاكرة متصفحك أو جهازك فقط (Local Storage) لضمان تجربة مستخدم سلسة، وتشمل:
          </p>
          <ul className="list-disc list-inside pr-2 space-y-1 text-[var(--app-text)] font-medium">
            <li>سجل العمليات الحسابية السابقة (History) لتتمكن من الرجوع إليها.</li>
            <li>قائمة الحاسبات المفضلة لديك (Favorites) لسهولة الوصول.</li>
            <li>تفضيلات التطبيق (مثل المظهر الداكن/الفاتح، العملة الافتراضية، وتنسيق الأرقام).</li>
          </ul>
        </div>

        {/* Section 2: No Account Required */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <EyeOff className="w-4 h-4 text-[#19C37D]" />
            <span>2. عدم الحاجة إلى إنشاء حساب أو تسجيل دخول</span>
          </div>
          <p>
            لا يتطلب استخدام {APP_CONFIG.name} إنشاء حساب شخصي أو إدخال بريدك الإلكتروني أو بيانات هويتك الشخصية. جميع العمليات تجري مباشرة على جهازك دون إرسال حساباتك الحساسة لخوادم خارجية.
          </p>
        </div>

        {/* Section 3: Data Control & Deletion */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Lock className="w-4 h-4 text-[#FFB020]" />
            <span>3. التحكم الكامل ومسح البيانات</span>
          </div>
          <p>
            لديك السيطرة الكاملة على بياناتك في أي وقت. يمكنك من خلال صفحة الإعدادات أو صفحة السجل الضغط على "مسح جميع العمليات" لحذف سجل حساباتك بالكامل وبشكل فوري ونهائي.
          </p>
        </div>

        {/* Section 4: Future Features */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Smartphone className="w-4 h-4 text-[#00D4FF]" />
            <span>4. الميزات المستقبلية والخدمات الخارجية</span>
          </div>
          <p>
            في حال إضافة ميزات مستقبلية تتطلب الاتصال بخدمات خارجية أو مزامنة سحابية، سيتم إعلامك بوضوح وطلب موافقتك الصريحة قبل مشاركة أي بيانات.
          </p>
        </div>

        {/* Section 5: Contact */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <HelpCircle className="w-4 h-4 text-[#5B5BF7]" />
            <span>5. الاستفسارات والاتصال</span>
          </div>
          <p>
            إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يسعدنا تواصلك معنا عبر البريد الإلكتروني:
            <span className="font-mono text-[#5B5BF7] dark:text-[#7C6CFF] font-bold block mt-1">
              {APP_CONFIG.supportEmail}
            </span>
          </p>
          <span className="text-[10px] text-[var(--app-text-secondary)]/70 block pt-1">
            آخر تحديث: {APP_CONFIG.releaseYear} • الإصدار {APP_CONFIG.version}
          </span>
        </div>
      </div>
    </div>
  );
};
