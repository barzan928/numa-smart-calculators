import React, { useState } from 'react';
import { Calculator, Delete, RotateCcw, Copy, Check, Share2, CornerDownLeft } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface ArithmeticCalculatorViewProps {
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

export const ArithmeticCalculatorView: React.FC<ArithmeticCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [display, setDisplay] = useState<string>(
    initialInputs?.expression || '0'
  );
  const [expression, setExpression] = useState<string>(
    initialInputs?.expression || ''
  );
  const [lastCalculated, setLastCalculated] = useState<string | null>(null);

  // Safe arithmetic evaluator
  const evaluateExpression = (expr: string): number => {
    // Replace visual tokens
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '/100');

    // Only allow digits, operators, parens, decimal
    if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
      throw new Error('معادلة غير صالحة');
    }

    // Function constructor safer than eval for purely sanitized math
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('النتيجة غير معرفة');
    }
    return result;
  };

  const handleButtonClick = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setExpression('');
      setLastCalculated(null);
      return;
    }

    if (val === 'DEL') {
      if (display.length <= 1 || display === '0' || display === 'Error') {
        setDisplay('0');
      } else {
        setDisplay(display.slice(0, -1));
      }
      return;
    }

    if (val === '=') {
      try {
        const res = evaluateExpression(display);
        const formattedRes = Number.isInteger(res)
          ? res.toString()
          : parseFloat(res.toFixed(8)).toString();

        setExpression(display);
        setLastCalculated(formattedRes);

        // Save to History
        onSaveHistory({
          calculatorId: 'arithmetic',
          calculatorNameAr: 'حاسبة العمليات الحسابية',
          primaryResult: formattedRes,
          primaryUnit: 'الناتج',
          badgeText: 'عملية حسابية',
          inputsSummary: `${display} = ${formattedRes}`,
          inputs: { expression: display },
          details: [
            { label: 'المعادلة الحسابية', value: display },
            { label: 'الناتج النهائي', value: formattedRes, isHighlighted: true },
          ],
        });

        setDisplay(formattedRes);
      } catch (err: any) {
        setDisplay('Error');
        onShowToast(err.message || 'خطأ في المعادلة', 'error');
      }
      return;
    }

    if (val === '+/-') {
      if (display === '0' || display === 'Error') return;
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
      return;
    }

    if (display === '0' || display === 'Error') {
      if (['+', '×', '÷', '%'].includes(val)) {
        setDisplay('0' + val);
      } else {
        setDisplay(val);
      }
    } else {
      setDisplay(display + val);
    }
  };

  const padButtons = [
    { label: 'C', val: 'C', type: 'special' },
    { label: '(', val: '(', type: 'special' },
    { label: ')', val: ')', type: 'special' },
    { label: '÷', val: '÷', type: 'op' },

    { label: '7', val: '7', type: 'num' },
    { label: '8', val: '8', type: 'num' },
    { label: '9', val: '9', type: 'num' },
    { label: '×', val: '×', type: 'op' },

    { label: '4', val: '4', type: 'num' },
    { label: '5', val: '5', type: 'num' },
    { label: '6', val: '6', type: 'num' },
    { label: '-', val: '-', type: 'op' },

    { label: '1', val: '1', type: 'num' },
    { label: '2', val: '2', type: 'num' },
    { label: '3', val: '3', type: 'num' },
    { label: '+', val: '+', type: 'op' },

    { label: '+/-', val: '+/-', type: 'num' },
    { label: '0', val: '0', type: 'num' },
    { label: '.', val: '.', type: 'num' },
    { label: '=', val: '=', type: 'equals' },
  ];

  return (
    <div className="flex flex-col space-y-5 pt-2">
      {/* Calculator Body */}
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        {/* Screen Display */}
        <div className="w-full bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl p-4 flex flex-col items-end justify-between min-h-[96px]">
          <div className="text-xs font-bold text-[var(--app-text-secondary)] tracking-wider min-h-[16px]">
            {expression || '\u00A0'}
          </div>
          <div className="flex items-center justify-between w-full mt-1">
            <button
              type="button"
              onClick={() => handleButtonClick('DEL')}
              className="p-1.5 rounded-lg text-[var(--app-text-secondary)] hover:text-rose-500 hover:bg-[var(--app-surface)] active:scale-95 transition-all cursor-pointer"
              title="حذف آخر رقم"
            >
              <Delete className="w-4 h-4" />
            </button>
            <div
              dir="ltr"
              className="text-2xl sm:text-3xl font-extrabold text-[var(--app-text)] overflow-x-auto max-w-full"
            >
              {display}
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {padButtons.map(({ label, val, type }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleButtonClick(val)}
              className={`h-13 rounded-2xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                type === 'equals'
                  ? 'bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white shadow-lg shadow-[#5B5BF7]/30'
                  : type === 'op'
                  ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] hover:bg-[#5B5BF7]/25 border border-[#5B5BF7]/30'
                  : type === 'special'
                  ? 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] border border-[var(--app-border)]'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] shadow-xs'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card if calculated */}
      {lastCalculated && (
        <ResultCard
          primaryResult={lastCalculated}
          primaryUnit="الناتج النهائي"
          badgeText="عملية حسابية"
          badgeColor="indigo"
          details={[
            { label: 'المعادلة الرياضية', value: expression, isHighlighted: true },
            { label: 'النتيجة', value: lastCalculated },
          ]}
          onReset={() => {
            setDisplay('0');
            setExpression('');
            setLastCalculated(null);
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
