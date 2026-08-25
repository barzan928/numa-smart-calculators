import React, { useState, useEffect } from 'react';
import { Flame, RotateCcw, AlertCircle, ShieldAlert, User, Activity } from 'lucide-react';
import { ResultCard } from '../../components/common/ResultCard';

interface DailyCaloriesCalculatorViewProps {
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

export const DailyCaloriesCalculatorView: React.FC<DailyCaloriesCalculatorViewProps> = ({
  initialInputs,
  onSaveHistory,
  onShowToast,
}) => {
  const [weight, setWeight] = useState<string>(initialInputs?.weight?.toString() || '75');
  const [height, setHeight] = useState<string>(initialInputs?.height?.toString() || '175');
  const [age, setAge] = useState<string>(initialInputs?.age?.toString() || '28');
  const [gender, setGender] = useState<'male' | 'female'>(initialInputs?.gender || 'male');
  const [activity, setActivity] = useState<number>(initialInputs?.activity || 1.375);

  const [errors, setErrors] = useState<{ weight?: string; height?: string; age?: string }>({});

  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    mildLoss: number;
    standardLoss: number;
    weightGain: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: { weight?: string; height?: string; age?: string } = {};

    const numWeight = parseFloat(weight.replace(/,/g, ''));
    const numHeight = parseFloat(height.replace(/,/g, ''));
    const numAge = parseFloat(age.replace(/,/g, ''));

    if (!weight.trim() || isNaN(numWeight) || numWeight < 25 || numWeight > 300) {
      newErrors.weight = 'أدخل وزناً صحيحاً بين 25 و 300 كجم';
    }

    if (!height.trim() || isNaN(numHeight) || numHeight < 80 || numHeight > 250) {
      newErrors.height = 'أدخل طولاً صحيحاً بين 80 و 250 سم';
    }

    if (!age.trim() || isNaN(numAge) || numAge < 10 || numAge > 120) {
      newErrors.age = 'أدخل عمراً صحيحاً بين 10 و 120 سنة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Mifflin-St Jeor Formula
    // Male: 10*weight + 6.25*height - 5*age + 5
    // Female: 10*weight + 6.25*height - 5*age - 161
    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activity;
    const mildLoss = Math.max(1200, tdee - 300);
    const standardLoss = Math.max(1200, tdee - 500);
    const weightGain = tdee + 500;

    const res = {
      bmr,
      tdee,
      mildLoss,
      standardLoss,
      weightGain,
    };

    setResult(res);

    onSaveHistory({
      calculatorId: 'daily-calories',
      calculatorNameAr: 'حاسبة السعرات اليومية',
      primaryResult: `${Math.round(tdee).toLocaleString('en-US')}`,
      primaryUnit: 'سعرة / يوم (للثبات)',
      badgeText: `BMR: ${Math.round(bmr)} سعرة`,
      inputsSummary: `${numWeight}كجم | ${numHeight}سم | ${numAge}سنة | ${gender === 'male' ? 'ذكر' : 'أنثى'}`,
      inputs: { weight: numWeight, height: numHeight, age: numAge, gender, activity },
      details: [
        { label: 'سعرات المحافظة على الوزن الحالي (TDEE)', value: `${Math.round(tdee).toLocaleString('en-US')} سعرة حرارية`, isHighlighted: true },
        { label: 'معدل الأيض الأساسي أثناء الراحة (BMR)', value: `${Math.round(bmr).toLocaleString('en-US')} سعرة` },
        { label: 'سعرات إنقاص الوزن التدريجي (-0.35 كجم/أسبوع)', value: `${Math.round(mildLoss).toLocaleString('en-US')} سعرة` },
        { label: 'سعرات إنقاص الوزن المستمر (-0.5 كجم/أسبوع)', value: `${Math.round(standardLoss).toLocaleString('en-US')} سعرة` },
        { label: 'سعرات زيادة الوزن وبناء الكتلة (+0.5 كجم/أسبوع)', value: `${Math.round(weightGain).toLocaleString('en-US')} سعرة` },
      ],
    });
  };

  useEffect(() => {
    if (initialInputs?.weight) {
      calculate();
    }
  }, []);

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setActivity(1.375);
    setErrors({});
    setResult(null);
    onShowToast('تمت إعادة ضبط الحاسبة', 'info');
  };

