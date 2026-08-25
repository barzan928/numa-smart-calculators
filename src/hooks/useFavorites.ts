import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'numa_favorites';
const LEGACY_KEY = 'numa_favorite_calculators_v1';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      return stored ? JSON.parse(stored) : ['discount', 'percentage', 'installments', 'bmi'];
    } catch {
      return ['discount', 'percentage', 'installments', 'bmi'];
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn('Could not save favorites to localStorage:', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((calculatorId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(calculatorId);
      if (exists) {
        return prev.filter((id) => id !== calculatorId);
      } else {
        return [...prev, calculatorId];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (calculatorId: string) => favoriteIds.includes(calculatorId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
  };
}

