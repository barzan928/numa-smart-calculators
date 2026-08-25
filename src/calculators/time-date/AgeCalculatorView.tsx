import React, { useState, useEffect } from 'react';
import { Hourglass, RotateCcw, AlertCircle, Calendar, Gift, Clock } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface AgeCalculatorViewProps {
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

const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const AgeCalculatorView: React.FC<AgeCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [birthDate, setBirthDate] = useState<string>(
    initialInputs?.birthDate || '2000-01-01'
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    nextBirthdayDays: number;
    nextBirthdayMonth: number;
    nextBirthdayDayOfWeek: string;
    dayOfBirth: string;
    totalDays: number;
    totalHours: number;
    totalWeeks: number;
  } | null>(null);

  const calculate = () => {
    if (!birthDate) {
      setError('يرجى اختيار تاريخ الميلاد');
      setResult(null);
      return;
    }

    const birth = new Date(birthDate + 'T00:00:00');
    const today = new Date();

    if (isNaN(birth.getTime())) {
      setError('تاريخ غير صالح');
      setResult(null);
      return;
    }

    if (birth > today) {
      setError('تاريخ الميلاد لا يمكن أن يكون في المستقبل');
      setResult(null);
      return;
    }

    setError(null);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Next Birthday calculation
    const currentYear = today.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }

    const diffTimeNext = nextBday.getTime() - today.getTime();
    const nextBirthdayDays = Math.ceil(diffTimeNext / (1000 * 60 * 60 * 24));
    const nextBirthdayMonth = Math.floor(nextBirthdayDays / 30);
    const nextBirthdayDayOfWeek = ARABIC_DAYS[nextBday.getDay()];

    const dayOfBirth = ARABIC_DAYS[birth.getDay()];

    const diffTimeTotal = today.getTime() - birth.getTime();
    const totalDays = Math.floor(diffTimeTotal / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);

    const res = {
      years,
      months,
      days,
      nextBirthdayDays,
      nextBirthdayMonth,
      nextBirthdayDayOfWeek,
      dayOfBirth,
      totalDays,
      totalHours,
      totalWeeks,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'age',
      calculatorNameAr: 'حاسبة العمر',
      primaryResult: `${years} سنة و ${months} شهر`,
      primaryUnit: 'العمر الدقيق',
      badgeText: `تاريخ الميلاد: ${birthDate}`,
      inputsSummary: `تاريخ الميلاد: ${birthDate}`,
      inputs: { birthDate },
      details: [
        {
          label: 'العمر الدقيق بالتفصيل',
          value: `${years} سنة و ${months} شهر و ${days} يوم`,
          isHighlighted: true,
        },
        {
          label: 'عيد الميلاد القادم بعد',
          value: `${nextBirthdayDays} يوم (يوم ${nextBirthdayDayOfWeek})`,
        },
        { label: 'ولدت في يوم', value: `يوم ${dayOfBirth}` },
        { label: 'إجمالي الأيام التي عشتها', value: `${totalDays.toLocaleString('en-US')} يوم` },
        { label: 'إجمالي الأسابيع', value: `${totalWeeks.toLocaleString('en-US')} أسبوع` },
        { label: 'إجمالي الساعات التقريبية', value: `${totalHours.toLocaleString('en-US')} ساعة` },
      ],
    });
  };

  useEffect(() => {
    calculate();
  }, [birthDate]);

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setError(null);
    onShowToast('تمت إعادة ضبط التاريخ', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-[#5B5BF7]" />
          تحديد تاريخ الميلاد
        </h2>

        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            اختر تاريخ ميلادك
          </label>
          <div className="relative">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`w-full h-12 bg-[var(--app-surface-subtle)] border rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 transition-all ${
                error ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[var(--app-border)]'
              }`}
            />
          </div>
          {error && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب العمر
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
          primaryResult={`${result.years} سنة و ${result.months} شهر`}
          primaryUnit="العمر الدقيق"
          badgeText={`عيد ميلادك القادم بعد ${result.nextBirthdayDays} يوم`}
          badgeColor="indigo"
          details={[
            {
              label: 'العمر المفصل',
              value: `${result.years} سنة و ${result.months} شهر و ${result.days} يوم`,
              isHighlighted: true,
            },
            {
              label: 'موعد عيد الميلاد القادم',
              value: `بعد ${result.nextBirthdayDays} يوم (يوم ${result.nextBirthdayDayOfWeek})`,
            },
            {
              label: 'يوم الولادة',
              value: `يوم ${result.dayOfBirth}`,
            },
            {
              label: 'إجمالي الأيام',
              value: `${result.totalDays.toLocaleString('en-US')} يوم`,
            },
            {
              label: 'إجمالي الأسابيع',
              value: `${result.totalWeeks.toLocaleString('en-US')} أسبوع`,
            },
            {
              label: 'إجمالي الساعات',
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
