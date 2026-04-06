import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiFetch } from '../client';
import type { Strategy, StrategyFilters } from '../../types/api';

export function useStrategies(filters: StrategyFilters) {
  const params = new URLSearchParams();
  (Object.entries(filters) as [string, string][]).forEach(([k, v]) => {
    if (v !== '') params.set(k, v);
  });
  const qs = params.toString();

  return useQuery<Strategy[], Error>({
    queryKey: ['strategies', filters],
    queryFn: () => apiFetch<Strategy[]>(`/api/strategies${qs ? `?${qs}` : ''}`),
    placeholderData: keepPreviousData,
  });
}
