import { useState, useCallback } from 'react';
import { DashboardSummary } from '@/core/domain/dashboard';
import { dashboardRepository } from '@/infrastructure/repositories/DashboardRepository';
import { useToast } from './useToast';

export function useDashboard(onShowToast?: (msg: string, isError?: boolean) => void) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast, showToast } = useToast();

  const handleShowToast = onShowToast || showToast;

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardRepository.getSummary();
      setSummary(data);
    } catch (err: any) {
      handleShowToast(err.message || 'Gagal memuat dashboard', true);
    } finally {
      setLoading(false);
    }
  }, [handleShowToast]);

  return {
    summary,
    loading,
    fetchSummary,
    toast,
  };
}
