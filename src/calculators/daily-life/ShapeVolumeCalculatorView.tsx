import React, { useState, useEffect } from 'react';
import { Box, RotateCcw, AlertCircle } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface ShapeVolumeCalculatorViewProps {
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

type SolidShapeType = 'box' | 'cylinder' | 'cube' | 'sphere';

export const ShapeVolumeCalculatorView: React.FC<ShapeVolumeCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [shape, setShape] = useState<SolidShapeType>(initialInputs?.shape || 'box');
  const [length, setLength] = useState<string>(initialInputs?.length?.toString() || '2');
  const [width, setWidth] = useState<string>(initialInputs?.width?.toString() || '1.5');
  const [height, setHeight] = useState<string>(initialInputs?.height?.toString() || '1');
  const [radius, setRadius] = useState<string>(initialInputs?.radius?.toString() || '0.8');
  const [side, setSide] = useState<string>(initialInputs?.side?.toString() || '1.2');

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    volumeCbm: number;
    volumeLiters: number;
    volumeGallons: number;
    shapeName: string;
  } | null>(null);

  const calculate = () => {
    let volumeCbm = 0;
    let shapeName = '';
    let summary = '';

    if (shape === 'box') {
      shapeName = 'خزان متوازي مستطيلات';
      const l = parseFloat(length.replace(/,/g, ''));
      const w = parseFloat(width.replace(/,/g, ''));
      const h = parseFloat(height.replace(/,/g, ''));
      if (!length.trim() || !width.trim() || !height.trim() || isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
        setError('يرجى إدخال أبعاد الخزان (الطول، العرض، الارتفاع) بشكل صحيح');
        setResult(null);
        return;
      }
      volumeCbm = l * w * h;
      summary = `خزان: ${l}م × ${w}م × ${h}م`;
    } else if (shape === 'cylinder') {
      shapeName = 'خزان أسطواني';
      const r = parseFloat(radius.replace(/,/g, ''));
      const h = parseFloat(height.replace(/,/g, ''));
      if (!radius.trim() || !height.trim() || isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
        setError('يرجى إدخال نصف القطر والارتفاع بشكل صحيح');
        setResult(null);
        return;
      }
      volumeCbm = Math.PI * r * r * h;
      summary = `أسطوانة: نصف القطر ${r}م × ارتفاع ${h}م`;
    } else if (shape === 'cube') {
      shapeName = 'مكعب';
      const s = parseFloat(side.replace(/,/g, ''));
      if (!side.trim() || isNaN(s) || s <= 0) {
        setError('يرجى إدخال طول ضلع المكعب بشكل صحيح');
        setResult(null);
        return;
      }
      volumeCbm = s * s * s;
      summary = `مكعب: طول الضلع ${s}م`;
    } else if (shape === 'sphere') {
      shapeName = 'كرة';
      const r = parseFloat(radius.replace(/,/g, ''));
      if (!radius.trim() || isNaN(r) || r <= 0) {
        setError('يرجى إدخال نصف قطر الكرة بشكل صحيح');
        setResult(null);
        return;
      }
      volumeCbm = (4 / 3) * Math.PI * r * r * r;
      summary = `كرة: نصف القطر ${r}م`;
    }

    setError(null);

    const volumeLiters = volumeCbm * 1000;
    const volumeGallons = volumeCbm * 264.172;

    const res = {
      volumeCbm,
      volumeLiters,
      volumeGallons,
      shapeName,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'tank-volume',
      calculatorNameAr: 'حاسبة حساب الحجم والسعة',
      primaryResult: `${Math.round(volumeLiters).toLocaleString('en-US')}`,
      primaryUnit: 'لتر (سعة)',
      badgeText: `${volumeCbm.toFixed(2)} م³`,
      inputsSummary: summary,
      inputs: { shape, length, width, height, radius, side },
      details: [
        { label: 'السعة الكلية باللتر', value: `${volumeLiters.toLocaleString('en-US', { maximumFractionDigits: 2 })} لتر`, isHighlighted: true },
        { label: 'الحجم بالمتر المكعب', value: `${volumeCbm.toLocaleString('en-US', { maximumFractionDigits: 3 })} م³ (cbm)` },
        { label: 'السعة بالغالون الأمريكي', value: `${volumeGallons.toLocaleString('en-US', { maximumFractionDigits: 2 })} غالون (gal)` },
        { label: 'نوع المجسم', value: shapeName },
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [shape, length, width, height, radius, side]);

  const handleReset = () => {
    setLength('2');
    setWidth('1.5');
    setHeight('1');
    setRadius('0.8');
    setSide('1.2');
    setError(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Box className="w-4 h-4 text-[#5B5BF7]" />
          اختيار نوع الخزان والمجسم والأبعاد
        </h2>

        {/* Shape selector tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl">
          {[
            { id: 'box', label: 'خزان مستطيل' },
            { id: 'cylinder', label: 'أسطوانة' },
            { id: 'cube', label: 'مكعب' },
            { id: 'sphere', label: 'كرة' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setShape(item.id as SolidShapeType)}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
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
        {shape === 'box' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
                الطول (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
                العرض (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1">
                الارتفاع (متر)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full h-11 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
              />
            </div>
          </div>
        )}

        {shape === 'cylinder' && (
          <div className="grid grid-cols-2 gap-3">
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

        {shape === 'cube' && (
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

        {shape === 'sphere' && (
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
          primaryResult={`${Math.round(result.volumeLiters).toLocaleString('en-US')}`}
          primaryUnit="لتر (السعة)"
          badgeText={`${result.volumeCbm.toFixed(2)} م³`}
          badgeColor="indigo"
          details={[
            {
              label: 'السعة الإجمالية باللتر',
              value: `${result.volumeLiters.toLocaleString('en-US', { maximumFractionDigits: 2 })} لتر`,
              isHighlighted: true,
            },
            {
              label: 'الحجم بالمتر المكعب (م³)',
              value: `${result.volumeCbm.toLocaleString('en-US', { maximumFractionDigits: 3 })} م³`,
            },
            {
              label: 'السعة بالغالون الأمريكي',
              value: `${result.volumeGallons.toLocaleString('en-US', { maximumFractionDigits: 2 })} غالون (gal)`,
            },
            {
              label: 'نوع الخزان / المجسم',
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
