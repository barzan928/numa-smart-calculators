import React, { useState, useEffect } from 'react';
import { CalendarRange, RotateCcw, AlertCircle, Calendar } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface DateDiffCalculatorViewProps {
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

export const DateDiffCalculatorView: React.FC<DateDiffCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [startDate, setStartDate] = useState<string>(
    initialInputs?.startDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    initialInputs?.endDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    remainingDaysInWeek: number;
    totalHours: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: { start?: string; end?: string } = {};

    if (!startDate) newErrors.start = 'يرجى اختيار تاريخ البداية';
    if (!endDate) newErrors.end = 'يرجى اختيار تاريخ النهاية';

    const d1 = new Date(startDate + 'T00:00:00');
    const d2 = new Date(endDate + 'T00:00:00');

    if (isNaN(d1.getTime())) newErrors.start = 'تاريخ بداية غير صالح';
    if (isNaN(d2.getTime())) newErrors.end = 'تاريخ نهاية غير صالح';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Ensure d1 <= d2 for difference logic
    const isReversed = d1 > d2;
    const earlier = isReversed ? d2 : d1;
    const later = isReversed ? d1 : d2;

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(
        later.getFullYear(),
        later.getMonth(),
        0
      ).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysInWeek = totalDays % 7;
    const totalHours = totalDays * 24;

    const res = {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysInWeek,
      totalHours,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'date-difference',
      calculatorNameAr: 'حاسبة الفرق بين تاريخين',
      primaryResult: `${totalDays.toLocaleString('en-US')}`,
      primaryUnit: 'يوم',
      badgeText: `${years > 0 ? `${years} سنة و ` : ''}${months} شهر و ${days} يوم`,
      inputsSummary: `من ${startDate} إلى ${endDate}`,
      inputs: { startDate, endDate },
      details: [
        { label: 'إجمالي عدد الأيام', value: `${totalDays.toLocaleString('en-US')} يوم`, isHighlighted: true },
        { label: 'بالسنوات والأشهر والأيام', value: `${years} سنة، ${months} شهر، ${days} يوم` },
        { label: 'بالأسابيع والأيام', value: `${totalWeeks} أسبوع و ${remainingDaysInWeek} يوم` },
        { label: 'إجمالي الساعات', value: `${totalHours.toLocaleString('en-US')} ساعة` },
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [startDate, endDate]);

  const handleReset = () => {
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setErrors({});
    onShowToast('تمت إعادة ضبط التواريخ', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-[#5B5BF7]" />
          تحديد التاريخين
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            تاريخ البداية (من)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              errors.start ? 'border-rose-500' : 'border-[var(--app-border)]'
            }`}
          />
          {errors.start && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.start}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            تاريخ النهاية (إلى)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
              errors.end ? 'border-rose-500' : 'border-[var(--app-border)]'
            }`}
          />
          {errors.end && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.end}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب الفارق الزمني
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
          primaryResult={`${result.totalDays.toLocaleString('en-US')}`}
          primaryUnit="يوم"
          badgeText={`${result.years > 0 ? `${result.years} سنة و ` : ''}${result.months} شهر و ${result.days} يوم`}
          badgeColor="indigo"
          details={[
            {
              label: 'إجمالي عدد الأيام',
              value: `${result.totalDays.toLocaleString('en-US')} يوم`,
              isHighlighted: true,
            },
            {
              label: 'بالسنوات والأشهر والأيام',
              value: `${result.years} سنة و ${result.months} شهر و ${result.days} يوم`,
            },
            {
              label: 'بالأسابيع والأيام',
              value: `${result.totalWeeks} أسبوع و ${result.remainingDaysInWeek} يوم`,
            },
            {
              label: 'إجمالي الساعات التقريبية',
              value: `${result.totalHours.toLocaleString('en-US')} ساعة`,
            },
          ]}
          onReset={handleReset}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
