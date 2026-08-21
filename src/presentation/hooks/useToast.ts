'use client';

import { useState, useCallback } from 'react';

export interface ToastState {
  show: boolean;
  message: string;
  isError: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    isError: false,
  });

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  return { toast, showToast };
}
