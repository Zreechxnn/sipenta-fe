import { IDashboardRepository } from '@/core/repositories/IDashboardRepository';
import { DashboardSummary } from '@/core/domain/dashboard';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class DashboardRepository implements IDashboardRepository {
  async getSummary(): Promise<DashboardSummary> {
    const res = await authFetch(`${API_ENDPOINTS.DASHBOARD}/summary`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data dashboard');
    }

    const data = await res.json();
    return data.data; // Since ApiResponse<T> wraps in { data, isSuccess, message }
  }
}

export const dashboardRepository = new DashboardRepository();
