import React, { useState, useEffect } from 'react';
import { Percent, RotateCcw, AlertCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface ProfitMarginCalculatorViewProps {
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

export const ProfitMarginCalculatorView: React.FC<ProfitMarginCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [cost, setCost] = useState<string>(initialInputs?.cost?.toString() || '');
  const [revenue, setRevenue] = useState<string>(initialInputs?.revenue?.toString() || '');
  const [errors, setErrors] = useState<{ cost?: string; revenue?: string }>({});

  const [result, setResult] = useState<{
    profit: number;
    profitMargin: number;
    markupOnCost: number;
    isProfitable: boolean;
    isBreakEven: boolean;
  } | null>(null);

  const calculate = () => {
    const newErrors: { cost?: string; revenue?: string } = {};

    const numCost = parseFloat(cost.replace(/,/g, ''));
    const numRevenue = parseFloat(revenue.replace(/,/g, ''));

    if (!cost.trim()) {
      newErrors.cost = 'يرجى إدخال قيمة التكلفة';
    } else if (isNaN(numCost) || numCost < 0) {
      newErrors.cost = 'يرجى إدخال مبلغ تكلفة صحيح';
    }

    if (!revenue.trim()) {
      newErrors.revenue = 'يرجى إدخال سعر البيع / الإيراد';
    } else if (isNaN(numRevenue) || numRevenue < 0) {
      newErrors.revenue = 'يرجى إدخال سعر بيع صحيح';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const profit = numRevenue - numCost;
    const profitMargin = numRevenue > 0 ? (profit / numRevenue) * 100 : 0;
    const markupOnCost = numCost > 0 ? (profit / numCost) * 100 : 0;
    const isBreakEven = Math.abs(profit) < 0.0001;
    const isProfitable = profit > 0;

    const res = {
      profit,
      profitMargin,
      markupOnCost,
      isProfitable,
      isBreakEven,
    };

    setResult(res);

    // Save to history
    const badgeText = isBreakEven
      ? 'نقطة تعادل (0%)'
      : isProfitable
      ? `ربح ${res.profitMargin.toFixed(1)}%`
      : `خسارة ${Math.abs(res.profitMargin).toFixed(1)}%`;

    onSaveHistory({
      calculatorId: 'profit-margin',
      calculatorNameAr: 'حاسبة هامش الربح',
      primaryResult: `${res.profitMargin.toFixed(1)}%`,
      primaryUnit: 'هامش الربح',
      badgeText,
      inputsSummary: `التكلفة: ${numCost.toLocaleString('en-US')} د.ع | البيع: ${numRevenue.toLocaleString('en-US')} د.ع`,
      inputs: { cost: numCost, revenue: numRevenue },
      details: [
        { label: 'صافي الربح / الخسارة', value: `${res.profit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
        { label: 'هامش الربح (Profit Margin)', value: `${res.profitMargin.toFixed(2)}%` },
        { label: 'نسبة الزيادة على التكلفة (Markup)', value: `${res.markupOnCost.toFixed(2)}%` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.cost !== undefined && initialInputs?.revenue !== undefined) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setCost('');
    setRevenue('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      {/* Input Card */}
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Percent className="w-4 h-4 text-[#5B5BF7]" />
          بيانات التكلفة والبيع
        </h2>

        {/* Cost Input */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            سعر التكلفة (Cost)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 50000"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.cost ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              د.ع
            </span>
          </div>
          {errors.cost && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.cost}
            </p>
          )}
        </div>

        {/* Revenue Input */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            سعر البيع / الإيراد (Revenue)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 75000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.revenue ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              د.ع
            </span>
          </div>
          {errors.revenue && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.revenue}
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
            احسب هامش الربح
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
          primaryResult={`${result.profitMargin.toFixed(1)}%`}
          primaryUnit="هامش الربح (Margin)"
          badgeText={
            result.isBreakEven
              ? 'نقطة تعادل'
              : result.isProfitable
              ? `ربح (+${result.profitMargin.toFixed(1)}%)`
              : `خسارة (${result.profitMargin.toFixed(1)}%)`
          }
          badgeColor={
            result.isBreakEven ? 'gray' : result.isProfitable ? 'emerald' : 'rose'
          }
          details={[
            {
              label: 'صافي الربح / الفارق المالي',
              value: `${result.profit >= 0 ? '+' : ''}${result.profit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
              isHighlighted: true,
            },
            {
              label: 'هامش الربح من المبيعات (Margin)',
              value: `${result.profitMargin.toFixed(2)}%`,
            },
            {
              label: 'نسبة الزيادة على التكلفة (Markup)',
              value: `${result.markupOnCost.toFixed(2)}%`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
