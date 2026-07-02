import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listAnomalyHistoryFn,
  getAnomalyTrendFn,
  batchCreateAnomaliesFn,
  type DailyTrend,
} from '@/server/functions/anomaly-history'

export interface AnomalyHistoryFilters {
  category?: string
  source?: string
  limit?: number
  offset?: number
  startDate?: string
  endDate?: string
}

export interface TrendFilters {
  days?: number
  category?: string
}

export function useAnomalyHistory(filters: AnomalyHistoryFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['anomaly-history', filters],
    queryFn: () =>
      listAnomalyHistoryFn({
        data: {
          category: filters.category,
          source: filters.source,
          limit: filters.limit ?? 50,
          offset: filters.offset ?? 0,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  return {
    anomalies: data?.anomalies ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}

export function useAnomalyTrend(filters: TrendFilters = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['anomaly-trend', filters],
    queryFn: () =>
      getAnomalyTrendFn({
        data: {
          days: filters.days ?? 30,
          category: filters.category,
        },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    trends: (data?.trends ?? []) as DailyTrend[],
    summary: data?.summary ?? {
      totalAnomalies: 0,
      avgPerDay: 0,
      peakDay: null,
      peakCount: 0,
      categoryTotals: {},
      periodDays: filters.days ?? 30,
    },
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}

export function useSaveAnomalies() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      anomalies: Array<{
        category: string
        source: string
        title: string
        summary: string | null
        impactScore: number | null
        weeklyGrowth: number | null
        maturityStage: string | null
        sourceUrl: string | null
        detectedAt: string
        anomalyType: string | null
      }>,
    ) => batchCreateAnomaliesFn({ data: { anomalies } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['anomaly-history'] })
      void queryClient.invalidateQueries({ queryKey: ['anomaly-trend'] })
    },
  })
}
