import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../client';
import type { ForwardTest, Trade, DailyPnl } from '../../types/api';

export function useForwardTests() {
  return useQuery<ForwardTest[], Error>({
    queryKey: ['forward-tests'],
    queryFn: () => apiFetch<ForwardTest[]>('/api/forward-tests'),
    refetchInterval: 30_000,
  });
}

export function useForwardTestTrades(id: string | number | null) {
  return useQuery<Trade[], Error>({
    queryKey: ['forward-test-trades', id],
    queryFn: () => {
      if (!id) throw new Error('Forward test id is required');
      return apiFetch<Trade[]>(`/api/forward-tests/${id}/trades`);
    },
    enabled: !!id,
  });
}

export function useForwardTestPnl(id: string | number | null) {
  return useQuery<DailyPnl[], Error>({
    queryKey: ['forward-test-pnl', id],
    queryFn: () => {
      if (!id) throw new Error('Forward test id is required');
      return apiFetch<DailyPnl[]>(`/api/forward-tests/${id}/pnl`);
    },
    enabled: !!id,
  });
}
