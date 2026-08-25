import React, { useState, useEffect, useCallback } from 'react';
import { FormattedNumberInput } from '../../components/common/FormattedNumberInput';
import { CalculatorResultCard } from '../../components/common/CalculatorResultCard';
import {
  calculatePercentage,
  validatePercentageInputs,
  PercentageInputs,
  PercentageMode,
} from './logic';
import { CalculationResult } from '../types';
import { Calculator, Plus, Minus } from 'lucide-react';

interface PercentageCalculatorViewProps {
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

export const PercentageCalculatorView: React.FC<PercentageCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [activeMode, setActiveMode] = useState<PercentageMode>(
    initialInputs?.mode || 'percentOfNumber'
  );

  // Mode 1 State
  const [percentValue, setPercentValue] = useState<string>(initialInputs?.percentValue || '');
  const [totalValue, setTotalValue] = useState<string>(initialInputs?.totalValue || '');

  // Mode 2 State
  const [partValue, setPartValue] = useState<string>(initialInputs?.partValue || '');
  const [wholeValue, setWholeValue] = useState<string>(initialInputs?.wholeValue || '');

  // Mode 3 State
  const [baseValue, setBaseValue] = useState<string>(initialInputs?.baseValue || '');
  const [changeRate, setChangeRate] = useState<string>(initialInputs?.changeRate || '');
  const [operation, setOperation] = useState<'increase' | 'decrease'>(
    initialInputs?.operation || 'increase'
  );

  const [errors, setErrors] = useState<{ field1?: string; field2?: string }>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  const executeCalculation = useCallback(
    (recordHistory = false) => {
      const inputs: PercentageInputs = {
        mode: activeMode,
        percentValue,
        totalValue,
        partValue,
        wholeValue,
        baseValue,
        changeRate,
        operation,
      };

      const validation = validatePercentageInputs(inputs);
      if (!validation.isValid) {
        if (recordHistory) {
          setErrors(validation.errors);
        }
        setResult(null);
        return;
      }

      setErrors({});
      const calculated = calculatePercentage(inputs);
      setResult(calculated);

      if (calculated && recordHistory) {
        let summary = '';
        if (activeMode === 'percentOfNumber') {
          summary = `${percentValue}% من ${totalValue}`;
        } else if (activeMode === 'numberRatio') {
          summary = `نسبة ${partValue} من ${wholeValue}`;
        } else {
          summary = `${baseValue} (${operation === 'increase' ? 'زيادة' : 'نقصان'} %${changeRate})`;
        }

        onSaveHistory({
          calculatorId: 'percentage',
          calculatorNameAr: 'حاسبة النسبة المئوية',
          primaryResult: calculated.primaryValue,
          primaryUnit: calculated.primaryUnit,
          badgeText: calculated.badge?.text,
          inputsSummary: summary,
          inputs: {
            mode: activeMode,
            percentValue,
            totalValue,
            partValue,
            wholeValue,
            baseValue,
            changeRate,
            operation,
          },
          details: calculated.details,
        });
      }
    },
    [
      activeMode,
      percentValue,
      totalValue,
      partValue,
      wholeValue,
      baseValue,
      changeRate,
      operation,
      onSaveHistory,
    ]
  );

