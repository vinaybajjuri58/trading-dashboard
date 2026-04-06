import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../client';
import type { BacktestSummary } from '../../types/api';

export function useSummary() {
  return useQuery<BacktestSummary, Error>({
    queryKey: ['summary'],
    queryFn: () => apiFetch<BacktestSummary>('/api/backtests/summary'),
    staleTime: 5 * 60_000,
  });
}
