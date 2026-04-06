import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../client';
import type { Strategy } from '../../types/api';

export function useStrategy(id: string | undefined) {
  return useQuery<Strategy, Error>({
    queryKey: ['strategy', id],
    queryFn: () => {
      if (!id) throw new Error('Strategy id is required');
      return apiFetch<Strategy>(`/api/strategies/${id}`);
    },
    enabled: !!id,
    staleTime: 5 * 60_000,
  });
}
