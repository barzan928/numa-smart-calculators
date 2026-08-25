import React, { useState, useEffect } from 'react';
import { Wallet, RotateCcw, AlertCircle, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface MonthlyExpensesCalculatorViewProps {
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

export const MonthlyExpensesCalculatorView: React.FC<MonthlyExpensesCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [income, setIncome] = useState<string>(initialInputs?.income?.toString() || '1500000');
  const [housing, setHousing] = useState<string>(initialInputs?.housing?.toString() || '400000');
  const [food, setFood] = useState<string>(initialInputs?.food?.toString() || '350000');
  const [transport, setTransport] = useState<string>(initialInputs?.transport?.toString() || '150000');
  const [bills, setBills] = useState<string>(initialInputs?.bills?.toString() || '120000');
  const [shopping, setShopping] = useState<string>(initialInputs?.shopping?.toString() || '100000');
  const [others, setOthers] = useState<string>(initialInputs?.others?.toString() || '80000');

  const [errors, setErrors] = useState<{ income?: string }>({});

  const [result, setResult] = useState<{
    totalExpenses: number;
    remaining: number;
    expenseRatio: number;
    savingsRatio: number;
    status: 'surplus' | 'deficit' | 'even';
  } | null>(null);

  const calculate = () => {
    const numIncome = parseFloat(income.replace(/,/g, ''));
    const numHousing = parseFloat(housing.replace(/,/g, '') || '0');
    const numFood = parseFloat(food.replace(/,/g, '') || '0');
    const numTransport = parseFloat(transport.replace(/,/g, '') || '0');
    const numBills = parseFloat(bills.replace(/,/g, '') || '0');
    const numShopping = parseFloat(shopping.replace(/,/g, '') || '0');
    const numOthers = parseFloat(others.replace(/,/g, '') || '0');

    if (!income.trim() || isNaN(numIncome) || numIncome <= 0) {
      setErrors({ income: 'يرجى إدخال الدخل الشهري بشكل صحيح' });
      setResult(null);
      return;
    }

    setErrors({});

    const totalExpenses =
      numHousing + numFood + numTransport + numBills + numShopping + numOthers;
    const remaining = numIncome - totalExpenses;
    const expenseRatio = (totalExpenses / numIncome) * 100;
    const savingsRatio = (remaining / numIncome) * 100;
    const status: 'surplus' | 'deficit' | 'even' =
      remaining > 0 ? 'surplus' : remaining < 0 ? 'deficit' : 'even';

    const res = {
      totalExpenses,
      remaining,
      expenseRatio,
      savingsRatio,
      status,
    };

    setResult(res);

    const badgeText =
      status === 'surplus'
        ? `ادخار ${savingsRatio.toFixed(1)}%`
        : status === 'deficit'
        ? `عجز مالي ${Math.abs(savingsRatio).toFixed(1)}%`
        : 'نقطة تعادل كاملة';

    onSaveHistory({
      calculatorId: 'monthly-expenses',
      calculatorNameAr: 'حاسبة المصروف الشهري',
      primaryResult: `${Math.abs(remaining).toLocaleString('en-US')}`,
      primaryUnit: status === 'deficit' ? 'د.ع (عجز مالي)' : 'د.ع (المتبقي للادخار)',
      badgeText,
      inputsSummary: `الدخل: ${numIncome.toLocaleString('en-US')} د.ع | المصاريف: ${totalExpenses.toLocaleString('en-US')} د.ع`,
      inputs: { income: numIncome, housing: numHousing, food: numFood, transport: numTransport, bills: numBills, shopping: numShopping, others: numOthers },
      details: [
        { label: 'إجمالي المصروفات الشهرية', value: `${totalExpenses.toLocaleString('en-US')} د.ع`, isHighlighted: true },
        { label: 'المبلغ المتبقي (الصافي)', value: `${remaining >= 0 ? '+' : '-'}${Math.abs(remaining).toLocaleString('en-US')} د.ع` },
        { label: 'نسبة المصروفات من إجمالي الدخل', value: `${expenseRatio.toFixed(1)}%` },
        { label: 'نسبة التوفير والادخار', value: `${savingsRatio.toFixed(1)}%` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.income) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setIncome('');
    setHousing('');
    setFood('');
    setTransport('');
    setBills('');
    setShopping('');
    setOthers('');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  const fields = [
    { label: 'السكن والإيجار', val: housing, set: setHousing, placeholder: '0' },
    { label: 'الطعام والبقالة', val: food, set: setFood, placeholder: '0' },
    { label: 'المواصلات والوقود', val: transport, set: setTransport, placeholder: '0' },
    { label: 'الفواتير والإنترنت والكهرباء', val: bills, set: setBills, placeholder: '0' },
    { label: 'التسوق والملابس', val: shopping, set: setShopping, placeholder: '0' },
    { label: 'مصاريف أخرى ونثريات', val: others, set: setOthers, placeholder: '0' },
  ];

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#5B5BF7]" />
          الدخل والبنود الشهرية
        </h2>

        {/* Income */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            إجمالي الدخل الشهري (الراتب / الأرباح)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 1500000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.income ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              د.ع
            </span>
          </div>
          {errors.income && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.income}
            </p>
          )}
        </div>

        {/* Expense Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {fields.map((f, idx) => (
            <div key={idx}>
              <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={f.placeholder}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 pl-12 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--app-text-secondary)]">
                  د.ع
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب الميزانية والمتبقي
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
          primaryResult={`${Math.abs(result.remaining).toLocaleString('en-US')}`}
          primaryUnit={
            result.status === 'deficit'
              ? 'د.ع (عجز مالي)'
              : 'د.ع (المتبقي للادخار)'
          }
          badgeText={
            result.status === 'surplus'
              ? `ادخار ${result.savingsRatio.toFixed(1)}%`
              : result.status === 'deficit'
              ? `عجز مالي ${Math.abs(result.savingsRatio).toFixed(1)}%`
              : 'نقطة تعادل'
          }
          badgeColor={
            result.status === 'surplus'
              ? 'emerald'
              : result.status === 'deficit'
              ? 'rose'
              : 'gray'
          }
          details={[
            {
              label: 'إجمالي المصروفات الشهرية',
              value: `${result.totalExpenses.toLocaleString('en-US')} د.ع`,
              isHighlighted: true,
            },
            {
              label: 'المبلغ المتبقي الصافي',
              value: `${result.remaining >= 0 ? '+' : '-'}${Math.abs(result.remaining).toLocaleString('en-US')} د.ع`,
            },
            {
              label: 'نسبة المصروفات من الدخل',
              value: `${result.expenseRatio.toFixed(1)}%`,
            },
            {
              label: 'نسبة التوفير / الادخار',
              value: `${result.savingsRatio.toFixed(1)}%`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
