import { CalculationResult, DEFAULT_CURRENCY } from '../types';
import { formatNumber, parseRawNumber } from '../../utils/numberFormat';

export interface ProfitLossInputs {
  costPrice: string;
  sellingPrice: string;
  quantity?: string;
  currencySymbol?: string;
}

export interface ProfitLossValidationErrors {
  costPrice?: string;
  sellingPrice?: string;
  quantity?: string;
}

export function validateProfitLossInputs(inputs: ProfitLossInputs): {
  isValid: boolean;
  errors: ProfitLossValidationErrors;
} {
  const errors: ProfitLossValidationErrors = {};

  const cost = parseRawNumber(inputs.costPrice);
  const selling = parseRawNumber(inputs.sellingPrice);
  const qty = inputs.quantity && inputs.quantity.trim() !== '' ? parseRawNumber(inputs.quantity) : 1;

  if (inputs.costPrice.trim() === '') {
    errors.costPrice = 'يرجى إدخال سعر الشراء / التكلفة';
  } else if (cost === null || cost < 0) {
    errors.costPrice = 'سعر الشراء لا يمكن أن يكون سالباً';
  }

  if (inputs.sellingPrice.trim() === '') {
    errors.sellingPrice = 'يرجى إدخال سعر البيع';
  } else if (selling === null || selling < 0) {
    errors.sellingPrice = 'سعر البيع لا يمكن أن يكون سالباً';
  }

  if (qty === null || qty <= 0) {
    errors.quantity = 'الكمية يجب أن تكون 1 على الأقل';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateProfitLoss(inputs: ProfitLossInputs): CalculationResult | null {
  const cost = parseRawNumber(inputs.costPrice);
  const selling = parseRawNumber(inputs.sellingPrice);
  const qty = inputs.quantity && inputs.quantity.trim() !== '' ? parseRawNumber(inputs.quantity) : 1;
  const currency = inputs.currencySymbol || DEFAULT_CURRENCY.symbol;

  if (cost === null || cost < 0 || selling === null || selling < 0 || qty === null || qty <= 0) {
    return null;
  }

  const totalCost = cost * qty;
  const totalRevenue = selling * qty;
  const netDifference = totalRevenue - totalCost;

  const isProfit = netDifference > 0;
  const isLoss = netDifference < 0;
  const isBreakeven = netDifference === 0;

  const absDifference = Math.abs(netDifference);

  // Margin based on revenue (or cost if revenue is 0)
  const marginPercent = totalRevenue > 0 ? (absDifference / totalRevenue) * 100 : 0;
  const roiPercent = totalCost > 0 ? (absDifference / totalCost) * 100 : 0;

  const formattedCost = formatNumber(totalCost);
  const formattedRevenue = formatNumber(totalRevenue);
  const formattedDiff = formatNumber(absDifference);
  const formattedMargin = formatNumber(marginPercent);
  const formattedROI = formatNumber(roiPercent);
  const formattedQty = formatNumber(qty);

  let statusTitle = 'صافي الربح';
  let badgeText = `ربح +${formattedMargin}%`;
  let badgeType: 'success' | 'error' | 'neutral' = 'success';
  let secondaryText = `هامش الربح: ${formattedMargin}% | العائد: ${formattedROI}%`;

  if (isLoss) {
    statusTitle = 'صافي الخسارة';
    badgeText = `خسارة -${formattedMargin}%`;
    badgeType = 'error';
    secondaryText = `نسبة الخسارة: ${formattedMargin}% من المبيعات`;
  } else if (isBreakeven) {
    statusTitle = 'النتيجة المالية';
    badgeText = 'نقطة تعادل (0%)';
    badgeType = 'neutral';
    secondaryText = 'لا يوجد ربح أو خسارة (سعر البيع يعادل التكلفة)';
  }

  const shareText = `NUMA — حاسبة الربح والخسارة
إجمالي التكلفة (${formattedQty} قطع): ${formattedCost} ${currency}
إجمالي المبيعات: ${formattedRevenue} ${currency}
${isProfit ? 'صافي الربح' : isLoss ? 'صافي الخسارة' : 'النتيجة'}: ${formattedDiff} ${currency}
${isBreakeven ? 'لا يوجد ربح أو خسارة' : `هامش الربح: ${formattedMargin}%`}`;

  const copyText = `${formattedDiff} ${currency} ${isProfit ? 'ربح' : isLoss ? 'خسارة' : 'تعادل'}`;

  return {
    title: statusTitle,
    primaryValue: isBreakeven ? '0' : `${isLoss ? '-' : '+'}${formattedDiff}`,
    primaryUnit: currency,
    secondaryLabel: secondaryText,
    badge: {
      text: badgeText,
      type: badgeType,
    },
    details: [
      {
        label: `إجمالي التكلفة (${formattedQty} وحدة)`,
        value: `${formattedCost} ${currency}`,
      },
      {
        label: 'إجمالي المبيعات',
        value: `${formattedRevenue} ${currency}`,
      },
      {
        label: isProfit ? 'صافي الربح' : isLoss ? 'صافي الخسارة' : 'الصافي',
        value: `${formattedDiff} ${currency}`,
        type: isProfit ? 'success' : isLoss ? 'error' : 'default',
        isHighlighted: true,
      },
      {
        label: 'هامش الربح',
        value: isBreakeven ? '0%' : `${formattedMargin}%`,
        type: isProfit ? 'success' : isLoss ? 'error' : 'default',
      },
      {
        label: 'العائد على الاستثمار (ROI)',
        value: isBreakeven ? '0%' : `${formattedROI}%`,
      },
    ],
    shareText,
    copyText,
  };
}
