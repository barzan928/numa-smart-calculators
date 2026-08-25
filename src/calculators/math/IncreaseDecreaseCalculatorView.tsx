import React, { useState, useEffect } from 'react';
import { ArrowUpDown, RotateCcw, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface IncreaseDecreaseCalculatorViewProps {
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

export const IncreaseDecreaseCalculatorView: React.FC<IncreaseDecreaseCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [initialValue, setInitialValue] = useState<string>(
    initialInputs?.initialValue?.toString() || ''
  );
  const [finalValue, setFinalValue] = useState<string>(
    initialInputs?.finalValue?.toString() || ''
  );
  const [errors, setErrors] = useState<{ initial?: string; final?: string }>({});

  const [result, setResult] = useState<{
    diff: number;
    percentChange: number;
    type: 'increase' | 'decrease' | 'same';
    multiplier: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: { initial?: string; final?: string } = {};

    const numInitial = parseFloat(initialValue.replace(/,/g, ''));
    const numFinal = parseFloat(finalValue.replace(/,/g, ''));

    if (!initialValue.trim()) {
      newErrors.initial = 'يرجى إدخال القيمة الأصلية';
    } else if (isNaN(numInitial)) {
      newErrors.initial = 'يرجى إدخال رقم صحيح';
    } else if (numInitial === 0) {
      newErrors.initial = 'لا يمكن حساب نسبة التغير عندما تكون القيمة الأصلية صفراً';
    }

    if (!finalValue.trim()) {
      newErrors.final = 'يرجى إدخال القيمة الجديدة';
    } else if (isNaN(numFinal)) {
      newErrors.final = 'يرجى إدخال رقم صحيح';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const diff = numFinal - numInitial;
    const percentChange = (diff / Math.abs(numInitial)) * 100;
    const type: 'increase' | 'decrease' | 'same' =
      diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'same';
    const multiplier = numFinal / numInitial;

    const res = {
      diff,
      percentChange,
      type,
      multiplier,
    };

    setResult(res);

    const badgeText =
      type === 'increase'
        ? `زيادة +${percentChange.toFixed(1)}%`
        : type === 'decrease'
        ? `نقصان ${percentChange.toFixed(1)}%`
        : 'لا يوجد تغيير (0%)';

    onSaveHistory({
      calculatorId: 'increase-decrease',
      calculatorNameAr: 'حاسبة الزيادة والنقصان',
      primaryResult: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
      primaryUnit: type === 'increase' ? 'زيادة' : type === 'decrease' ? 'نقصان' : 'ثبات',
      badgeText,
      inputsSummary: `من ${numInitial.toLocaleString('en-US')} إلى ${numFinal.toLocaleString('en-US')}`,
      inputs: { initialValue: numInitial, finalValue: numFinal },
      details: [
        { label: 'مقدار التغيير (الفرق)', value: `${diff >= 0 ? '+' : ''}${diff.toLocaleString('en-US', { maximumFractionDigits: 3 })}`, isHighlighted: true },
        { label: 'نسبة التغير المئوية', value: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%` },
        { label: 'المعامل المضاعف (Multiplier)', value: `${multiplier.toFixed(3)}x` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.initialValue !== undefined && initialInputs?.finalValue !== undefined) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setInitialValue('');
    setFinalValue('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#5B5BF7]" />
          مقارنة القيمتين
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الرقم الأصلي (القيمة الابتدائية)
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="مثال: 150"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              errors.initial ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
            }`}
          />
          {errors.initial && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.initial}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الرقم الجديد (القيمة النهائية)
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="مثال: 200"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              errors.final ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
            }`}
          />
          {errors.final && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.final}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب نسبة التغير
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
          primaryResult={`${result.percentChange >= 0 ? '+' : ''}${result.percentChange.toFixed(1)}%`}
          primaryUnit={
            result.type === 'increase'
              ? 'نسبة الزيادة'
              : result.type === 'decrease'
              ? 'نسبة النقصان'
              : 'نسبة التغير'
          }
          badgeText={
            result.type === 'increase'
              ? 'زيادة في القيمة'
              : result.type === 'decrease'
              ? 'نقصان في القيمة'
              : 'ثبات القيمة'
          }
          badgeColor={
            result.type === 'increase'
              ? 'emerald'
              : result.type === 'decrease'
              ? 'rose'
              : 'gray'
          }
          details={[
            {
              label: 'مقدار التغيير (الفرق المطلق)',
              value: `${result.diff >= 0 ? '+' : ''}${result.diff.toLocaleString('en-US', { maximumFractionDigits: 3 })}`,
              isHighlighted: true,
            },
            {
              label: 'نسبة التغير المئوية الدقيقة',
              value: `${result.percentChange >= 0 ? '+' : ''}${result.percentChange.toFixed(2)}%`,
            },
            {
              label: 'المعامل المضاعف (النسبة للعدد الأصلي)',
              value: `${result.multiplier.toFixed(3)}x`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
