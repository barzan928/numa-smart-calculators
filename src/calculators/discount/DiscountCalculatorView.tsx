import React, { useState, useEffect, useCallback } from 'react';
import { FormattedNumberInput } from '../../components/common/FormattedNumberInput';
import { CalculatorResultCard } from '../../components/common/CalculatorResultCard';
import { calculateDiscount, validateDiscountInputs, DiscountInputs } from './logic';
import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { Calculator } from 'lucide-react';

interface DiscountCalculatorViewProps {
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

export const DiscountCalculatorView: React.FC<DiscountCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [originalPrice, setOriginalPrice] = useState<string>(initialInputs?.originalPrice || '');
  const [discountRate, setDiscountRate] = useState<string>(initialInputs?.discountRate || '');
  const [errors, setErrors] = useState<{ originalPrice?: string; discountRate?: string }>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Quick discount chips
  const quickDiscountPills = ['5', '10', '15', '20', '25', '50', '70'];

  const executeCalculation = useCallback(
    (priceVal: string, rateVal: string, recordHistory = false) => {
      const inputs: DiscountInputs = {
        originalPrice: priceVal,
        discountRate: rateVal,
        currencySymbol: DEFAULT_CURRENCY.symbol,
      };

      const validation = validateDiscountInputs(inputs);
      if (!validation.isValid) {
        if (recordHistory) {
          setErrors(validation.errors);
        }
        setResult(null);
        return;
      }

      setErrors({});
      const calculated = calculateDiscount(inputs);
      setResult(calculated);

      if (calculated && recordHistory) {
        onSaveHistory({
          calculatorId: 'discount',
          calculatorNameAr: 'حاسبة الخصم',
          primaryResult: calculated.primaryValue,
          primaryUnit: calculated.primaryUnit,
          badgeText: calculated.badge?.text,
          inputsSummary: `سعر: ${priceVal} ${DEFAULT_CURRENCY.symbol} | خصم: ${rateVal}%`,
          inputs: { originalPrice: priceVal, discountRate: rateVal },
          details: calculated.details,
        });
      }
    },
    [onSaveHistory]
  );

  // Trigger live calculation when inputs are valid
  useEffect(() => {
    if (originalPrice && discountRate) {
      executeCalculation(originalPrice, discountRate, false);
    }
  }, [originalPrice, discountRate, executeCalculation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCalculation(originalPrice, discountRate, true);
    if (originalPrice && discountRate) {
      onShowToast('تم حساب الخصم بنجاح', 'success');
    }
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountRate('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة تعيين الحقول', 'info');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Original Price Input */}
        <FormattedNumberInput
          id="discount-original-price"
          label="السعر الأصلي قبل الخصم"
          value={originalPrice}
          onChange={(val) => {
            setOriginalPrice(val);
            if (errors.originalPrice) setErrors((prev) => ({ ...prev, originalPrice: undefined }));
          }}
          placeholder="مثال: 100,000"
          unit={DEFAULT_CURRENCY.symbol}
          error={errors.originalPrice}
          required
        />

        {/* Discount Rate Input */}
        <div className="space-y-2">
          <FormattedNumberInput
            id="discount-rate"
            label="نسبة الخصم"
            value={discountRate}
            onChange={(val) => {
              setDiscountRate(val);
              if (errors.discountRate) setErrors((prev) => ({ ...prev, discountRate: undefined }));
            }}
            placeholder="مثال: 15"
            unit="%"
            error={errors.discountRate}
            required
          />

          {/* Quick preset percentage pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-[var(--app-text-secondary)] ml-1">
              نسب سريعة:
            </span>
            {quickDiscountPills.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  setDiscountRate(rate);
                  if (errors.discountRate) setErrors((prev) => ({ ...prev, discountRate: undefined }));
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  discountRate === rate
                    ? 'bg-[#5B5BF7] text-white border-[#5B5BF7]'
                    : 'bg-[var(--app-surface-secondary)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:text-[var(--app-text)]'
                }`}
              >
                %{rate}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Action Button */}
        <button
          type="submit"
          id="btn-calculate-discount"
          className="w-full h-12 rounded-2xl bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm shadow-md shadow-[#5B5BF7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4" />
          <span>احسب الخصم</span>
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
