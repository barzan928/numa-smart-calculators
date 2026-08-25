import React, { useState, useEffect } from 'react';
import { Scale, RotateCcw, AlertCircle, ShieldAlert } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface IdealWeightCalculatorViewProps {
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

export const IdealWeightCalculatorView: React.FC<IdealWeightCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [height, setHeight] = useState<string>(
    initialInputs?.height?.toString() || '175'
  );
  const [gender, setGender] = useState<'male' | 'female'>(
    initialInputs?.gender || 'male'
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    avgIdeal: number;
    bmiMin: number;
    bmiMax: number;
    devine: number;
    robinson: number;
    hamwi: number;
  } | null>(null);

  const calculate = () => {
    const numHeight = parseFloat(height.replace(/,/g, ''));

    if (!height.trim() || isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
      setError('أدخل طولاً صحيحاً بين 100 و 250 سم');
      setResult(null);
      return;
    }

    setError(null);

    const heightInMeters = numHeight / 100;
    const heightInInches = numHeight / 2.54;
    const inchesOver5Feet = Math.max(0, heightInInches - 60);

    // Formulas (standard formulas assume base 5 feet = 60 inches)
    // Devine (1974)
    const devine =
      gender === 'male'
        ? 50 + 2.3 * inchesOver5Feet
        : 45.5 + 2.3 * inchesOver5Feet;

    // Robinson (1983)
    const robinson =
      gender === 'male'
        ? 52 + 1.9 * inchesOver5Feet
        : 49 + 1.7 * inchesOver5Feet;

    // Hamwi (1964)
    const hamwi =
      gender === 'male'
        ? 48 + 2.7 * inchesOver5Feet
        : 45.5 + 2.2 * inchesOver5Feet;

    // BMI healthy range 18.5 - 24.9
    const bmiMin = 18.5 * (heightInMeters * heightInMeters);
    const bmiMax = 24.9 * (heightInMeters * heightInMeters);

    const avgIdeal = (devine + robinson + hamwi) / 3;

    const res = {
      avgIdeal,
      bmiMin,
      bmiMax,
      devine,
      robinson,
      hamwi,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'ideal-weight',
      calculatorNameAr: 'حاسبة الوزن المثالي',
      primaryResult: `${avgIdeal.toFixed(1)} كجم`,
      primaryUnit: 'متوسط الوزن المثالي',
      badgeText: `${bmiMin.toFixed(0)} - ${bmiMax.toFixed(0)} كجم`,
      inputsSummary: `الطول: ${numHeight} سم | الجنس: ${gender === 'male' ? 'ذكر' : 'أنثى'}`,
      inputs: { height: numHeight, gender },
      details: [
        { label: 'متوسط الوزن المثالي الموصى به', value: `${avgIdeal.toFixed(1)} كجم`, isHighlighted: true },
        { label: 'نطاق الوزن الصحي حسب BMI (18.5 - 24.9)', value: `${bmiMin.toFixed(1)} - ${bmiMax.toFixed(1)} كجم` },
        { label: 'حسب معادلة ديفاين (Devine)', value: `${devine.toFixed(1)} كجم` },
        { label: 'حسب معادلة روبنسون (Robinson)', value: `${robinson.toFixed(1)} كجم` },
        { label: 'حسب معادلة هاموي (Hamwi)', value: `${hamwi.toFixed(1)} كجم` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.height) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setHeight('');
    setGender('male');
    setError(null);
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#5B5BF7]" />
          تحديد الطول والجنس
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الجنس
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`h-11 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                gender === 'male'
                  ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40 shadow-xs'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)]'
              }`}
            >
              ذكر
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`h-11 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                gender === 'female'
                  ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40 shadow-xs'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)]'
              }`}
            >
              أنثى
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الطول الحالي
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                error ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              سم
            </span>
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
            احسب الوزن المثالي
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
        <div className="space-y-4">
          <ResultCard
            primaryResult={`${result.avgIdeal.toFixed(1)}`}
            primaryUnit="كجم (متوسط الوزن المثالي)"
            badgeText={`النطاق الصحي: ${result.bmiMin.toFixed(0)} - ${result.bmiMax.toFixed(0)} كجم`}
            badgeColor="emerald"
            details={[
              {
                label: 'متوسط الوزن المثالي الموصى به',
                value: `${result.avgIdeal.toFixed(1)} كجم`,
                isHighlighted: true,
              },
              {
                label: 'نطاق الوزن الطبيعي لمؤشر كتلة الجسم (BMI)',
                value: `${result.bmiMin.toFixed(1)} - ${result.bmiMax.toFixed(1)} كجم`,
              },
              {
                label: 'معادلة ديفاين (Devine Formula)',
                value: `${result.devine.toFixed(1)} كجم`,
              },
              {
                label: 'معادلة روبنسون (Robinson Formula)',
                value: `${result.robinson.toFixed(1)} كجم`,
              },
              {
                label: 'معادلة هاموي (Hamwi Formula)',
                value: `${result.hamwi.toFixed(1)} كجم`,
              },
            ]}
            onReset={handleReset}
            onShowToast={onShowToast}
          />

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">تنبيه استرشادي:</p>
              <p>
                الوزن المثالي هو مؤشر عام يختلف من شخص لآخر حسب البنية العضلية والعظمية ونسبة الدهون، ولا يعد تشخيصاً طبياً ملزماً.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
