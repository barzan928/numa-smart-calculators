import { CalculationResult } from '../types';
import { formatNumber, parseRawNumber } from '../../utils/numberFormat';

export type PercentageMode = 'percentOfNumber' | 'numberRatio' | 'increaseDecrease';

export interface PercentageInputs {
  mode: PercentageMode;
  // Mode 1: percentOfNumber (e.g., 25% of 200)
  percentValue?: string;
  totalValue?: string;

  // Mode 2: numberRatio (e.g., 50 of 200)
  partValue?: string;
  wholeValue?: string;

  // Mode 3: increaseDecrease (e.g., 200 +/- 10%)
  baseValue?: string;
  changeRate?: string;
  operation?: 'increase' | 'decrease';
}

export interface PercentageValidationErrors {
  field1?: string;
  field2?: string;
}

export function validatePercentageInputs(inputs: PercentageInputs): {
  isValid: boolean;
  errors: PercentageValidationErrors;
} {
  const errors: PercentageValidationErrors = {};

  if (inputs.mode === 'percentOfNumber') {
    const percent = parseRawNumber(inputs.percentValue || '');
    const total = parseRawNumber(inputs.totalValue || '');

    if (!inputs.percentValue || inputs.percentValue.trim() === '') {
      errors.field1 = 'يرجى إدخال النسبة المئوية';
    } else if (percent === null) {
      errors.field1 = 'يرجى إدخال نسبة صحيحة';
    }

    if (!inputs.totalValue || inputs.totalValue.trim() === '') {
      errors.field2 = 'يرجى إدخال الرقم الأساسي';
    } else if (total === null) {
      errors.field2 = 'يرجى إدخال رقم صحيح';
    }
  } else if (inputs.mode === 'numberRatio') {
    const part = parseRawNumber(inputs.partValue || '');
    const whole = parseRawNumber(inputs.wholeValue || '');

    if (!inputs.partValue || inputs.partValue.trim() === '') {
      errors.field1 = 'يرجى إدخال الرقم الجزئي';
    } else if (part === null) {
      errors.field1 = 'يرجى إدخال رقم صحيح';
    }

    if (!inputs.wholeValue || inputs.wholeValue.trim() === '') {
      errors.field2 = 'يرجى إدخال الرقم الكلي';
    } else if (whole === null || whole === 0) {
      errors.field2 = 'الرقم الكلي لا يمكن أن يكون صفراً';
    }
  } else if (inputs.mode === 'increaseDecrease') {
    const base = parseRawNumber(inputs.baseValue || '');
    const rate = parseRawNumber(inputs.changeRate || '');

    if (!inputs.baseValue || inputs.baseValue.trim() === '') {
      errors.field1 = 'يرجى إدخال القيمة الأصلية';
    } else if (base === null) {
      errors.field1 = 'يرجى إدخال قيمة صحيحة';
    }

    if (!inputs.changeRate || inputs.changeRate.trim() === '') {
      errors.field2 = 'يرجى إدخال نسبة التغير';
    } else if (rate === null || rate < 0) {
      errors.field2 = 'نسبة التغير لا يمكن أن تكون سالبة';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculatePercentage(inputs: PercentageInputs): CalculationResult | null {
  if (inputs.mode === 'percentOfNumber') {
    const percent = parseRawNumber(inputs.percentValue || '');
    const total = parseRawNumber(inputs.totalValue || '');

    if (percent === null || total === null) return null;

    const result = (percent / 100) * total;
    const formattedResult = formatNumber(result);
    const formattedPercent = formatNumber(percent);
    const formattedTotal = formatNumber(total);

    return {
      title: 'الناتج المحسوب',
      primaryValue: formattedResult,
      secondaryLabel: `${formattedPercent}% من ${formattedTotal}`,
      badge: {
        text: 'نسبة من رقم',
        type: 'primary',
      },
      details: [
        { label: 'النسبة المئوية', value: `${formattedPercent}%` },
        { label: 'العدد الأساسي', value: formattedTotal },
        { label: 'الناتج النهائي', value: formattedResult, isHighlighted: true },
      ],
      shareText: `NUMA — حاسبة النسبة المئوية
${formattedPercent}% من ${formattedTotal} = ${formattedResult}`,
      copyText: formattedResult,
    };
  }

  if (inputs.mode === 'numberRatio') {
    const part = parseRawNumber(inputs.partValue || '');
    const whole = parseRawNumber(inputs.wholeValue || '');

    if (part === null || whole === null || whole === 0) return null;

    const ratioPercent = (part / whole) * 100;
    const formattedRatio = formatNumber(ratioPercent);
    const formattedPart = formatNumber(part);
    const formattedWhole = formatNumber(whole);

    return {
      title: 'النسبة المئوية',
      primaryValue: `${formattedRatio}%`,
      secondaryLabel: `تمثل ${formattedPart} من إجمالي ${formattedWhole}`,
      badge: {
        text: 'نسبة رقم من رقم',
        type: 'primary',
      },
      details: [
        { label: 'الرقم الجزئي', value: formattedPart },
        { label: 'الرقم الكلي', value: formattedWhole },
        { label: 'النسبة المئوية', value: `${formattedRatio}%`, isHighlighted: true },
      ],
      shareText: `NUMA — حاسبة النسبة المئوية
نسبة ${formattedPart} من ${formattedWhole} = ${formattedRatio}%`,
      copyText: `${formattedRatio}%`,
    };
  }

  if (inputs.mode === 'increaseDecrease') {
    const base = parseRawNumber(inputs.baseValue || '');
    const rate = parseRawNumber(inputs.changeRate || '');
    const operation = inputs.operation || 'increase';

    if (base === null || rate === null || rate < 0) return null;

    const changeAmount = base * (rate / 100);
    const finalValue = operation === 'increase' ? base + changeAmount : base - changeAmount;

    const formattedBase = formatNumber(base);
    const formattedRate = formatNumber(rate);
    const formattedChange = formatNumber(changeAmount);
    const formattedFinal = formatNumber(finalValue);
    const opLabel = operation === 'increase' ? 'زيادة' : 'نقصان';

    return {
      title: `القيمة بعد ال${opLabel}`,
      primaryValue: formattedFinal,
      secondaryLabel: `مقدار ال${opLabel}: ${formattedChange} (${formattedRate}%)`,
      badge: {
        text: `${opLabel} ${formattedRate}%`,
        type: operation === 'increase' ? 'success' : 'warning',
      },
      details: [
        { label: 'القيمة الأصلية', value: formattedBase },
        { label: 'نوع العملية', value: opLabel },
        { label: `مقدار ال${opLabel}`, value: formattedChange, isHighlighted: true },
        { label: 'القيمة النهائية', value: formattedFinal, isHighlighted: true },
      ],
      shareText: `NUMA — حاسبة الزيادة والنقصان
القيمة الأصلية: ${formattedBase}
العملية: ${opLabel} بنسبة ${formattedRate}%
مقدار التغير: ${formattedChange}
القيمة النهائية: ${formattedFinal}`,
      copyText: formattedFinal,
    };
  }

  return null;
}
