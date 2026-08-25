import React, { useState, useEffect } from 'react';
import { Divide, Plus, Trash2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface AverageCalculatorViewProps {
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

export const AverageCalculatorView: React.FC<AverageCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [numbers, setNumbers] = useState<string[]>(
    initialInputs?.numbers && Array.isArray(initialInputs.numbers)
      ? initialInputs.numbers.map((n: any) => n.toString())
      : ['10', '20', '30']
  );
  const [quickInput, setQuickInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    mean: number;
    sum: number;
    count: number;
    median: number;
    min: number;
    max: number;
    range: number;
  } | null>(null);

  const handleAddNumber = () => {
    setNumbers((prev) => [...prev, '']);
  };

  const handleRemoveNumber = (index: number) => {
    if (numbers.length <= 1) {
      setNumbers(['']);
      return;
    }
    setNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNumber = (index: number, val: string) => {
    setNumbers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleParseQuickInput = () => {
    if (!quickInput.trim()) return;
    const parsed = quickInput
      .split(/[\s,،]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !isNaN(Number(s)));

    if (parsed.length === 0) {
      setError('لم يتم العثور على أرقام صالحة في النص المدخل');
      return;
    }

    setNumbers(parsed);
    setQuickInput('');
    setError(null);
    onShowToast(`تمت إضافة ${parsed.length} أرقام`, 'info');
  };

  const calculate = () => {
    const validNums = numbers
      .map((n) => parseFloat(n.replace(/,/g, '')))
      .filter((n) => !isNaN(n));

    if (validNums.length === 0) {
      setError('يرجى إدخال رقم واحد على الأقل للحساب');
      setResult(null);
      return;
    }

    setError(null);

    const sum = validNums.reduce((acc, curr) => acc + curr, 0);
    const count = validNums.length;
    const mean = sum / count;

    // Median
    const sorted = [...validNums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const min = Math.min(...validNums);
    const max = Math.max(...validNums);
    const range = max - min;

    const res = {
      mean,
      sum,
      count,
      median,
      min,
      max,
      range,
    };

    setResult(res);

    // Save to History
    onSaveHistory({
      calculatorId: 'average',
      calculatorNameAr: 'حاسبة المتوسط الحسابي',
      primaryResult: Number.isInteger(mean) ? mean.toString() : mean.toFixed(2),
      primaryUnit: 'المتوسط',
      badgeText: `${count} قيم`,
      inputsSummary: `الأرقام: ${validNums.slice(0, 4).join(', ')}${validNums.length > 4 ? '...' : ''}`,
      inputs: { numbers: validNums },
      details: [
        { label: 'المتوسط الحسابي (Mean)', value: mean.toLocaleString('en-US', { maximumFractionDigits: 3 }), isHighlighted: true },
        { label: 'المجموع الكلي (Sum)', value: sum.toLocaleString('en-US', { maximumFractionDigits: 2 }) },
        { label: 'عدد القيم (Count)', value: count.toString() },
        { label: 'الوسيط (Median)', value: median.toLocaleString('en-US', { maximumFractionDigits: 2 }) },
        { label: 'أصغر قيمة (Min)', value: min.toLocaleString('en-US') },
        { label: 'أكبر قيمة (Max)', value: max.toLocaleString('en-US') },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.numbers) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setNumbers(['', '', '']);
    setQuickInput('');
    setError(null);
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
            <Divide className="w-4 h-4 text-[#5B5BF7]" />
            إدخال القيم والأرقام
          </h2>
          <span className="text-xs font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2.5 py-1 rounded-xl">
            {numbers.filter((n) => n.trim() !== '').length} قيم
          </span>
        </div>

        {/* Quick paste input */}
        <div className="p-3 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl space-y-2">
          <label className="block text-[11px] font-bold text-[var(--app-text-secondary)]">
            لصق سريع لأرقام متعددة (مفصولة بفواصل أو مسافات):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="مثال: 10, 25, 40, 85, 100"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="flex-1 h-9 px-3 text-xs bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 font-medium"
            />
            <button
              type="button"
              onClick={handleParseQuickInput}
              className="px-3 h-9 bg-[#5B5BF7] text-white text-xs font-bold rounded-xl hover:bg-[#4E4EE0] transition-all cursor-pointer"
            >
              استخراج
            </button>
          </div>
        </div>

        {/* Individual Inputs List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {numbers.map((val, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-[var(--app-text-secondary)]">
                {idx + 1}.
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder={`القيمة رقم ${idx + 1}`}
                value={val}
                onChange={(e) => handleUpdateNumber(idx, e.target.value)}
                className="flex-1 h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all"
              />
              <button
                type="button"
                onClick={() => handleRemoveNumber(idx)}
                aria-label={`حذف القيمة رقم ${idx + 1}`}
                className="w-11 h-11 rounded-2xl bg-[var(--app-surface-subtle)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add item button */}
        <button
          type="button"
          onClick={handleAddNumber}
          className="w-full h-10 border border-dashed border-[#5B5BF7]/40 bg-[#5B5BF7]/5 hover:bg-[#5B5BF7]/10 text-[#5B5BF7] rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          إضافة قيمة جديدة
        </button>

        {error && (
          <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب المتوسط والإحصائيات
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
        <ResultCard
          primaryResult={Number.isInteger(result.mean) ? result.mean.toString() : result.mean.toFixed(2)}
          primaryUnit="المتوسط الحسابي"
          badgeText={`${result.count} قيم`}
          badgeColor="indigo"
          details={[
            {
              label: 'المتوسط الحسابي (Mean)',
              value: result.mean.toLocaleString('en-US', { maximumFractionDigits: 3 }),
              isHighlighted: true,
            },
            {
              label: 'المجموع الكلي لجميع القيم',
              value: result.sum.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            },
            {
              label: 'الوسيط الإحصائي (Median)',
              value: result.median.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            },
            {
              label: 'أصغر قيمة (Min)',
              value: result.min.toLocaleString('en-US'),
            },
            {
              label: 'أكبر قيمة (Max)',
              value: result.max.toLocaleString('en-US'),
            },
            {
              label: 'المدى (الفارق بين الأكبر والأصغر)',
              value: result.range.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
