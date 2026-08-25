import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { UNIT_CATEGORIES, UnitCategoryConfig, UnitDefinition } from './conversionsData';
import { ResultCard } from '../../components/common/ResultCard';

interface UnitConverterViewProps {
  categoryKey: string; // 'length' | 'weight' | 'area' | 'volume' | 'temperature' | 'speed'
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

export const UnitConverterView: React.FC<UnitConverterViewProps> = ({
  categoryKey,
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const config: UnitCategoryConfig =
    UNIT_CATEGORIES[categoryKey] || UNIT_CATEGORIES.length;

  const [value, setValue] = useState<string>(
    initialInputs?.value?.toString() || '1'
  );
  const [fromUnitId, setFromUnitId] = useState<string>(
    initialInputs?.fromUnit || config.defaultFrom
  );
  const [toUnitId, setToUnitId] = useState<string>(
    initialInputs?.toUnit || config.defaultTo
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    convertedValue: number;
    fromUnit: UnitDefinition;
    toUnit: UnitDefinition;
    allEquivalents: { unit: UnitDefinition; value: number }[];
  } | null>(null);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const calculate = () => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (!value.trim()) {
      setError('يرجى إدخال القيمة المراد تحويلها');
      setResult(null);
      return;
    }

    if (isNaN(num)) {
      setError('يرجى إدخال رقم صحيح');
      setResult(null);
      return;
    }

    // Special checks: absolute zero in temperature
    if (categoryKey === 'temperature') {
      if (fromUnitId === 'c' && num < -273.15) {
        setError('درجة الحرارة لا يمكن أن تقل عن الصفر المطلق (-273.15 °C)');
        setResult(null);
        return;
      }
      if (fromUnitId === 'k' && num < 0) {
        setError('درجة حرارة الكلفن لا يمكن أن تكون سالبة');
        setResult(null);
        return;
      }
    } else if (num < 0) {
      setError('يرجى إدخال قيمة موجبة');
      setResult(null);
      return;
    }

    setError(null);

    const fromUnit = config.units.find((u) => u.id === fromUnitId) || config.units[0];
    const toUnit = config.units.find((u) => u.id === toUnitId) || config.units[1];

    // Convert via base
    const baseValue = fromUnit.toBase(num);
    const convertedValue = toUnit.fromBase(baseValue);

    // Calculate all other equivalents
    const allEquivalents = config.units.map((u) => ({
      unit: u,
      value: u.fromBase(baseValue),
    }));

    const res = {
      convertedValue,
      fromUnit,
      toUnit,
      allEquivalents,
    };

    setResult(res);

    // Format display
    const formattedResult =
      Math.abs(convertedValue) < 0.0001 || Math.abs(convertedValue) > 1000000
        ? convertedValue.toExponential(4)
        : convertedValue.toLocaleString('en-US', { maximumFractionDigits: 6 });

    // Save to History
    onSaveHistory({
      calculatorId: categoryKey,
      calculatorNameAr: config.titleAr,
      primaryResult: formattedResult,
      primaryUnit: toUnit.nameAr,
      badgeText: `${num} ${fromUnit.symbolAr} = ${formattedResult} ${toUnit.symbolAr}`,
      inputsSummary: `${num} ${fromUnit.nameAr} إلى ${toUnit.nameAr}`,
      inputs: { value: num, fromUnit: fromUnitId, toUnit: toUnitId },
      details: [
        {
          label: `النتيجة في (${toUnit.nameAr})`,
          value: `${formattedResult} ${toUnit.symbolAr}`,
          isHighlighted: true,
        },
        ...allEquivalents
          .filter((eq) => eq.unit.id !== toUnit.id)
          .map((eq) => ({
            label: eq.unit.nameAr,
            value: `${
              Math.abs(eq.value) < 0.0001 || Math.abs(eq.value) > 1000000
                ? eq.value.toExponential(4)
                : eq.value.toLocaleString('en-US', { maximumFractionDigits: 4 })
            } ${eq.unit.symbolAr}`,
          })),
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [value, fromUnitId, toUnitId, categoryKey]);

  const handleReset = () => {
    setValue('1');
    setFromUnitId(config.defaultFrom);
    setToUnitId(config.defaultTo);
    setError(null);
    onShowToast('تمت إعادة ضبط المحول', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-[#5B5BF7]" />
          {config.titleAr}
        </h2>

        {/* Input Value */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            القيمة المراد تحويلها
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="أدخل القيمة"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
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

        {/* From / To Unit Selectors + Swap */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 pt-1">
          {/* From Unit */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
              من وحدة
            </label>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 cursor-pointer"
            >
              {config.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameAr} ({u.symbolAr})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
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

          {/* To Unit */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
              إلى وحدة
            </label>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 cursor-pointer"
            >
              {config.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameAr} ({u.symbolAr})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Reset */}
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

      {/* Result Display */}
      {result && (
        <ResultCard
          primaryResult={
            Math.abs(result.convertedValue) < 0.0001 || Math.abs(result.convertedValue) > 1000000
              ? result.convertedValue.toExponential(4)
              : result.convertedValue.toLocaleString('en-US', { maximumFractionDigits: 6 })
          }
          primaryUnit={`${result.toUnit.nameAr} (${result.toUnit.symbolAr})`}
          badgeText={`${value} ${result.fromUnit.symbolAr}`}
          badgeColor="indigo"
          details={[
            {
              label: `القيمة المحولة إلى (${result.toUnit.nameAr})`,
              value: `${
                Math.abs(result.convertedValue) < 0.0001 || Math.abs(result.convertedValue) > 1000000
                  ? result.convertedValue.toExponential(4)
                  : result.convertedValue.toLocaleString('en-US', { maximumFractionDigits: 6 })
              } ${result.toUnit.symbolAr}`,
              isHighlighted: true,
            },
            ...result.allEquivalents
              .filter((eq) => eq.unit.id !== result.toUnit.id)
              .map((eq) => ({
                label: eq.unit.nameAr,
                value: `${
                  Math.abs(eq.value) < 0.0001 || Math.abs(eq.value) > 1000000
                    ? eq.value.toExponential(4)
                    : eq.value.toLocaleString('en-US', { maximumFractionDigits: 4 })
                } ${eq.unit.symbolAr}`,
              })),
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