  return (
    <div className="flex flex-col space-y-6 pt-2">
      <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#5B5BF7]" />
          البيانات الشخصية والنشاط
        </h2>

        {/* Gender selector */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            الجنس
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`h-11 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                gender === 'male'
                  ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40 shadow-xs'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)]'
              }`}
            >
              ذكر
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`h-11 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                gender === 'female'
                  ? 'bg-[#5B5BF7]/15 text-[#5B5BF7] border-[#5B5BF7]/40 shadow-xs'
                  : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-secondary)] border-[var(--app-border)]'
              }`}
            >
              أنثى
            </button>
          </div>
        </div>

        {/* Weight & Height */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              الوزن (كجم)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
            {errors.weight && <p className="text-[10px] text-rose-500 mt-1">{errors.weight}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
              الطول (سم)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="مثال: 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
            />
            {errors.height && <p className="text-[10px] text-rose-500 mt-1">{errors.height}</p>}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            العمر (بالسنوات)
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="مثال: 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-4 text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30"
          />
          {errors.age && <p className="text-[10px] text-rose-500 mt-1">{errors.age}</p>}
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-bold text-[var(--app-text-secondary)] mb-1.5">
            مستوى النشاط البدني
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            className="w-full h-12 bg-[var(--app-surface-subtle)] border border-[var(--app-border)] rounded-2xl px-3 text-xs font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/30 cursor-pointer"
          >
            <option value={1.2}>خامل (عمل مكتبي بدون تمارين رياضية)</option>
            <option value={1.375}>نشاط خفيف (تمارين 1-3 أيام في الأسبوع)</option>
            <option value={1.55}>نشاط متوسط (تمارين 3-5 أيام في الأسبوع)</option>
            <option value={1.725}>نشاط عالي (تمارين شاقة 6-7 أيام في الأسبوع)</option>
            <option value={1.9}>رياضي محترف (تمارين مضاعفة يومياً)</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={calculate}
            className="flex-1 h-12 bg-[#5B5BF7] hover:bg-[#4E4EE0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B5BF7]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            احسب الاحتياج اليومي
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
        <div className="space-y-4">
          <ResultCard
            primaryResult={`${Math.round(result.tdee).toLocaleString('en-US')}`}
            primaryUnit="سعرة حرارية / يوم"
            badgeText="لتثبيت الوزن الحالي"
            badgeColor="indigo"
            details={[
              {
                label: 'سعرات المحافظة على الوزن الحالي (TDEE)',
                value: `${Math.round(result.tdee).toLocaleString('en-US')} سعرة`,
                isHighlighted: true,
              },
              {
                label: 'معدل الحرق الأساسي أثناء الراحة (BMR)',
                value: `${Math.round(result.bmr).toLocaleString('en-US')} سعرة`,
              },
              {
                label: 'لإنقاص الوزن التدريجي (-300 سعرة)',
                value: `${Math.round(result.mildLoss).toLocaleString('en-US')} سعرة`,
              },
              {
                label: 'لإنقاص الوزن النشط (-500 سعرة)',
                value: `${Math.round(result.standardLoss).toLocaleString('en-US')} سعرة`,
              },
              {
                label: 'لزيادة الوزن وبناء العضلات (+500 سعرة)',
                value: `${Math.round(result.weightGain).toLocaleString('en-US')} سعرة`,
              },
            ]}
            onReset={handleReset}
            onShowToast={onShowToast}
          />

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">ملاحظة طبية استرشادية:</p>
              <p>
                القيم المحسوبة تقريبية وتعتمد على معادلة ميفلين-سانت جور (Mifflin-St Jeor). استشر أخصائي تغذية قبل تطبيق أي حمية غذائية حادة.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
