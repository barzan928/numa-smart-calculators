import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../calculators/types';

const HISTORY_STORAGE_KEY = 'numa_history';
const LEGACY_KEY = 'numa_calculation_history_v1';
const MAX_HISTORY_ITEMS = 60;

export function useHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (e) {
      console.warn('Could not save calculation history to localStorage:', e);
    }
  }, [historyItems]);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistoryItems((prev) => {
      const uniqueId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const newItem: HistoryItem = {
        ...item,
        id: uniqueId,
        timestamp: Date.now(),
      };

      // Check if identical to most recent entry within 3 seconds to prevent duplicate spam
      if (prev.length > 0) {
        const latest = prev[0];
        const isVeryRecent = Date.now() - latest.timestamp < 3000;
        if (
          isVeryRecent &&
          latest.calculatorId === newItem.calculatorId &&
          latest.primaryResult === newItem.primaryResult &&
          JSON.stringify(latest.inputs) === JSON.stringify(newItem.inputs)
        ) {
          return prev;
        }
      }

      return [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  return {
    historyItems,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
  };
}

