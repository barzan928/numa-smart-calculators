import React, { useState, useEffect, useCallback } from 'react';
import { FormattedNumberInput } from '../../components/common/FormattedNumberInput';
import { CalculatorResultCard } from '../../components/common/CalculatorResultCard';
import {
  calculateInstallments,
  validateInstallmentsInputs,
  InstallmentsInputs,
} from './logic';
import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { Calculator } from 'lucide-react';

interface InstallmentsCalculatorViewProps {
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

export const InstallmentsCalculatorView: React.FC<InstallmentsCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [totalAmount, setTotalAmount] = useState<string>(initialInputs?.totalAmount || '');
  const [downPayment, setDownPayment] = useState<string>(initialInputs?.downPayment || '');
  const [installmentsCount, setInstallmentsCount] = useState<string>(
    initialInputs?.installmentsCount || '12'
  );
  const [interestRate, setInterestRate] = useState<string>(initialInputs?.interestRate || '');

  const [errors, setErrors] = useState<{
    totalAmount?: string;
    downPayment?: string;
    installmentsCount?: string;
    interestRate?: string;
  }>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  const quickMonthPresets = ['6', '12', '18', '24', '36', '48'];

  const executeCalculation = useCallback(
    (
      totalVal: string,
      downVal: string,
      countVal: string,
      rateVal: string,
      recordHistory = false
    ) => {
      const inputs: InstallmentsInputs = {
        totalAmount: totalVal,
        downPayment: downVal,
        installmentsCount: countVal,
        interestRate: rateVal,
        currencySymbol: DEFAULT_CURRENCY.symbol,
      };

      const validation = validateInstallmentsInputs(inputs);
      if (!validation.isValid) {
        if (recordHistory) {
          setErrors(validation.errors);
        }
        setResult(null);
        return;
      }

      setErrors({});
      const calculated = calculateInstallments(inputs);
      setResult(calculated);

      if (calculated && recordHistory) {
        onSaveHistory({
          calculatorId: 'installments',
          calculatorNameAr: 'حاسبة الأقساط',
          primaryResult: calculated.primaryValue,
          primaryUnit: calculated.primaryUnit,
          badgeText: calculated.badge?.text,
          inputsSummary: `مبلغ: ${totalVal} | ${countVal} شهر ${rateVal ? `| فائدة %${rateVal}` : ''}`,
          inputs: {
            totalAmount: totalVal,
            downPayment: downVal,
            installmentsCount: countVal,
            interestRate: rateVal,
          },
          details: calculated.details,
        });
      }
    },
    [onSaveHistory]
  );

  // Auto calculate when inputs are valid
  useEffect(() => {
    if (totalAmount && installmentsCount) {
      executeCalculation(totalAmount, downPayment, installmentsCount, interestRate, false);
    }
  }, [totalAmount, downPayment, installmentsCount, interestRate, executeCalculation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCalculation(totalAmount, downPayment, installmentsCount, interestRate, true);
    if (totalAmount && installmentsCount) {
      onShowToast('تم حساب الأقساط الشهرية بنجاح', 'success');
    }
  };

  const handleReset = () => {
    setTotalAmount('');
    setDownPayment('');
    setInstallmentsCount('12');
    setInterestRate('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة تعيين الحقول', 'info');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Amount */}
        <FormattedNumberInput
          id="inst-total-amount"
          label="إجمالي مبلغ التمويل / السلعة"
          value={totalAmount}
          onChange={(val) => {
            setTotalAmount(val);
            if (errors.totalAmount) setErrors((prev) => ({ ...prev, totalAmount: undefined }));
          }}
          placeholder="مثال: 1,200,000"
          unit={DEFAULT_CURRENCY.symbol}
          error={errors.totalAmount}
          required
        />

        {/* Down Payment */}
        <FormattedNumberInput
          id="inst-down-payment"
          label="الدفعة الأولى المقدمة (إن وجدت)"
          value={downPayment}
          onChange={(val) => {
            setDownPayment(val);
            if (errors.downPayment) setErrors((prev) => ({ ...prev, downPayment: undefined }));
          }}
          placeholder="0 إن لم توجد دفعة أولى"
          unit={DEFAULT_CURRENCY.symbol}
          helperText="اختياري"
          error={errors.downPayment}
        />

        {/* Number of Installments */}
        <div className="space-y-2">
          <FormattedNumberInput
            id="inst-months-count"
            label="مدة السداد (عدد الأشهر)"
            value={installmentsCount}
            onChange={(val) => {
              setInstallmentsCount(val);
              if (errors.installmentsCount)
                setErrors((prev) => ({ ...prev, installmentsCount: undefined }));
            }}
            placeholder="مثال: 12"
            unit="شهر"
            error={errors.installmentsCount}
            required
          />

          {/* Quick preset months */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-[var(--app-text-secondary)] ml-1">
              مدد سريعة:
            </span>
            {quickMonthPresets.map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => {
                  setInstallmentsCount(months);
                  if (errors.installmentsCount)
                    setErrors((prev) => ({ ...prev, installmentsCount: undefined }));
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  installmentsCount === months
                    ? 'bg-[#5B5BF7] text-white border-[#5B5BF7]'
                    : 'bg-[var(--app-surface-secondary)] text-[var(--app-text-secondary)] border-[var(--app-border)] hover:text-[var(--app-text)]'
                }`}
              >
                {months} شهر
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <FormattedNumberInput
          id="inst-interest-rate"
          label="نسبة الفائدة السنوية (إن وجدت)"
          value={interestRate}
          onChange={(val) => {
            setInterestRate(val);
            if (errors.interestRate) setErrors((prev) => ({ ...prev, interestRate: undefined }));
          }}
          placeholder="0 في حال عدم وجود فوائد"
          unit="%"
          helperText="اختياري"
          error={errors.interestRate}
        />

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-calculate-installments"
          className="w-full h-12 rounded-2xl bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm shadow-md shadow-[#5B5BF7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4" />
          <span>احسب القسط الشهري</span>
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
