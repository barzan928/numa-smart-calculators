import { CalculatorItem, CategoryId, SortType } from '../types';

/**
 * Remove Arabic diacritics (tashkeel), normalize Alefs, Taa Marbuta, Alef Maksura
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // remove tashkeel and tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/[\s\-_]+/g, ' ')
    .trim();
}

/**
 * Strip Arabic definite article "ال" if present at beginning of token
 */
export function stripArabicDefiniteArticle(token: string): string {
  const norm = normalizeArabic(token);
  if (norm.startsWith('ال') && norm.length > 3) {
    return norm.slice(2);
  }
  return norm;
}

/**
 * Extract tokens including stripped versions for flexible matching
 */
export function getTokens(text: string): string[] {
  const norm = normalizeArabic(text);
  if (!norm) return [];
  const words = norm.split(/[\s,،.\-_/]+/).filter(Boolean);
  const tokenSet = new Set<string>();

  words.forEach((w) => {
    tokenSet.add(w);
    const stripped = stripArabicDefiniteArticle(w);
    if (stripped !== w) {
      tokenSet.add(stripped);
    }
  });

  return Array.from(tokenSet);
}

/**
 * Calculate dynamic search relevance score for a calculator given a query
 */
export function calculateSearchScore(
  query: string,
  calc: CalculatorItem,
  recentIds: string[] = [],
  favoriteIds: string[] = [],
  usageCounts: Record<string, number> = {}
): number {
  if (!query || !query.trim()) return 0;

  const rawQuery = query.toLowerCase().trim();
  const normQuery = normalizeArabic(query);
  const strippedQuery = stripArabicDefiniteArticle(normQuery);

  const normNameAr = normalizeArabic(calc.nameAr);
  const strippedNameAr = stripArabicDefiniteArticle(normNameAr);
  const normNameEn = calc.name.toLowerCase();
  const normDesc = normalizeArabic(calc.description);
  const normCatAr = normalizeArabic(calc.categoryAr);

  let score = 0;

  // 1. Direct exact matches
  if (normNameAr === normQuery || strippedNameAr === strippedQuery) {
    score += 1500;
  } else if (normNameEn === rawQuery) {
    score += 1200;
  }

  // 2. Name starts with query
  if (normNameAr.startsWith(normQuery) || strippedNameAr.startsWith(strippedQuery)) {
    score += 800;
  } else if (normNameEn.startsWith(rawQuery)) {
    score += 700;
  }

  // 3. Name contains query
  if (normNameAr.includes(normQuery) || strippedNameAr.includes(strippedQuery)) {
    score += 500;
  } else if (normNameEn.includes(rawQuery)) {
    score += 400;
  }

  // 4. Token-level matching in Arabic name
  const nameTokens = getTokens(calc.nameAr);
  const queryTokens = getTokens(query);

  queryTokens.forEach((qToken) => {
    nameTokens.forEach((nToken) => {
      if (nToken === qToken) {
        score += 350;
      } else if (nToken.startsWith(qToken) || qToken.startsWith(nToken)) {
        score += 200;
      }
    });
  });

  // 5. Keywords matching (Arabic + English)
  if (calc.keywords && calc.keywords.length > 0) {
    for (const kw of calc.keywords) {
      const normKw = normalizeArabic(kw);
      const strippedKw = stripArabicDefiniteArticle(normKw);
      const lowerKw = kw.toLowerCase();

      if (normKw === normQuery || strippedKw === strippedQuery || lowerKw === rawQuery) {
        score += 600;
        break;
      } else if (normKw.startsWith(normQuery) || lowerKw.startsWith(rawQuery)) {
        score += 300;
        break;
      } else if (normKw.includes(normQuery) || lowerKw.includes(rawQuery)) {
        score += 180;
      }
    }
  }

  // 6. Description match
  if (normDesc.includes(normQuery) || normDesc.includes(strippedQuery)) {
    score += 120;
  }

  // 7. Category match
  if (normCatAr.includes(normQuery) || normCatAr.includes(strippedQuery)) {
    score += 90;
  }

  // If there is any match, boost with popularity & recency
  if (score > 0) {
    // Usage counts boost
    const usageCount = usageCounts[calc.id] || 0;
    score += Math.min(usageCount * 15, 100);

    // Default popularity weight
    if (calc.defaultPopularity) {
      score += Math.min(calc.defaultPopularity, 50);
    }

    // Recent use boost
    const recentIndex = recentIds.indexOf(calc.id);
    if (recentIndex !== -1) {
      score += Math.max(50 - recentIndex * 10, 10);
    }

    // Favorite boost
    if (favoriteIds.includes(calc.id)) {
      score += 40;
    }
  }

  return score;
}

/**
 * Filter calculators by category
 */
export function filterCalculators(
  calculators: CalculatorItem[],
  category: CategoryId = 'all'
): CalculatorItem[] {
  if (category === 'all') {
    return calculators;
  }
  return calculators.filter((calc) => calc.category === category);
}

/**
 * Sort calculators by given SortType
 */
export function sortCalculators(
  calculators: CalculatorItem[],
  sortType: SortType = 'default',
  recentIds: string[] = [],
  usageCounts: Record<string, number> = {}
): CalculatorItem[] {
  const items = [...calculators];

  switch (sortType) {
    case 'popular':
      return items.sort((a, b) => {
        const usageA = (usageCounts[a.id] || 0) * 10 + (a.defaultPopularity || 0);
        const usageB = (usageCounts[b.id] || 0) * 10 + (b.defaultPopularity || 0);
        return usageB - usageA;
      });

    case 'name':
      return items.sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));

    case 'recent':
      return items.sort((a, b) => {
        const indexA = recentIds.indexOf(a.id);
        const indexB = recentIds.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return (b.defaultPopularity || 0) - (a.defaultPopularity || 0);
      });

    case 'default':
    default:
      return items;
  }
}

/**
 * Search and rank calculators with full fuzzy, keyword, and category support
 */
export function searchCalculators(
  calculators: CalculatorItem[],
  query: string,
  category: CategoryId = 'all',
  sortType: SortType = 'default',
  recentIds: string[] = [],
  favoriteIds: string[] = [],
  usageCounts: Record<string, number> = {}
): CalculatorItem[] {
  // First apply category filter
  let filtered = filterCalculators(calculators, category);

  const trimmedQuery = query.trim();

  // If no query, apply sorting directly
  if (!trimmedQuery) {
    return sortCalculators(filtered, sortType, recentIds, usageCounts);
  }

  // Calculate scores for each calculator
  const scoredItems = filtered
    .map((calc) => ({
      calc,
      score: calculateSearchScore(trimmedQuery, calc, recentIds, favoriteIds, usageCounts),
    }))
    .filter((item) => item.score > 0);

  // Sort strictly by relevance score descending
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.map((item) => item.calc);
}

/**
 * Get rapid search suggestions (name + icon + category) while user types
 */
export function getSearchSuggestions(
  calculators: CalculatorItem[],
  query: string,
  limit = 5
): CalculatorItem[] {
  if (!query || !query.trim()) return [];
  const results = searchCalculators(calculators, query, 'all', 'default');
  return results.slice(0, limit);
}