  // Auto calculate when values change
  useEffect(() => {
    executeCalculation(false);
  }, [
    activeMode,
    percentValue,
    totalValue,
    partValue,
    wholeValue,
    baseValue,
    changeRate,
    operation,
    executeCalculation,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCalculation(true);
    onShowToast('تم حساب النسبة المئوية بنجاح', 'success');
  };

  const handleReset = () => {
    setPercentValue('');
    setTotalValue('');
    setPartValue('');
    setWholeValue('');
    setBaseValue('');
    setChangeRate('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة تعيين الحقول', 'info');
  };

  const handleModeChange = (mode: PercentageMode) => {
    setActiveMode(mode);
    setErrors({});
    setResult(null);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* Modes Segmented Control */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--app-text)] px-1">
          نوع العملية الحسابية
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--app-surface-secondary)] rounded-2xl border border-[var(--app-border)]">
          <button
            type="button"
            onClick={() => handleModeChange('percentOfNumber')}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMode === 'percentOfNumber'
                ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm border border-[var(--app-border)]'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            نسبة من رقم
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('numberRatio')}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMode === 'numberRatio'
                ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm border border-[var(--app-border)]'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            نسبة رقم من رقم
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('increaseDecrease')}
            className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeMode === 'increaseDecrease'
                ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm border border-[var(--app-border)]'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            زيادة / نقصان
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode 1: What is X% of Y? */}
        {activeMode === 'percentOfNumber' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <FormattedNumberInput
              id="pct-rate"
              label="النسبة المئوية المراد حسابها"
              value={percentValue}
              onChange={(val) => {
                setPercentValue(val);
                if (errors.field1) setErrors((prev) => ({ ...prev, field1: undefined }));
              }}
              placeholder="مثال: 25"
              unit="%"
              error={errors.field1}
              required
            />

            <FormattedNumberInput
              id="pct-total"
              label="من الرقم الإجمالي"
              value={totalValue}
              onChange={(val) => {
                setTotalValue(val);
                if (errors.field2) setErrors((prev) => ({ ...prev, field2: undefined }));
              }}
              placeholder="مثال: 200"
              error={errors.field2}
              required
            />
          </div>
        )}

        {/* Mode 2: What percent is X of Y? */}
        {activeMode === 'numberRatio' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <FormattedNumberInput
              id="ratio-part"
              label="الرقم الجزئي"
              value={partValue}
              onChange={(val) => {
                setPartValue(val);
                if (errors.field1) setErrors((prev) => ({ ...prev, field1: undefined }));
              }}
              placeholder="مثال: 50"
              error={errors.field1}
              required
            />

            <FormattedNumberInput
              id="ratio-whole"
              label="الرقم الكلي (الأساسي)"
              value={wholeValue}
              onChange={(val) => {
                setWholeValue(val);
                if (errors.field2) setErrors((prev) => ({ ...prev, field2: undefined }));
              }}
              placeholder="مثال: 200"
              error={errors.field2}
              required
            />
          </div>
        )}

        {/* Mode 3: Increase or Decrease by % */}
        {activeMode === 'increaseDecrease' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Increase / Decrease Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--app-text)] px-1">
                نوع التغير
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOperation('increase')}
                  className={`h-11 flex items-center justify-center gap-2 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    operation === 'increase'
                      ? 'bg-[#19C37D]/15 text-[#19C37D] border-[#19C37D]'
                      : 'bg-[var(--app-surface-secondary)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>زيادة (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperation('decrease')}
                  className={`h-11 flex items-center justify-center gap-2 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    operation === 'decrease'
                      ? 'bg-[#FF5C77]/15 text-[#FF5C77] border-[#FF5C77]'
                      : 'bg-[var(--app-surface-secondary)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span>نقصان (-)</span>
                </button>
              </div>
            </div>

            <FormattedNumberInput
              id="inc-base"
              label="القيمة الأصلية"
              value={baseValue}
              onChange={(val) => {
                setBaseValue(val);
                if (errors.field1) setErrors((prev) => ({ ...prev, field1: undefined }));
              }}
              placeholder="مثال: 200"
              error={errors.field1}
              required
            />

            <FormattedNumberInput
              id="inc-rate"
              label={`نسبة ال${operation === 'increase' ? 'زيادة' : 'نقصان'}`}
              value={changeRate}
              onChange={(val) => {
                setChangeRate(val);
                if (errors.field2) setErrors((prev) => ({ ...prev, field2: undefined }));
              }}
              placeholder="مثال: 10"
              unit="%"
              error={errors.field2}
              required
            />
          </div>
        )}

        {/* Calculate Button */}
        <button
          type="submit"
          id="btn-calculate-percentage"
          className="w-full h-12 rounded-2xl bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm shadow-md shadow-[#5B5BF7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4" />
          <span>احسب النتيجة</span>
        </button>
      </form>

      {/* Result Display Card */}
      {result && (
        <CalculatorResultCard
          result={result}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
