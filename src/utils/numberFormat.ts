/**
 * Safe numeric helper functions and formatting utilities
 */

/**
 * Format a number with thousands separators
 * e.g., 100000 -> "100,000"
 * e.g., 12.3456 -> "12.35"
 */
export function formatNumber(
  value: number | string | null | undefined,
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    fallback?: string;
  }
): string {
  if (value === null || value === undefined || value === '') {
    return options?.fallback ?? '';
  }

  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  if (isNaN(num) || !isFinite(num)) {
    return options?.fallback ?? '0';
  }

  const maxDecimals = options?.maximumFractionDigits ?? (Number.isInteger(num) ? 0 : 2);
  const minDecimals = options?.minimumFractionDigits ?? 0;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
}

/**
 * Clean a string input to parseable number string
 * Strips thousands separators, spaces, non-numeric characters (except single decimal point)
 */
export function parseRawNumber(value: string | number): number | null {
  if (typeof value === 'number') {
    return isNaN(value) || !isFinite(value) ? null : value;
  }

  if (!value || typeof value !== 'string') return null;

  // Clean arabic numbers to standard digits if any
  const standardValue = value
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/,/g, '')
    .trim();

  const parsed = parseFloat(standardValue);
  if (isNaN(parsed) || !isFinite(parsed)) return null;

  return parsed;
}

/**
 * Clean an input string while user is typing to allow only numbers and decimal point
 */
export function sanitizeNumberInput(text: string): string {
  // Convert Arabic-Indic digits to standard digits
  let clean = text.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());

  // Remove everything except digits and one decimal dot
  clean = clean.replace(/[^0-9.]/g, '');

  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }

  return clean;
}

/**
 * Format a typing string for live display with commas while typing
 */
export function formatTypingValue(raw: string): string {
  if (!raw) return '';
  const sanitized = sanitizeNumberInput(raw);
  if (!sanitized) return '';

  const parts = sanitized.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  if (!integerPart && decimalPart) {
    return '0' + decimalPart;
  }

  if (!integerPart) return '';

  // Add commas to integer part
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedInt + decimalPart;
}
