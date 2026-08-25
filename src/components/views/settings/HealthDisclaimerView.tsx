import React from 'react';
import { ArrowRight, HeartPulse, AlertTriangle, Stethoscope, Activity, CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '../../../types/settings';

interface HealthDisclaimerViewProps {
  onBack: () => void;
}

export const HealthDisclaimerView: React.FC<HealthDisclaimerViewProps> = ({ onBack }) => {
  return (
    <div id="health-disclaimer-view" className="w-full flex flex-col pt-3 pb-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
        <button
          type="button"
          id="btn-health-disclaimer-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للإعدادات</span>
        </button>

        <span className="text-xs font-bold text-[var(--app-text-secondary)]">
          تنبيه صحي
        </span>
      </div>

      {/* Hero Notice Card */}
      <div className="p-5 my-4 rounded-2xl bg-gradient-to-br from-[#FFB020]/15 via-[var(--app-surface)] to-[var(--app-surface)] border border-[#FFB020]/30 shadow-sm flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center shrink-0">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[var(--app-text)]">
            تنبيه صحي ومعلومات طبية هامة
          </h1>
          <p className="text-xs font-bold text-[#FFB020] mt-1">
            النتائج الصحية تقديرية ولأغراض معلوماتية فقط، ولا تُعد تشخيصاً أو بديلاً عن استشارة الطبيب أو المختص.
          </p>
        </div>
      </div>

      {/* Details & Guidelines */}
      <div className="space-y-4 text-xs leading-relaxed text-[var(--app-text-secondary)]">
        {/* Card 1: Statistical Equations */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Activity className="w-4 h-4 text-[#5B5BF7]" />
            <span>طبيعة المعادلات الصحية في {APP_CONFIG.name}</span>
          </div>
          <p>
            تعتمد أدوات الصحة في تطبيق {APP_CONFIG.name} (مثل حاسبة مؤشر كتلة الجسم BMI، حاسبة السعرات الحرارية اليومية TDEE/BMR، وحاسبة الوزن المثالي) على معادلات رياضية وإحصائية عامة معتمدة عالمياً (مثل معادلة Mifflin-St Jeor وDevine).
          </p>
        </div>

        {/* Card 2: Individual Variations */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
            <span>الفروق الفردية وحالات الاستثناء</span>
          </div>
          <p>
            لا تأخذ هذه المعادلات العامة في الاعتبار الفروق البيولوجية الفردية مثل:
          </p>
          <ul className="list-disc list-inside pr-2 space-y-1 text-[var(--app-text)] font-medium">
            <li>نسبة الكتلة العضلية وكثافة العظام (خاصة للرياضيين).</li>
            <li>الحالات الطبية الخاصة، الحمل والرضاعة، أو الأمراض المزمنة.</li>
            <li>الفئات العمرية الخاصة كالأطفال وكبار السن.</li>
          </ul>
        </div>

        {/* Card 3: Consulting Health Professionals */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Stethoscope className="w-4 h-4 text-[#19C37D]" />
            <span>استشارة الأطباء وأخصائيي التغذية</span>
          </div>
          <p>
            إذا كنت تخطط لبدء نظام غذائي جديد، برنامج تدريبي مكثف، أو لديك أي مخاوف صحية، فإننا نوصي دائماً باستشارة طبيب أو أخصائي تغذية معتمد للحصول على خطة مخصصة لحالتك الصحية.
          </p>
        </div>

        {/* Card 4: Summary */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface-secondary)] border border-[var(--app-border)] flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#19C37D] shrink-0" />
          <span className="text-[11px] text-[var(--app-text)] font-medium">
            الهدف من هذه الأدوات هو التوعية والمساعدة الإرشادية فقط دون أي ادعاء لتقديم خدمات أو تشخيصات طبية.
          </span>
        </div>
      </div>
    </div>
  );
};
