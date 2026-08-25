import React from 'react';
import { ArrowRight, FileText, CheckCircle2, AlertTriangle, Scale, ShieldAlert } from 'lucide-react';
import { APP_CONFIG } from '../../../types/settings';

interface TermsOfUseViewProps {
  onBack: () => void;
  onOpenHealthDisclaimer?: () => void;
}

export const TermsOfUseView: React.FC<TermsOfUseViewProps> = ({ onBack, onOpenHealthDisclaimer }) => {
  return (
    <div id="terms-of-use-view" className="w-full flex flex-col pt-3 pb-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
        <button
          type="button"
          id="btn-terms-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5B5BF7] dark:text-[#7C6CFF] hover:underline cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للإعدادات</span>
        </button>

        <span className="text-xs font-bold text-[var(--app-text-secondary)]">
          شروط الاستخدام
        </span>
      </div>

      {/* Header Banner */}
      <div className="p-5 my-4 rounded-2xl bg-gradient-to-br from-[#7C4DFF]/10 via-[var(--app-surface)] to-[var(--app-surface)] border border-[#7C4DFF]/20 shadow-sm flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#7C4DFF]/15 text-[#7C4DFF] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[var(--app-text)]">
            شروط وأحكام استخدام {APP_CONFIG.name}
          </h1>
          <p className="text-xs text-[var(--app-text-secondary)] mt-1 leading-relaxed">
            باستخدامك لتطبيق {APP_CONFIG.name}، فإنك توافق على الشروط والبنود التالية المنظمة لاستخدام الأدوات والحاسبات.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 text-xs leading-relaxed text-[var(--app-text-secondary)]">
        {/* Section 1: Nature of Service */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <CheckCircle2 className="w-4 h-4 text-[#5B5BF7]" />
            <span>1. طبيعة الخدمات والأدوات</span>
          </div>
          <p>
            يقدم تطبيق {APP_CONFIG.name} مجموعة متنوعة من الأدوات والحاسبات المساعدة في المجالات المالية، الرياضية، التحويلات، والتاريخ لتسهيل العمليات الحسابية اليومية.
          </p>
        </div>

        {/* Section 2: Informational Purpose Disclaimer */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
            <span>2. أغراض معلوماتية وتقديرية فقط</span>
          </div>
          <p className="text-[var(--app-text)] font-medium">
            جميع النتائج والمخرجات الحسابية المعروضة داخل التطبيق مقدمة لأغراض إرشادية وتثقيفية وتقديرية فقط.
          </p>
          <p>
            على الرغم من حرصنا الشديد على دقة المعادلات والخوارزميات البرمجية، فإن المستخدم يتحمل المسؤولية الكاملة عن مراجعة والتحقق من صحة النتائج قبل اتخاذ أي قرارات مالية، تجارية، أو تعاقدية مهمة.
          </p>
        </div>

        {/* Section 3: Health & Medical Specific Warning */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
              <ShieldAlert className="w-4 h-4 text-[#FF5C77]" />
              <span>3. إخلاء المسؤولية الصحية والطبية</span>
            </div>
            {onOpenHealthDisclaimer && (
              <button
                type="button"
                onClick={onOpenHealthDisclaimer}
                className="text-[11px] font-bold text-[#FF5C77] hover:underline cursor-pointer"
              >
                قراءة التنبيه الصحي
              </button>
            )}
          </div>
          <p>
            الحاسبات المرتبطة بالصحة (مثل مؤشر كتلة الجسم BMI، والسعرات الحرارية، والوزن المثالي) تعتمد على معادلات إحصائية عامة ولا تُعتبر بأي حال من الأحوال استشارة طبية أو تشخيصاً رسمياً.
          </p>
        </div>

        {/* Section 4: Limitation of Liability */}
        <div className="p-4 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
            <Scale className="w-4 h-4 text-[#00D4FF]" />
            <span>4. حدود المسؤولية</span>
          </div>
          <p>
            لا يتحمل مطورو تطبيق {APP_CONFIG.name} أي مسؤولية عن أي خسائر مادية أو أضرار مباشرة أو غير مباشرة ناتجة عن الاعتماد الحصري على النتائج الحسابية التقديرية.
          </p>
          <span className="text-[10px] text-[var(--app-text-secondary)]/70 block pt-1">
            الإصدار {APP_CONFIG.version} • {APP_CONFIG.releaseYear} {APP_CONFIG.name}
          </span>
        </div>
      </div>
    </div>
  );
};
