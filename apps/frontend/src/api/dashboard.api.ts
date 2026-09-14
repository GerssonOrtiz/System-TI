import { axiosClient } from './axiosClient';

export interface DashboardMetrics {
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  totalOpenTickets: number;
  totalPendingTasks: number;
}

export const dashboardApi = {
  getMetrics: () =>
    axiosClient.get<{ success: true; data: DashboardMetrics }>('/dashboard/metrics'),
};
