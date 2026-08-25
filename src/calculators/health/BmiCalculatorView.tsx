import React, { useState, useEffect } from 'react';
import { HeartPulse, RotateCcw, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface BmiCalculatorViewProps {
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

export const BmiCalculatorView: React.FC<BmiCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [weight, setWeight] = useState<string>(
    initialInputs?.weight?.toString() || '75'
  );
  const [height, setHeight] = useState<string>(
    initialInputs?.height?.toString() || '175'
  );
  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    badgeColor: 'emerald' | 'indigo' | 'amber' | 'rose';
    healthyMinWeight: number;
    healthyMaxWeight: number;
    weightDiff: number; // to reach normal range
  } | null>(null);

  const calculate = () => {
    const newErrors: { weight?: string; height?: string } = {};

    const numWeight = parseFloat(weight.replace(/,/g, ''));
    const numHeight = parseFloat(height.replace(/,/g, ''));

    if (!weight.trim()) {
      newErrors.weight = 'يرجى إدخال الوزن بالكيلوجرام';
    } else if (isNaN(numWeight) || numWeight < 20 || numWeight > 300) {
      newErrors.weight = 'يرجى إدخال وزن صحيح بين 20 و 300 كجم';
    }

    if (!height.trim()) {
      newErrors.height = 'يرجى إدخال الطول بالسنتيمتر';
    } else if (isNaN(numHeight) || numHeight < 80 || numHeight > 250) {
      newErrors.height = 'يرجى إدخال طول صحيح بين 80 و 250 سم';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const heightInMeters = numHeight / 100;
    const bmi = numWeight / (heightInMeters * heightInMeters);

    let category = '';
    let badgeColor: 'emerald' | 'indigo' | 'amber' | 'rose' = 'emerald';

    if (bmi < 18.5) {
      category = 'نقص في الوزن (نحافة)';
      badgeColor = 'amber';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'وزن طبيعي وصحي';
      badgeColor = 'emerald';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'زيادة في الوزن';
      badgeColor = 'amber';
    } else if (bmi >= 30 && bmi < 35) {
      category = 'سمنة من الدرجة الأولى';
      badgeColor = 'rose';
    } else {
      category = 'سمنة مفرطة (شديدة)';
      badgeColor = 'rose';
    }

    const healthyMinWeight = 18.5 * (heightInMeters * heightInMeters);
    const healthyMaxWeight = 24.9 * (heightInMeters * heightInMeters);

    let weightDiff = 0;
    if (numWeight < healthyMinWeight) {
      weightDiff = healthyMinWeight - numWeight;
    } else if (numWeight > healthyMaxWeight) {
      weightDiff = numWeight - healthyMaxWeight;
    }

    const res = {
      bmi,
      category,
      badgeColor,
      healthyMinWeight,
      healthyMaxWeight,
      weightDiff,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'bmi',
      calculatorNameAr: 'حاسبة كتلة الجسم BMI',
      primaryResult: bmi.toFixed(1),
      primaryUnit: 'مؤشر BMI',
      badgeText: category,
      inputsSummary: `الوزن: ${numWeight} كجم | الطول: ${numHeight} سم`,
      inputs: { weight: numWeight, height: numHeight },
      details: [
        { label: 'مؤشر كتلة الجسم (BMI)', value: bmi.toFixed(2), isHighlighted: true },
        { label: 'التصنيف الصحي', value: category },
        {
          label: 'نطاق الوزن الطبيعي المثالي لطولك',
          value: `${healthyMinWeight.toFixed(1)} - ${healthyMaxWeight.toFixed(1)} كجم`,
        },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.weight || initialInputs?.height) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#5B5BF7]" />
          بيانات الجسم
        </h2>

        {/* Weight */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الوزن الحالي
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.weight ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              كجم
            </span>
          </div>
          {errors.weight && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.weight}
            </p>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الطول
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.height ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              سم
            </span>
          </div>
          {errors.height && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.height}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب كتلة الجسم BMI
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

      {/* Result Display */}
      {result && (
        <div className="space-y-4">
          <ResultCard
            primaryResult={result.bmi.toFixed(1)}
            primaryUnit="مؤشر BMI"
            badgeText={result.category}
            badgeColor={result.badgeColor}
            details={[
              {
                label: 'مؤشر كتلة الجسم',
                value: result.bmi.toFixed(2),
                isHighlighted: true,
              },
              {
                label: 'التصنيف الصحي العام',
                value: result.category,
              },
              {
                label: 'نطاق الوزن الطبيعي المثالي لطولك',
                value: `${result.healthyMinWeight.toFixed(1)} - ${result.healthyMaxWeight.toFixed(1)} كجم`,
              },
            ]}
            onReset={handleReset}
            onShowToast={onShowToast}
          />

          {/* Medical Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">تنبيه صحي استرشادي:</p>
              <p>
                مؤشر كتلة الجسم (BMI) هو أداة حسابية تقديرية للأفراد البالغين ولا يعكس توزيع نسبة الدهون والعضلات، ولا يعتبر بديلاً عن الفحص الطبي أو التشخيص التخصصي.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
