import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { CalculatorItem } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';

// Finance
import { DiscountCalculatorView } from '../../calculators/discount/DiscountCalculatorView';
import { PercentageCalculatorView } from '../../calculators/percentage/PercentageCalculatorView';
import { ProfitLossCalculatorView } from '../../calculators/profit-loss/ProfitLossCalculatorView';
import { ProfitMarginCalculatorView } from '../../calculators/profit-margin/ProfitMarginCalculatorView';
import { SellingPriceCalculatorView } from '../../calculators/selling-price/SellingPriceCalculatorView';
import { InstallmentsCalculatorView } from '../../calculators/installments/InstallmentsCalculatorView';

// Math
import { AverageCalculatorView } from '../../calculators/math/AverageCalculatorView';
import { IncreaseDecreaseCalculatorView } from '../../calculators/math/IncreaseDecreaseCalculatorView';
import { FractionsCalculatorView } from '../../calculators/math/FractionsCalculatorView';
import { ArithmeticCalculatorView } from '../../calculators/math/ArithmeticCalculatorView';

// Conversions
import { UnitConverterView } from '../../calculators/conversions/UnitConverterView';

// Time & Date
import { AgeCalculatorView } from '../../calculators/time-date/AgeCalculatorView';
import { DateDiffCalculatorView } from '../../calculators/time-date/DateDiffCalculatorView';
import { AddSubDaysCalculatorView } from '../../calculators/time-date/AddSubDaysCalculatorView';
import { TimeConverterView } from '../../calculators/time-date/TimeConverterView';

// Health
import { BmiCalculatorView } from '../../calculators/health/BmiCalculatorView';
import { DailyCaloriesCalculatorView } from '../../calculators/health/DailyCaloriesCalculatorView';
import { IdealWeightCalculatorView } from '../../calculators/health/IdealWeightCalculatorView';

// Daily Life
import { MonthlyExpensesCalculatorView } from '../../calculators/daily-life/MonthlyExpensesCalculatorView';
import { ElectricityCalculatorView } from '../../calculators/daily-life/ElectricityCalculatorView';
import { ShapeAreaCalculatorView } from '../../calculators/daily-life/ShapeAreaCalculatorView';
import { ShapeVolumeCalculatorView } from '../../calculators/daily-life/ShapeVolumeCalculatorView';

interface CalculatorDetailViewProps {
  calculator: CalculatorItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  savedInputs?: Record<string, any>;
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

export const CalculatorDetailView: React.FC<CalculatorDetailViewProps> = ({
  calculator,
  isFavorite,
  onToggleFavorite,
  onBack,
  savedInputs,
  onSaveHistory,
  onShowToast,
}) => {
  return (
    <div
      id={`calculator-detail-${calculator.id}`}
      className="w-full flex flex-col pt-4 pb-12 animate-in fade-in duration-200"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--app-border)]">
        <button
          id="btn-calc-back"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 -mr-2 rounded-xl text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] active:scale-95 transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5B5BF7] bg-[#5B5BF7]/10 px-2.5 py-1 rounded-full border border-[#5B5BF7]/20">
            {calculator.categoryAr}
          </span>
          <button
            type="button"
            id={`btn-calc-detail-fav-${calculator.id}`}
            onClick={() => onToggleFavorite(calculator.id)}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            className="w-9 h-9 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[#5B5BF7] transition-colors cursor-pointer"
          >
            <Star
              className={`w-4 h-4 transition-all ${
                isFavorite
                  ? 'fill-[#FFB020] text-[#FFB020]'
                  : 'text-[var(--app-text-secondary)]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="pt-5 pb-4">
        <div className="flex items-start gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center text-[#5B5BF7] shrink-0 shadow-sm">
            <DynamicIcon name={calculator.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h1
              id="calc-detail-title"
              className="text-xl font-extrabold text-[var(--app-text)] leading-tight tracking-tight"
            >
              {calculator.nameAr}
            </h1>
            <p
              id="calc-detail-subtitle"
              className="text-xs font-medium text-[var(--app-text-secondary)] mt-1"
            >
              {calculator.description}
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Body - Route to specific active calculator */}
      {/* 1. Finance */}
      {calculator.id === 'profit-loss' && (
        <ProfitLossCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'profit-margin' && (
        <ProfitMarginCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'selling-price' && (
        <SellingPriceCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'discount' && (
        <DiscountCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'finance-percentage' && (
        <PercentageCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'installments' && (
        <InstallmentsCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}

      {/* 2. Math */}
      {calculator.id === 'percentage' && (
        <PercentageCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'average' && (
        <AverageCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'increase-decrease' && (
        <IncreaseDecreaseCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'fractions' && (
        <FractionsCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'arithmetic' && (
        <ArithmeticCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}

      {/* 3. Conversions */}
      {['length', 'weight', 'area', 'volume', 'temperature', 'speed'].includes(
        calculator.id
      ) && (
        <UnitConverterView
          categoryKey={calculator.id}
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}

      {/* 4. Time & Date */}
      {calculator.id === 'age' && (
        <AgeCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'date-difference' && (
        <DateDiffCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'add-days' && (
        <AddSubDaysCalculatorView
          mode="add"
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'subtract-days' && (
        <AddSubDaysCalculatorView
          mode="subtract"
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'time-converter' && (
        <TimeConverterView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}

      {/* 5. Health */}
      {calculator.id === 'bmi' && (
        <BmiCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'daily-calories' && (
        <DailyCaloriesCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'ideal-weight' && (
        <IdealWeightCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}

      {/* 6. Daily Life */}
      {calculator.id === 'monthly-expenses' && (
        <MonthlyExpensesCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'electricity-consumption' && (
        <ElectricityCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'room-area' && (
        <ShapeAreaCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
      {calculator.id === 'tank-volume' && (
        <ShapeVolumeCalculatorView
          initialInputs={savedInputs}
          onSaveHistory={onSaveHistory}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
