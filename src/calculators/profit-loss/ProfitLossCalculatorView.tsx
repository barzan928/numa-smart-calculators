import React, { useState, useEffect, useCallback } from 'react';
import { FormattedNumberInput } from '../../components/common/FormattedNumberInput';
import { CalculatorResultCard } from '../../components/common/CalculatorResultCard';
import { calculateProfitLoss, validateProfitLossInputs, ProfitLossInputs } from './logic';
import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { Calculator } from 'lucide-react';

interface ProfitLossCalculatorViewProps {
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

export const ProfitLossCalculatorView: React.FC<ProfitLossCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [costPrice, setCostPrice] = useState<string>(initialInputs?.costPrice || '');
  const [sellingPrice, setSellingPrice] = useState<string>(initialInputs?.sellingPrice || '');
  const [quantity, setQuantity] = useState<string>(initialInputs?.quantity || '1');

  const [errors, setErrors] = useState<{
    costPrice?: string;
    sellingPrice?: string;
    quantity?: string;
  }>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  const executeCalculation = useCallback(
    (costVal: string, sellVal: string, qtyVal: string, recordHistory = false) => {
      const inputs: ProfitLossInputs = {
        costPrice: costVal,
        sellingPrice: sellVal,
        quantity: qtyVal || '1',
        currencySymbol: DEFAULT_CURRENCY.symbol,
      };

      const validation = validateProfitLossInputs(inputs);
      if (!validation.isValid) {
        if (recordHistory) {
          setErrors(validation.errors);
        }
        setResult(null);
        return;
      }

      setErrors({});
      const calculated = calculateProfitLoss(inputs);
      setResult(calculated);

      if (calculated && recordHistory) {
        onSaveHistory({
          calculatorId: 'profit-loss',
          calculatorNameAr: 'حاسبة الربح والخسارة',
          primaryResult: calculated.primaryValue,
          primaryUnit: calculated.primaryUnit,
          badgeText: calculated.badge?.text,
          inputsSummary: `شراء: ${costVal} | بيع: ${sellVal} | كمية: ${qtyVal || '1'}`,
          inputs: { costPrice: costVal, sellingPrice: sellVal, quantity: qtyVal || '1' },
          details: calculated.details,
        });
      }
    },
    [onSaveHistory]
  );

  // Auto calculate when inputs are valid
  useEffect(() => {
    if (costPrice && sellingPrice) {
      executeCalculation(costPrice, sellingPrice, quantity, false);
    }
  }, [costPrice, sellingPrice, quantity, executeCalculation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCalculation(costPrice, sellingPrice, quantity, true);
    if (costPrice && sellingPrice) {
      onShowToast('تم حساب الربح والخسارة بنجاح', 'success');
    }
  };

  const handleReset = () => {
    setCostPrice('');
    setSellingPrice('');
    setQuantity('1');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة تعيين الحقول', 'info');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cost Price */}
        <FormattedNumberInput
          id="pl-cost-price"
          label="سعر التكلفة / الشراء للقطعة"
          value={costPrice}
          onChange={(val) => {
            setCostPrice(val);
            if (errors.costPrice) setErrors((prev) => ({ ...prev, costPrice: undefined }));
          }}
          placeholder="مثال: 50,000"
          unit={DEFAULT_CURRENCY.symbol}
          error={errors.costPrice}
          required
        />

        {/* Selling Price */}
        <FormattedNumberInput
          id="pl-selling-price"
          label="سعر البيع للقطعة"
          value={sellingPrice}
          onChange={(val) => {
            setSellingPrice(val);
            if (errors.sellingPrice) setErrors((prev) => ({ ...prev, sellingPrice: undefined }));
          }}
          placeholder="مثال: 75,000"
          unit={DEFAULT_CURRENCY.symbol}
          error={errors.sellingPrice}
          required
        />

        {/* Quantity */}
        <FormattedNumberInput
          id="pl-quantity"
          label="الكمية / عدد الوحدات"
          value={quantity}
          onChange={(val) => {
            setQuantity(val);
            if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
          }}
          placeholder="1"
          unit="وحدة"
          helperText="افتراضياً: 1"
          error={errors.quantity}
        />

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-calculate-profit-loss"
          className="w-full h-12 rounded-2xl bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm shadow-md shadow-[#5B5BF7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4" />
          <span>احسب صافي الربح والخسارة</span>
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
