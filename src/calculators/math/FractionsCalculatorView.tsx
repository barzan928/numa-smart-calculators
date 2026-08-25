import React, { useState, useEffect } from 'react';
import { Layers, RotateCcw, AlertCircle, Plus, Minus, X, Divide as DivideIcon } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface FractionsCalculatorViewProps {
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

// Greatest Common Divisor
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export const FractionsCalculatorView: React.FC<FractionsCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [num1, setNum1] = useState<string>(initialInputs?.num1?.toString() || '3');
  const [den1, setDen1] = useState<string>(initialInputs?.den1?.toString() || '4');
  const [num2, setNum2] = useState<string>(initialInputs?.num2?.toString() || '1');
  const [den2, setDen2] = useState<string>(initialInputs?.den2?.toString() || '2');
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');

  const [errors, setErrors] = useState<{
    num1?: string;
    den1?: string;
    num2?: string;
    den2?: string;
  }>({});

  const [result, setResult] = useState<{
    resNum: number;
    resDen: number;
    simplifiedNum: number;
    simplifiedDen: number;
    decimal: number;
    mixedNumber?: { whole: number; num: number; den: number };
    steps: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: { num1?: string; den1?: string; num2?: string; den2?: string } = {};

    const n1 = parseInt(num1, 10);
    const d1 = parseInt(den1, 10);
    const n2 = parseInt(num2, 10);
    const d2 = parseInt(den2, 10);

    if (isNaN(n1)) newErrors.num1 = 'أدخل بسط الكسر 1';
    if (isNaN(d1)) newErrors.den1 = 'أدخل مقام الكسر 1';
    else if (d1 === 0) newErrors.den1 = 'لا يمكن أن يكون المقام صفراً';

    if (isNaN(n2)) newErrors.num2 = 'أدخل بسط الكسر 2';
    if (isNaN(d2)) newErrors.den2 = 'أدخل مقام الكسر 2';
    else if (d2 === 0) newErrors.den2 = 'لا يمكن أن يكون المقام صفراً';

    if (operation === '/' && n2 === 0) {
      newErrors.num2 = 'لا يمكن القسمة على كسر بسطه صفر';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    let rawNum = 0;
    let rawDen = 1;
    let steps = '';

    if (operation === '+') {
      rawNum = n1 * d2 + n2 * d1;
      rawDen = d1 * d2;
      steps = `توحيد المقامات: (${n1}×${d2} + ${n2}×${d1}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
    } else if (operation === '-') {
      rawNum = n1 * d2 - n2 * d1;
      rawDen = d1 * d2;
      steps = `توحيد المقامات: (${n1}×${d2} - ${n2}×${d1}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
    } else if (operation === '*') {
      rawNum = n1 * n2;
      rawDen = d1 * d2;
      steps = `ضرب البسط في البسط والمقام في المقام: (${n1}×${n2}) / (${d1}×${d2}) = ${rawNum}/${rawDen}`;
    } else if (operation === '/') {
      rawNum = n1 * d2;
      rawDen = d1 * n2;
      steps = `الضرب في مقلوب الكسر الثاني: (${n1}/${d1}) × (${d2}/${n2}) = ${rawNum}/${rawDen}`;
    }

    if (rawDen < 0) {
      rawNum = -rawNum;
      rawDen = -rawDen;
    }

    const divisor = gcd(rawNum, rawDen);
    const simplifiedNum = rawNum / divisor;
    const simplifiedDen = rawDen / divisor;
    const decimal = simplifiedNum / simplifiedDen;

    let mixedNumber: { whole: number; num: number; den: number } | undefined;
    if (Math.abs(simplifiedNum) > simplifiedDen && simplifiedDen !== 1) {
      const whole = Math.trunc(simplifiedNum / simplifiedDen);
      const remNum = Math.abs(simplifiedNum % simplifiedDen);
      if (remNum !== 0) {
        mixedNumber = { whole, num: remNum, den: simplifiedDen };
      }
    }

    const res = {
      resNum: rawNum,
      resDen: rawDen,
      simplifiedNum,
      simplifiedDen,
      decimal,
      mixedNumber,
      steps,
    };

    setResult(res);

    const opSymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
    const fractionString =
      simplifiedDen === 1 ? `${simplifiedNum}` : `${simplifiedNum}/${simplifiedDen}`;

    onSaveHistory({
      calculatorId: 'fractions',
      calculatorNameAr: 'حاسبة الكسور',
      primaryResult: fractionString,
      primaryUnit: 'الناتج',
      badgeText: `العشري: ${decimal.toFixed(3)}`,
      inputsSummary: `(${n1}/${d1}) ${opSymbol} (${n2}/${d2})`,
      inputs: { num1: n1, den1: d1, num2: n2, den2: d2, operation },
      details: [
        { label: 'الكسر في أبسط صورة', value: fractionString, isHighlighted: true },
        { label: 'القيمة العشرية التقريبية', value: decimal.toLocaleString('en-US', { maximumFractionDigits: 4 }) },
        ...(mixedNumber
          ? [{ label: 'العدد الكسري (Mixed Number)', value: `${mixedNumber.whole} و (${mixedNumber.num}/${mixedNumber.den})` }]
          : []),
        { label: 'خطوات الحل', value: steps },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.num1 !== undefined) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setNum1('');
    setDen1('');
    setNum2('');
    setDen2('');
    setOperation('+');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5B5BF7]" />
          إدخال الكسور والعملية
        </h2>

        {/* Fractions visual layout */}
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center w-24">
            <input
              type="number"
              placeholder="بسط 1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className={`w-full h-11 text-center font-bold text-sm bg-[var(--app-surface-subtle)] border rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 ${
                errors.num1 ? 'border-rose-500' : 'border-[var(--app-border)]'
              }`}
            />
            <div className="w-full h-0.5 bg-[var(--app-text-secondary)]/30 my-1.5 rounded-full" />
            <input
              type="number"
              placeholder="مقام 1"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className={`w-full h-11 text-center font-bold text-sm bg-[var(--app-surface-subtle)] border rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 ${
                errors.den1 ? 'border-rose-500' : 'border-[var(--app-border)]'
              }`}
            />
          </div>

          {/* Operation selector */}
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1 bg-[var(--app-surface-subtle)] p-1 rounded-xl border border-[var(--app-border)]">
              {(
                [
                  { op: '+', icon: Plus, label: 'جمع' },
                  { op: '-', icon: Minus, label: 'طرح' },
                  { op: '*', icon: X, label: 'ضرب' },
                  { op: '/', icon: DivideIcon, label: 'قسمة' },
                ] as const
              ).map(({ op, icon: Icon }) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperation(op)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
                    operation === op
                      ? 'bg-[#5B5BF7] text-white shadow-sm'
                      : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center w-24">
            <input
              type="number"
              placeholder="بسط 2"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className={`w-full h-11 text-center font-bold text-sm bg-[var(--app-surface-subtle)] border rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 ${
                errors.num2 ? 'border-rose-500' : 'border-[var(--app-border)]'
              }`}
            />
            <div className="w-full h-0.5 bg-[var(--app-text-secondary)]/30 my-1.5 rounded-full" />
            <input
              type="number"
              placeholder="مقام 2"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className={`w-full h-11 text-center font-bold text-sm bg-[var(--app-surface-subtle)] border rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 ${
                errors.den2 ? 'border-rose-500' : 'border-[var(--app-border)]'
              }`}
            />
          </div>
        </div>

        {/* Error message */}
        {(errors.num1 || errors.den1 || errors.num2 || errors.den2) && (
          <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1 text-center justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.num1 || errors.den1 || errors.num2 || errors.den2}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب ناتج الكسور
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

      {result && (
        <ResultCard
          primaryResult={
            result.simplifiedDen === 1
              ? `${result.simplifiedNum}`
              : `${result.simplifiedNum} / ${result.simplifiedDen}`
          }
          primaryUnit="الكسر المبسط"
          badgeText={`العشري: ${result.decimal.toFixed(3)}`}
          badgeColor="indigo"
          details={[
            {
              label: 'الكسر في أبسط صورة',
              value:
                result.simplifiedDen === 1
                  ? `${result.simplifiedNum}`
                  : `${result.simplifiedNum} / ${result.simplifiedDen}`,
              isHighlighted: true,
            },
            {
              label: 'القيمة العشرية المقابلة',
              value: result.decimal.toLocaleString('en-US', { maximumFractionDigits: 4 }),
            },
            ...(result.mixedNumber
              ? [
                  {
                    label: 'العدد الكسري (عدد صحيح + كسر)',
                    value: `${result.mixedNumber.whole} و (${result.mixedNumber.num}/${result.mixedNumber.den})`,
                  },
                ]
              : []),
            {
              label: 'طريقة الحل',
              value: result.steps,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
