import React, { useState, useEffect } from 'react';
import { Square, RotateCcw, AlertCircle } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface ShapeAreaCalculatorViewProps {
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

type ShapeType = 'rectangle' | 'square' | 'circle' | 'triangle';

export const ShapeAreaCalculatorView: React.FC<ShapeAreaCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [shape, setShape] = useState<ShapeType>(initialInputs?.shape || 'rectangle');
  const [length, setLength] = useState<string>(initialInputs?.length?.toString() || '5');
  const [width, setWidth] = useState<string>(initialInputs?.width?.toString() || '4');
  const [side, setSide] = useState<string>(initialInputs?.side?.toString() || '4');
  const [radius, setRadius] = useState<string>(initialInputs?.radius?.toString() || '3');
  const [base, setBase] = useState<string>(initialInputs?.base?.toString() || '6');
  const [height, setHeight] = useState<string>(initialInputs?.height?.toString() || '4');

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    areaSqm: number;
    areaSqft: number;
    perimeterM: number;
    shapeName: string;
  } | null>(null);

  const calculate = () => {
    let area = 0;
    let perimeter = 0;
    let shapeName = '';
    let summary = '';

    if (shape === 'rectangle') {
      shapeName = 'مستطيل / غرفة';
      const l = parseFloat(length.replace(/,/g, ''));
      const w = parseFloat(width.replace(/,/g, ''));
      if (!length.trim() || !width.trim() || isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
        setError('يرجى إدخال أبعاد المستطيل (الطول والعرض) بشكل صحيح');
        setResult(null);
        return;
      }
      area = l * w;
      perimeter = 2 * (l + w);
      summary = `مستطيل: طول ${l}م × عرض ${w}م`;
    } else if (shape === 'square') {
      shapeName = 'مربع';
      const s = parseFloat(side.replace(/,/g, ''));
      if (!side.trim() || isNaN(s) || s <= 0) {
        setError('يرجى إدخال طول ضلع المربع بشكل صحيح');
        setResult(null);
        return;
      }
      area = s * s;
      perimeter = 4 * s;
      summary = `مربع: طول الضلع ${s}م`;
    } else if (shape === 'circle') {
      shapeName = 'دائرة';
      const r = parseFloat(radius.replace(/,/g, ''));
      if (!radius.trim() || isNaN(r) || r <= 0) {
        setError('يرجى إدخال نصف القطر بشكل صحيح');
        setResult(null);
        return;
      }
      area = Math.PI * r * r;
      perimeter = 2 * Math.PI * r;
      summary = `دائرة: نصف القطر ${r}م`;
    } else if (shape === 'triangle') {
      shapeName = 'مثلث';
      const b = parseFloat(base.replace(/,/g, ''));
      const h = parseFloat(height.replace(/,/g, ''));
      if (!base.trim() || !height.trim() || isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
        setError('يرجى إدخال طول القاعدة والارتفاع بشكل صحيح');
        setResult(null);
        return;
      }
      area = 0.5 * b * h;
      perimeter = 3 * b; // approximation for equilateral
      summary = `مثلث: قاعدة ${b}م × ارتفاع ${h}م`;
    }

    setError(null);

    const areaSqft = area * 10.7639;

    const res = {
      areaSqm: area,
      areaSqft,
      perimeterM: perimeter,
      shapeName,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'room-area',
      calculatorNameAr: 'حاسبة حساب المساحة',
      primaryResult: area.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      primaryUnit: 'م² (متر مربع)',
      badgeText: `${areaSqft.toFixed(1)} قدم²`,
      inputsSummary: summary,
      inputs: { shape, length, width, side, radius, base, height },
      details: [
        { label: 'المساحة بالمتر المربع', value: `${area.toLocaleString('en-US', { maximumFractionDigits: 2 })} م²`, isHighlighted: true },
        { label: 'المساحة بالقدم المربع', value: `${areaSqft.toLocaleString('en-US', { maximumFractionDigits: 2 })} قدم² (ft²)` },
        { label: 'المحيط الخارجي المقدر', value: `${perimeter.toLocaleString('en-US', { maximumFractionDigits: 2 })} متر` },
        { label: 'الشكل الهندسي', value: shapeName },
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [shape, length, width, side, radius, base, height]);

  const handleReset = () => {
    setLength('5');
    setWidth('4');
    setSide('4');
    setRadius('3');
    setBase('6');
    setHeight('4');
    setError(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Square className="w-4 h-4 text-[#5B5BF7]" />
          اختيار الشكل الهندسي والأبعاد
        </h2>

        {/* Shape selector tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl">
          {[
            { id: 'rectangle', label: 'مستطيل' },
            { id: 'square', label: 'مربع' },
            { id: 'circle', label: 'دائرة' },
            { id: 'triangle', label: 'مثلث' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setShape(item.id as ShapeType)}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                shape === item.id
                  ? 'bg-[var(--app-surface)] text-[#5B5BF7] shadow-xs'
                  : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Inputs based on shape */}
        {shape === 'rectangle' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
                الطول (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
                العرض (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
          </div>
        )}

        {shape === 'square' && (
          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              طول الضلع (متر)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
          </div>
        )}

        {shape === 'circle' && (
          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              نصف القطر (متر)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
          </div>
        )}

        {shape === 'triangle' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
                طول القاعدة (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
                الارتفاع (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

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

      {result && (
        <ResultCard
          primaryResult={result.areaSqm.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          primaryUnit="م² (متر مربع)"
          badgeText={`${result.areaSqft.toFixed(1)} قدم²`}
          badgeColor="indigo"
          details={[
            {
              label: 'المساحة بالمتر المربع',
              value: `${result.areaSqm.toLocaleString('en-US', { maximumFractionDigits: 2 })} م²`,
              isHighlighted: true,
            },
            {
              label: 'المساحة بالقدم المربع (ft²)',
              value: `${result.areaSqft.toLocaleString('en-US', { maximumFractionDigits: 2 })} قدم²`,
            },
            {
              label: 'المحيط التقريبي',
              value: `${result.perimeterM.toLocaleString('en-US', { maximumFractionDigits: 2 })} متر`,
            },
            {
              label: 'نوع الشكل',
              value: result.shapeName,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
