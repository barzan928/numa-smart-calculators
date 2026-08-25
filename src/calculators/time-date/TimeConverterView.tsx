import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeftRight, RotateCcw, AlertCircle } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface TimeConverterViewProps {
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

interface TimeUnit {
  id: string;
  nameAr: string;
  symbolAr: string;
  toSeconds: (v: number) => number;
  fromSeconds: (s: number) => number;
}

const TIME_UNITS: TimeUnit[] = [
  { id: 'sec', nameAr: 'ثوانٍ', symbolAr: 'ثانية', toSeconds: (v) => v, fromSeconds: (s) => s },
  { id: 'min', nameAr: 'دقائق', symbolAr: 'دقيقة', toSeconds: (v) => v * 60, fromSeconds: (s) => s / 60 },
  { id: 'hour', nameAr: 'ساعات', symbolAr: 'ساعة', toSeconds: (v) => v * 3600, fromSeconds: (s) => s / 3600 },
  { id: 'day', nameAr: 'أيام', symbolAr: 'يوم', toSeconds: (v) => v * 86400, fromSeconds: (s) => s / 86400 },
  { id: 'week', nameAr: 'أسابيع', symbolAr: 'أسبوع', toSeconds: (v) => v * 604800, fromSeconds: (s) => s / 604800 },
];

export const TimeConverterView: React.FC<TimeConverterViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [value, setValue] = useState<string>(
    initialInputs?.value?.toString() || '1'
  );
  const [fromUnitId, setFromUnitId] = useState<string>(
    initialInputs?.fromUnit || 'hour'
  );
  const [toUnitId, setToUnitId] = useState<string>(
    initialInputs?.toUnit || 'min'
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    convertedValue: number;
    fromUnit: TimeUnit;
    toUnit: TimeUnit;
    allEquivalents: { unit: TimeUnit; value: number }[];
  } | null>(null);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const calculate = () => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (!value.trim()) {
      setError('يرجى إدخال القيمة الزمنية');
      setResult(null);
      return;
    }

    if (isNaN(num) || num < 0) {
      setError('يرجى إدخال قيمة زمنية موجبة صحيحة');
      setResult(null);
      return;
    }

    setError(null);

    const fromUnit = TIME_UNITS.find((u) => u.id === fromUnitId) || TIME_UNITS[2];
    const toUnit = TIME_UNITS.find((u) => u.id === toUnitId) || TIME_UNITS[1];

    const baseSeconds = fromUnit.toSeconds(num);
    const convertedValue = toUnit.fromSeconds(baseSeconds);

    const allEquivalents = TIME_UNITS.map((u) => ({
      unit: u,
      value: u.fromSeconds(baseSeconds),
    }));

    const res = {
      convertedValue,
      fromUnit,
      toUnit,
      allEquivalents,
    };

    setResult(res);

    const formattedResult =
      convertedValue >= 10000 || (convertedValue < 0.01 && convertedValue > 0)
        ? convertedValue.toLocaleString('en-US', { maximumFractionDigits: 4 })
        : convertedValue.toLocaleString('en-US', { maximumFractionDigits: 2 });

    onSaveHistory({
      calculatorId: 'time-converter',
      calculatorNameAr: 'حاسبة تحويل الوقت',
      primaryResult: formattedResult,
      primaryUnit: toUnit.nameAr,
      badgeText: `${num} ${fromUnit.symbolAr}`,
      inputsSummary: `${num} ${fromUnit.nameAr} إلى ${toUnit.nameAr}`,
      inputs: { value: num, fromUnit: fromUnitId, toUnit: toUnitId },
      details: [
        { label: `القيمة في (${toUnit.nameAr})`, value: `${formattedResult} ${toUnit.symbolAr}`, isHighlighted: true },
        ...allEquivalents
          .filter((eq) => eq.unit.id !== toUnit.id)
          .map((eq) => ({
            label: eq.unit.nameAr,
            value: `${eq.value.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${eq.unit.symbolAr}`,
          })),
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [value, fromUnitId, toUnitId]);

  const handleReset = () => {
    setValue('1');
    setFromUnitId('hour');
    setToUnitId('min');
    setError(null);
    onShowToast('تمت إعادة ضبط المحول', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#5B5BF7]" />
          تحويل الوحدات الزمنية
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            القيمة الزمنية
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="أدخل القيمة"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              error ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
            }`}
          />
          {error && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
              من وحدة
            </label>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 cursor-pointer"
            >
              {TIME_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameAr} ({u.symbolAr})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-2xl bg-[#5B5BF7]/10 hover:bg-[#5B5BF7]/20 border border-[#5B5BF7]/20 text-[#5B5BF7] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              title="تبديل الوحدات"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
              إلى وحدة
            </label>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 cursor-pointer"
            >
              {TIME_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameAr} ({u.symbolAr})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-[var(--app-text-secondary)] hover:text-rose-500 transition-colors cursor-pointer py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {result && (
        <ResultCard
          primaryResult={
            result.convertedValue >= 10000 || (result.convertedValue < 0.01 && result.convertedValue > 0)
              ? result.convertedValue.toLocaleString('en-US', { maximumFractionDigits: 4 })
              : result.convertedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })
          }
          primaryUnit={result.toUnit.nameAr}
          badgeText={`${value} ${result.fromUnit.symbolAr}`}
          badgeColor="indigo"
          details={[
            {
              label: `القيمة المحولة في (${result.toUnit.nameAr})`,
              value: `${result.convertedValue.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${result.toUnit.symbolAr}`,
              isHighlighted: true,
            },
            ...result.allEquivalents
              .filter((eq) => eq.unit.id !== result.toUnit.id)
              .map((eq) => ({
                label: eq.unit.nameAr,
                value: `${eq.value.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${eq.unit.symbolAr}`,
              })),
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
