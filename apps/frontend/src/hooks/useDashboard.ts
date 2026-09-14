import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard.api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const res = await dashboardApi.getMetrics();
      return res.data.data;
    },
    refetchInterval: 30000, // Actualizar cada 30s
  });
}
