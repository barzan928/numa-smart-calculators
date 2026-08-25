import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { formatNumber, parseRawNumber } from '../../utils/numberFormat';

export interface DiscountInputs {
  originalPrice: string;
  discountRate: string;
  currencySymbol?: string;
}

export interface DiscountValidationErrors {
  originalPrice?: string;
  discountRate?: string;
}

export function validateDiscountInputs(inputs: DiscountInputs): {
  isValid: boolean;
  errors: DiscountValidationErrors;
} {
  const errors: DiscountValidationErrors = {};

  const originalPrice = parseRawNumber(inputs.originalPrice);
  const discountRate = parseRawNumber(inputs.discountRate);

  if (inputs.originalPrice.trim() === '') {
    errors.originalPrice = 'يرجى إدخال السعر الأصلي';
  } else if (originalPrice === null || originalPrice <= 0) {
    errors.originalPrice = 'يرجى إدخال سعر صحيح أكبر من الصفر';
  }

  if (inputs.discountRate.trim() === '') {
    errors.discountRate = 'يرجى إدخال نسبة الخصم';
  } else if (discountRate === null || discountRate < 0 || discountRate > 100) {
    errors.discountRate = 'نسبة الخصم يجب أن تكون بين 0% و 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateDiscount(inputs: DiscountInputs): CalculationResult | null {
  const originalPrice = parseRawNumber(inputs.originalPrice);
  const discountRate = parseRawNumber(inputs.discountRate);
  const currency = inputs.currencySymbol || DEFAULT_CURRENCY.symbol;

  if (originalPrice === null || originalPrice <= 0 || discountRate === null || discountRate < 0 || discountRate > 100) {
    return null;
  }

  const discountAmount = originalPrice * (discountRate / 100);
  const finalPrice = originalPrice - discountAmount;

  const formattedOriginal = formatNumber(originalPrice);
  const formattedDiscountAmount = formatNumber(discountAmount);
  const formattedFinalPrice = formatNumber(finalPrice);
  const formattedRate = formatNumber(discountRate);

  const shareText = `NUMA — حاسبة الخصم
السعر الأصلي: ${formattedOriginal} ${currency}
نسبة الخصم: ${formattedRate}%
قيمة الخصم (التوفير): ${formattedDiscountAmount} ${currency}
السعر النهائي بعد الخصم: ${formattedFinalPrice} ${currency}`;

  const copyText = `${formattedFinalPrice} ${currency}`;

  return {
    title: 'السعر بعد الخصم',
    primaryValue: formattedFinalPrice,
    primaryUnit: currency,
    secondaryLabel: `وفرت ${formattedDiscountAmount} ${currency} (${formattedRate}%)`,
    badge: {
      text: `خصم ${formattedRate}%`,
      type: 'success',
    },
    details: [
      {
        label: 'السعر الأصلي',
        value: `${formattedOriginal} ${currency}`,
      },
      {
        label: 'قيمة الخصم (التوفير)',
        value: `${formattedDiscountAmount} ${currency}`,
        type: 'success',
        isHighlighted: true,
      },
      {
        label: 'السعر النهائي بعد الخصم',
        value: `${formattedFinalPrice} ${currency}`,
        isHighlighted: true,
      },
    ],
    shareText,
    copyText,
  };
}
