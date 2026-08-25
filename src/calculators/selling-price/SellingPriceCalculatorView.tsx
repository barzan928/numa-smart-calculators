import React, { useState, useEffect } from 'react';
import { Tag, RotateCcw, AlertCircle, ShoppingBag, Percent } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface SellingPriceCalculatorViewProps {
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

export const SellingPriceCalculatorView: React.FC<SellingPriceCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [cost, setCost] = useState<string>(initialInputs?.cost?.toString() || '');
  const [margin, setMargin] = useState<string>(initialInputs?.margin?.toString() || '25');
  const [marginType, setMarginType] = useState<'margin' | 'markup'>('markup'); // markup = % of cost, margin = % of selling price
  const [quantity, setQuantity] = useState<string>(initialInputs?.quantity?.toString() || '1');
  const [errors, setErrors] = useState<{ cost?: string; margin?: string; quantity?: string }>({});

  const [result, setResult] = useState<{
    unitSellingPrice: number;
    unitProfit: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    effectiveMargin: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: { cost?: string; margin?: string; quantity?: string } = {};

    const numCost = parseFloat(cost.replace(/,/g, ''));
    const numMargin = parseFloat(margin.replace(/,/g, ''));
    const numQty = quantity.trim() ? parseFloat(quantity.replace(/,/g, '')) : 1;

    if (!cost.trim()) {
      newErrors.cost = 'يرجى إدخال تكلفة المنتج';
    } else if (isNaN(numCost) || numCost <= 0) {
      newErrors.cost = 'يجب أن تكون التكلفة أكبر من صفر';
    }

    if (!margin.trim()) {
      newErrors.margin = 'يرجى إدخال نسبة الربح المستهدفة';
    } else if (isNaN(numMargin) || numMargin < 0) {
      newErrors.margin = 'يرجى إدخال نسبة صحيحة';
    } else if (marginType === 'margin' && numMargin >= 100) {
      newErrors.margin = 'هامش الربح من المبيعات يجب أن يكون أقل من 100%';
    }

    if (quantity.trim() && (isNaN(numQty) || numQty <= 0)) {
      newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    let unitSellingPrice = 0;
    if (marginType === 'markup') {
      // Markup on cost: Price = Cost * (1 + markup/100)
      unitSellingPrice = numCost * (1 + numMargin / 100);
    } else {
      // Margin on price: Price = Cost / (1 - margin/100)
      unitSellingPrice = numCost / (1 - numMargin / 100);
    }

    const unitProfit = unitSellingPrice - numCost;
    const totalCost = numCost * numQty;
    const totalRevenue = unitSellingPrice * numQty;
    const totalProfit = unitProfit * numQty;
    const effectiveMargin = (unitProfit / unitSellingPrice) * 100;

    const res = {
      unitSellingPrice,
      unitProfit,
      totalRevenue,
      totalCost,
      totalProfit,
      effectiveMargin,
    };

    setResult(res);

    // Save to History
    onSaveHistory({
      calculatorId: 'selling-price',
      calculatorNameAr: 'حاسبة سعر البيع',
      primaryResult: `${Math.round(unitSellingPrice).toLocaleString('en-US')}`,
      primaryUnit: 'د.ع / للقطعة',
      badgeText: `ربح ${res.effectiveMargin.toFixed(1)}%`,
      inputsSummary: `التكلفة: ${numCost.toLocaleString('en-US')} د.ع | النسبة: ${numMargin}% | الكمية: ${numQty}`,
      inputs: { cost: numCost, margin: numMargin, marginType, quantity: numQty },
      details: [
        { label: 'سعر البيع المقترح للوحدة', value: `${unitSellingPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
        { label: 'صافي الربح لكل وحدة', value: `${unitProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
        { label: 'إجمالي المبيعات للكمية', value: `${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
        { label: 'إجمالي الربح الصافي', value: `${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.cost !== undefined) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setCost('');
    setMargin('25');
    setQuantity('1');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        {/* Method Toggle */}
        <div className="flex p-1 bg-[var(--app-surface-subtle)] rounded-2xl border border-[var(--app-border)]">
          <button
            type="button"
            onClick={() => setMarginType('markup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              marginType === 'markup'
                ? 'bg-[var(--app-surface)] text-[#5B5BF7] shadow-sm'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            نسبة زيادة على التكلفة (Markup)
          </button>
          <button
            type="button"
            onClick={() => setMarginType('margin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              marginType === 'margin'
                ? 'bg-[var(--app-surface)] text-[#5B5BF7] shadow-sm'
                : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
            }`}
          >
            هامش من سعر البيع (Margin)
          </button>
        </div>

        {/* Cost input */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            تكلفة الوحدة الواحدة
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 10000"
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

        {/* Margin input */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            نسبة الربح المستهدفة (%)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 25"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.margin ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              %
            </span>
          </div>
          {/* Quick margin chips */}
          <div className="flex gap-2 mt-2">
            {['10', '20', '25', '30', '50'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMargin(m)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  margin === m
                    ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40'
                    : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:bg-[var(--app-surface)]'
                }`}
              >
                {m}%
              </button>
            ))}
          </div>
          {errors.margin && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.margin}
            </p>
          )}
        </div>

        {/* Quantity (optional) */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الكمية الإجمالية (اختياري)
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="الافتراضي: 1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              errors.quantity ? 'border-rose-500' : 'border-[var(--app-border)]'
            }`}
          />
          {errors.quantity && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب سعر البيع
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
          primaryResult={`${result.unitSellingPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
          primaryUnit="د.ع (سعر بيع القطعة)"
          badgeText={`ربح ${result.unitProfit.toLocaleString('en-US', { maximumFractionDigits: 1 })} د.ع/قطعة`}
          badgeColor="emerald"
          details={[
            {
              label: 'سعر البيع للوحدة',
              value: `${result.unitSellingPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
              isHighlighted: true,
            },
            {
              label: 'قيمة الربح في الوحدة',
              value: `${result.unitProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
            },
            {
              label: 'هامش الربح الفعلي من المبيعات',
              value: `${result.effectiveMargin.toFixed(1)}%`,
            },
            {
              label: 'إجمالي المبيعات المتوقعة',
              value: `${result.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
            },
            {
              label: 'إجمالي الأرباح الصافية',
              value: `${result.totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
