import React, { useState, useEffect } from 'react';
import { CalendarPlus, CalendarMinus, RotateCcw, AlertCircle, Calendar } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface AddSubDaysCalculatorViewProps {
  mode: 'add' | 'subtract';
  initialInputs?: Record<string, any>;
  onSaveHistory: (data: {
    calculatorId: string;
    calculatorNameAr: string;
    primaryResult: string;
    primaryUnit?: string;
    badgeText?: string;
    inputsSummary: string;
    inputs: Record<string, any>;
    details: any[];
  }) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const AddSubDaysCalculatorView: React.FC<AddSubDaysCalculatorViewProps> = ({
  mode,
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [baseDate, setBaseDate] = useState<string>(
    initialInputs?.baseDate || new Date().toISOString().split('T')[0]
  );
  const [days, setDays] = useState<string>(
    initialInputs?.days?.toString() || (mode === 'add' ? '30' : '15')
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    targetDateIso: string;
    formattedDateAr: string;
    dayOfWeek: string;
    daysCount: number;
  } | null>(null);

  const calculate = () => {
    if (!baseDate) {
      setError('يرجى اختيار التاريخ الأساسي');
      setResult(null);
      return;
    }

    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays < 0) {
      setError('يرجى إدخال عدد أيام صحيح (0 أو أكثر)');
      setResult(null);
      return;
    }

    setError(null);

    const base = new Date(baseDate + 'T00:00:00');
    const target = new Date(base);

    if (mode === 'add') {
      target.setDate(target.getDate() + numDays);
    } else {
      target.setDate(target.getDate() - numDays);
    }

    const targetDateIso = target.toISOString().split('T')[0];
    const dayOfWeek = ARABIC_DAYS[target.getDay()];
    const formattedDateAr = `${target.getDate()} ${ARABIC_MONTHS[target.getMonth()]} ${target.getFullYear()}`;

    const res = {
      targetDateIso,
      formattedDateAr,
      dayOfWeek,
      daysCount: numDays,
    };

    setResult(res);

    const title = mode === 'add' ? 'حاسبة إضافة أيام إلى تاريخ' : 'حاسبة طرح أيام من تاريخ';

    onSaveHistory({
      calculatorId: mode === 'add' ? 'add-days' : 'subtract-days',
      calculatorNameAr: title,
      primaryResult: `${targetDateIso}`,
      primaryUnit: `يوم ${dayOfWeek}`,
      badgeText: mode === 'add' ? `+ ${numDays} يوم` : `- ${numDays} يوم`,
      inputsSummary: `${baseDate} (${mode === 'add' ? '+' : '-'} ${numDays} يوم)`,
      inputs: { baseDate, days: numDays },
      details: [
        { label: 'التاريخ الناتج', value: `${targetDateIso} (${dayOfWeek})`, isHighlighted: true },
        { label: 'الصيغة النصية', value: formattedDateAr },
        { label: 'التاريخ الأساسي', value: baseDate },
        { label: 'عدد الأيام المعدلة', value: `${numDays} يوم` },
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [baseDate, days, mode]);

  const handleReset = () => {
    setBaseDate(new Date().toISOString().split('T')[0]);
    setDays('30');
    setError(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          {mode === 'add' ? (
            <CalendarPlus className="w-4 h-4 text-[#5B5BF7]" />
          ) : (
            <CalendarMinus className="w-4 h-4 text-[#5B5BF7]" />
          )}
          {mode === 'add' ? 'إضافة أيام إلى تاريخ' : 'طرح أيام من تاريخ'}
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            التاريخ المبدئي (الأساسي)
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            {mode === 'add' ? 'عدد الأيام المراد إضافتها' : 'عدد الأيام المراد طرحها'}
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="مثال: 45"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                error ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              يوم
            </span>
          </div>

          {/* Quick days chips */}
          <div className="flex gap-2 mt-2">
            {['7', '15', '30', '60', '90', '180'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  days === d
                    ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40'
                    : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:bg-[var(--app-surface)]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {error && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {mode === 'add' ? 'احسب التاريخ المستقبلي' : 'احسب التاريخ السابق'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-[var(--app-surface-subtle)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-rose-500 hover:border-rose-500/30 active:scale-95 transition-all cursor-pointer"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {result && (
        <ResultCard
          primaryResult={result.targetDateIso}
          primaryUnit={`يوم ${result.dayOfWeek}`}
          badgeText={result.formattedDateAr}
          badgeColor="indigo"
          details={[
            {
              label: 'التاريخ الناتج',
              value: `${result.targetDateIso} (${result.dayOfWeek})`,
              isHighlighted: true,
            },
            {
              label: 'الصيغة الكاملة',
              value: result.formattedDateAr,
            },
            {
              label: 'التاريخ الأصلي',
              value: baseDate,
            },
            {
              label: 'الفارق الزمني',
              value: `${mode === 'add' ? '+' : '-'} ${result.daysCount} يوم`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
