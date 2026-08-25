const USAGE_STORAGE_KEY = 'numa_calculator_usage_counts';

/**
 * Get all stored calculator usage counts from localStorage
 */
export function getCalculatorUsageCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Increment the usage counter for a given calculator ID
 */
export function trackCalculatorUsage(calculatorId: string): void {
  try {
    const current = getCalculatorUsageCounts();
    const newCount = (current[calculatorId] || 0) + 1;
    current[calculatorId] = newCount;
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Graceful fallback
  }
}

/**
 * Returns an array of calculator IDs sorted by actual local usage count
 */
export function getMostUsedCalculatorIds(limit = 6): string[] {
  const counts = getCalculatorUsageCounts();
  const entries = Object.entries(counts);
  
  if (entries.length === 0) {
    return [];
  }

  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}
