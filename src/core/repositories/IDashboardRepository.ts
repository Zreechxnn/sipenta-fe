import { DashboardSummary } from '../domain/dashboard';

export interface IDashboardRepository {
  getSummary(): Promise<DashboardSummary>;
}
