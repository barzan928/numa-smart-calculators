import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { formatNumber, parseRawNumber } from '../../utils/numberFormat';

export interface InstallmentsInputs {
  totalAmount: string;
  downPayment?: string;
  installmentsCount: string;
  interestRate?: string;
  currencySymbol?: string;
}

export interface InstallmentsValidationErrors {
  totalAmount?: string;
  downPayment?: string;
  installmentsCount?: string;
  interestRate?: string;
}

export function validateInstallmentsInputs(inputs: InstallmentsInputs): {
  isValid: boolean;
  errors: InstallmentsValidationErrors;
} {
  const errors: InstallmentsValidationErrors = {};

  const total = parseRawNumber(inputs.totalAmount);
  const downPayment = inputs.downPayment && inputs.downPayment.trim() !== ''
    ? parseRawNumber(inputs.downPayment)
    : 0;
  const count = parseRawNumber(inputs.installmentsCount);
  const interest = inputs.interestRate && inputs.interestRate.trim() !== ''
    ? parseRawNumber(inputs.interestRate)
    : 0;

  if (inputs.totalAmount.trim() === '') {
    errors.totalAmount = 'يرجى إدخال قيمة المبلغ الإجمالي';
  } else if (total === null || total <= 0) {
    errors.totalAmount = 'يرجى إدخال مبلغ صحيح أكبر من الصفر';
  }

  if (downPayment === null || downPayment < 0) {
    errors.downPayment = 'الدفعة الأولى لا يمكن أن تكون سالبة';
  } else if (total !== null && downPayment >= total) {
    errors.downPayment = 'الدفعة الأولى يجب أن تكون أقل من إجمالي المبلغ';
  }

  if (inputs.installmentsCount.trim() === '') {
    errors.installmentsCount = 'يرجى إدخال عدد الأقساط';
  } else if (count === null || count <= 0) {
    errors.installmentsCount = 'عدد الأقساط يجب أن يكون 1 على الأقل';
  } else if (!Number.isInteger(count)) {
    errors.installmentsCount = 'عدد الأقساط يجب أن يكون عدداً صحيحاً';
  }

  if (interest === null || interest < 0) {
    errors.interestRate = 'نسبة الفائدة لا يمكن أن تكون سالبة';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateInstallments(inputs: InstallmentsInputs): CalculationResult | null {
  const total = parseRawNumber(inputs.totalAmount);
  const downPayment = inputs.downPayment && inputs.downPayment.trim() !== ''
    ? parseRawNumber(inputs.downPayment)
    : 0;
  const count = parseRawNumber(inputs.installmentsCount);
  const interestRate = inputs.interestRate && inputs.interestRate.trim() !== ''
    ? parseRawNumber(inputs.interestRate)
    : 0;
  const currency = inputs.currencySymbol || DEFAULT_CURRENCY.symbol;

  if (
    total === null ||
    total <= 0 ||
    downPayment === null ||
    downPayment < 0 ||
    downPayment >= total ||
    count === null ||
    count <= 0 ||
    interestRate === null ||
    interestRate < 0
  ) {
    return null;
  }

  const remainingPrincipal = total - downPayment;

  // Simple annual interest formula proportional to repayment term (months / 12)
  const totalInterest = interestRate > 0
    ? remainingPrincipal * (interestRate / 100) * (count / 12)
    : 0;

  const totalFinancedWithInterest = remainingPrincipal + totalInterest;
  const monthlyInstallment = totalFinancedWithInterest / count;

  const formattedMonthly = formatNumber(monthlyInstallment);
  const formattedPrincipal = formatNumber(remainingPrincipal);
  const formattedTotalInterest = formatNumber(totalInterest);
  const formattedTotalFinanced = formatNumber(totalFinancedWithInterest);
  const formattedDownPayment = formatNumber(downPayment);
  const formattedTotal = formatNumber(total);
  const formattedCount = formatNumber(count);
  const formattedRate = formatNumber(interestRate);

  const shareText = `NUMA — حاسبة الأقساط
إجمالي المبلغ: ${formattedTotal} ${currency}
الدفعة الأولى: ${formattedDownPayment} ${currency}
المبلغ المتبقي للتقسيط: ${formattedPrincipal} ${currency}
عدد الأقساط: ${formattedCount} شهر
${interestRate > 0 ? `الفائدة (${formattedRate}%): ${formattedTotalInterest} ${currency}\n` : ''}القسط الشهري: ${formattedMonthly} ${currency}/شهر
إجمالي المبلغ المدفوع: ${formattedTotalFinanced} ${currency}`;

  const copyText = `${formattedMonthly} ${currency}/شهر (${formattedCount} قسط)`;

  return {
    title: 'القسط الشهري المستحق',
    primaryValue: formattedMonthly,
    primaryUnit: `${currency} / شهر`,
    secondaryLabel: `${formattedCount} قسط شهري على المبلغ المتبقي (${formattedPrincipal} ${currency})`,
    badge: {
      text: interestRate > 0 ? `فائدة ${formattedRate}%` : 'بدون فوائد (0%)',
      type: interestRate > 0 ? 'warning' : 'success',
    },
    details: [
      {
        label: 'إجمالي المبلغ الأصلي',
        value: `${formattedTotal} ${currency}`,
      },
      {
        label: 'الدفعة الأولى المدفوعة',
        value: `${formattedDownPayment} ${currency}`,
      },
      {
        label: 'المبلغ المتبقي للتقسيط',
        value: `${formattedPrincipal} ${currency}`,
      },
      {
        label: 'عدد الأقساط الشهرية',
        value: `${formattedCount} شهر`,
      },
      {
        label: 'إجمالي الفوائد',
        value: interestRate > 0 ? `${formattedTotalInterest} ${currency}` : '0 د.ع (بدون فوائد)',
        type: interestRate > 0 ? 'warning' : 'success',
      },
      {
        label: 'إجمالي المبلغ المستحق بالأقساط',
        value: `${formattedTotalFinanced} ${currency}`,
        isHighlighted: true,
      },
    ],
    shareText,
    copyText,
  };
}
