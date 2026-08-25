import React, { useState, useEffect } from 'react';
import { Zap, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface ElectricityCalculatorViewProps {
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

const DEVICE_PRESETS = [
  { name: 'مكيف هواء', watts: '2000', hours: '10' },
  { name: 'سخان ماء', watts: '1500', hours: '4' },
  { name: 'غسالة ملابس', watts: '800', hours: '2' },
  { name: 'ثلاجة منزلية', watts: '200', hours: '24' },
  { name: 'تلفاز وشاشة', watts: '100', hours: '6' },
  { name: 'إنارة LED', watts: '15', hours: '8' },
];

export const ElectricityCalculatorView: React.FC<ElectricityCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [wattage, setWattage] = useState<string>(initialInputs?.wattage?.toString() || '1500');
  const [hours, setHours] = useState<string>(initialInputs?.hours?.toString() || '8');
  const [days, setDays] = useState<string>(initialInputs?.days?.toString() || '30');
  const [pricePerKwh, setPricePerKwh] = useState<string>(initialInputs?.pricePerKwh?.toString() || '50');

  const [errors, setErrors] = useState<{
    wattage?: string;
    hours?: string;
    days?: string;
    price?: string;
  }>({});

  const [result, setResult] = useState<{
    dailyKwh: number;
    totalKwh: number;
    totalCost: number;
    annualCost: number;
  } | null>(null);

  const applyPreset = (preset: { name: string; watts: string; hours: string }) => {
    setWattage(preset.watts);
    setHours(preset.hours);
    onShowToast(`تم اختيار: ${preset.name} (${preset.watts} واط)`, 'info');
  };

  const calculate = () => {
    const newErrors: { wattage?: string; hours?: string; days?: string; price?: string } = {};

    const numWatt = parseFloat(wattage.replace(/,/g, ''));
    const numHours = parseFloat(hours.replace(/,/g, ''));
    const numDays = parseFloat(days.replace(/,/g, ''));
    const numPrice = parseFloat(pricePerKwh.replace(/,/g, ''));

    if (!wattage.trim() || isNaN(numWatt) || numWatt <= 0) {
      newErrors.wattage = 'أدخل قدرة جهاز صحيحة بالواط';
    }

    if (!hours.trim() || isNaN(numHours) || numHours <= 0 || numHours > 24) {
      newErrors.hours = 'أدخل عدد ساعات بين 0.1 و 24 ساعة';
    }

    if (!days.trim() || isNaN(numDays) || numDays <= 0) {
      newErrors.days = 'أدخل عدد أيام صحيح';
    }

    if (!pricePerKwh.trim() || isNaN(numPrice) || numPrice < 0) {
      newErrors.price = 'أدخل سعر كيلوواط صحيح';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Daily kWh = (Watts * hours) / 1000
    const dailyKwh = (numWatt * numHours) / 1000;
    const totalKwh = dailyKwh * numDays;
    const totalCost = totalKwh * numPrice;
    const annualCost = dailyKwh * 365 * numPrice;

    const res = {
      dailyKwh,
      totalKwh,
      totalCost,
      annualCost,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'electricity-consumption',
      calculatorNameAr: 'حاسبة استهلاك الكهرباء',
      primaryResult: `${Math.round(totalCost).toLocaleString('en-US')}`,
      primaryUnit: 'د.ع (التكلفة المقدرة)',
      badgeText: `${totalKwh.toFixed(1)} kWh`,
      inputsSummary: `${numWatt}W | ${numHours}ساعة/يوم | ${numDays}يوم | ${numPrice}د.ع/kWh`,
      inputs: { wattage: numWatt, hours: numHours, days: numDays, pricePerKwh: numPrice },
      details: [
        { label: 'التكلفة الإجمالية للفترة', value: `${totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`, isHighlighted: true },
        { label: 'إجمالي استهلاك الطاقة (kWh)', value: `${totalKwh.toLocaleString('en-US', { maximumFractionDigits: 2 })} كيلوواط/ساعة` },
        { label: 'الاستهلاك اليومي', value: `${dailyKwh.toLocaleString('en-US', { maximumFractionDigits: 3 })} kWh/يوم` },
        { label: 'التكلفة السنوية التقديرية (365 يوم)', value: `${annualCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.wattage) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setWattage('1500');
    setHours('8');
    setDays('30');
    setPricePerKwh('50');
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#5B5BF7]" />
          بيانات الجهاز والكهرباء
        </h2>

        {/* Quick device presets */}
        <div>
          <label className="block text-[11px] font-bold text-[var(--app-text-secondary)] mb-1.5">
            أجهزة شائعة للاختيار السريع:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DEVICE_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-xs font-bold rounded-xl bg-[var(--app-surface-subtle)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:text-[#5B5BF7] transition-all cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wattage */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            قدرة الجهاز الكهربائي بالواط (Watt)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 1500"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.wattage ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              واط
            </span>
          </div>
          {errors.wattage && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.wattage}
            </p>
          )}
        </div>

        {/* Hours & Days */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              ساعات التشغيل يومياً
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 8"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
            {errors.hours && <p className="text-[10px] text-rose-500 mt-1">{errors.hours}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              عدد الأيام للفترة
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="مثال: 30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
            {errors.days && <p className="text-[10px] text-rose-500 mt-1">{errors.days}</p>}
          </div>
        </div>

        {/* Price per kWh */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            سعر الكيلوواط/ساعة (kWh) قابل للتعديل
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 50"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 pl-14 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                errors.price ? 'border-rose-500' : 'border-[var(--app-border)]'
              }`}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--app-text-secondary)] bg-[var(--app-surface)] px-2 py-1 rounded-lg border border-[var(--app-border)]">
              د.ع
            </span>
          </div>
          {errors.price && <p className="text-[10px] text-rose-500 mt-1">{errors.price}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب استهلاك وتكلفة الكهرباء
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
          primaryResult={`${Math.round(result.totalCost).toLocaleString('en-US')}`}
          primaryUnit={`د.ع (تكلفة ${days} يوم)`}
          badgeText={`${result.totalKwh.toFixed(1)} kWh`}
          badgeColor="indigo"
          details={[
            {
              label: 'التكلفة المقدرة للفترة',
              value: `${result.totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
              isHighlighted: true,
            },
            {
              label: 'إجمالي استهلاك الطاقة',
              value: `${result.totalKwh.toLocaleString('en-US', { maximumFractionDigits: 2 })} كيلوواط/ساعة (kWh)`,
            },
            {
              label: 'معدل الاستهلاك اليومي',
              value: `${result.dailyKwh.toLocaleString('en-US', { maximumFractionDigits: 3 })} kWh / يوم`,
            },
            {
              label: 'التكلفة السنوية التقديرية',
              value: `${result.annualCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} د.ع`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
