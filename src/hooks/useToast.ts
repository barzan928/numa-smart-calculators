import { useState, useCallback } from 'react';
import { ToastMessage } from '../components/common/Toast';

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (text: string, type: 'success' | 'error' | 'info' = 'success', duration = 2500) => {
      setToast({
        id: 'toast_' + Date.now(),
        text,
        type,
        duration,
      });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    closeToast,
  };
}
