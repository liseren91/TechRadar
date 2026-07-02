import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { Query } from 'node-appwrite'
import { db } from '@/server/lib/db'
import { authMiddleware } from './auth'
import type { AnomalyHistory } from '@/server/lib/appwrite.types'

// Schema for creating anomaly history entry
const createAnomalySchema = z.object({
  category: z.string(),
  source: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  impactScore: z.number().nullable(),
  weeklyGrowth: z.number().nullable(),
  maturityStage: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  detectedAt: z.string(),
  anomalyType: z.string().nullable(),
})

// Schema for batch creating anomalies
const batchCreateAnomaliesSchema = z.object({
  anomalies: z.array(createAnomalySchema),
})

// Create a single anomaly history entry
export const createAnomalyHistoryFn = createServerFn({ method: 'POST' })
  .inputValidator(createAnomalySchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()

    // Use anonymous if not authenticated
    const userId = currentUser?.$id ?? 'anonymous'

    const anomaly = await db.anomalyHistory.create({
      createdBy: userId,
      category: data.category,
      source: data.source,
      title: data.title,
      summary: data.summary,
      impactScore: data.impactScore,
      weeklyGrowth: data.weeklyGrowth,
      maturityStage: data.maturityStage,
      sourceUrl: data.sourceUrl,
      detectedAt: data.detectedAt,
      anomalyType: data.anomalyType,
    })

    return { anomaly }
  })

// Batch create anomaly history entries
export const batchCreateAnomaliesFn = createServerFn({ method: 'POST' })
  .inputValidator(batchCreateAnomaliesSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    const userId = currentUser?.$id ?? 'anonymous'

    const results = await Promise.all(
      data.anomalies.map((anomaly) =>
        db.anomalyHistory.create({
          createdBy: userId,
          category: anomaly.category,
          source: anomaly.source,
          title: anomaly.title,
          summary: anomaly.summary,
          impactScore: anomaly.impactScore,
          weeklyGrowth: anomaly.weeklyGrowth,
          maturityStage: anomaly.maturityStage,
          sourceUrl: anomaly.sourceUrl,
          detectedAt: anomaly.detectedAt,
          anomalyType: anomaly.anomalyType,
        }),
      ),
    )

    return { count: results.length }
  })

// List anomaly history with optional filters
const listAnomaliesSchema = z
  .object({
    category: z.string().optional(),
    source: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .optional()

export const listAnomalyHistoryFn = createServerFn({ method: 'GET' })
  .inputValidator(listAnomaliesSchema)
  .handler(async ({ data }) => {
    const filters = {
      limit: 50,
      offset: 0,
      ...data,
    }
    const queries: string[] = [
      Query.orderDesc('detectedAt'),
      Query.limit(filters.limit),
      Query.offset(filters.offset),
    ]

    if (filters.category) {
      queries.push(Query.equal('category', [filters.category]))
    }

    if (filters.source) {
      queries.push(Query.equal('source', [filters.source]))
    }

    if (filters.startDate) {
      queries.push(Query.greaterThanEqual('detectedAt', filters.startDate))
    }

    if (filters.endDate) {
      queries.push(Query.lessThanEqual('detectedAt', filters.endDate))
    }

    const result = await db.anomalyHistory.list(queries)

    return {
      anomalies: result.rows,
      total: result.total,
    }
  })

// Get anomaly trend data (aggregated by day)
const getTrendSchema = z
  .object({
    days: z.number().min(1).max(90).default(30),
    category: z.string().optional(),
  })
  .optional()

export interface DailyTrend {
  date: string
  count: number
  avgImpact: number
  categories: Record<string, number>
  topAnomaly: {
    title: string
    category: string
    impactScore: number
  } | null
}

export const getAnomalyTrendFn = createServerFn({ method: 'GET' })
  .inputValidator(getTrendSchema)
  .handler(async ({ data }) => {
    const filters = {
      days: 30,
      ...data,
    }
    const days = filters.days

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const queries: string[] = [
      Query.greaterThanEqual('detectedAt', startDate.toISOString()),
      Query.lessThanEqual('detectedAt', endDate.toISOString()),
      Query.orderDesc('detectedAt'),
      Query.limit(500), // Get up to 500 anomalies for trend calculation
    ]

    if (filters.category) {
      queries.push(Query.equal('category', [filters.category]))
    }

    const result = await db.anomalyHistory.list(queries)

    // Aggregate by day
    const dailyData: Record<string, AnomalyHistory[]> = {}

    result.rows.forEach((anomaly) => {
      const date = anomaly.detectedAt.split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = []
      }
      dailyData[date].push(anomaly)
    })

    // Generate trend data for each day in range
    const trends: DailyTrend[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayAnomalies = dailyData[dateStr] || []

      // Calculate category distribution
      const categories: Record<string, number> = {}
      dayAnomalies.forEach((a) => {
        categories[a.category] = (categories[a.category] || 0) + 1
      })

      // Calculate average impact
      const avgImpact =
        dayAnomalies.length > 0
          ? dayAnomalies.reduce((sum, a) => sum + (a.impactScore || 0), 0) /
            dayAnomalies.length
          : 0

      // Find top anomaly by impact
      const topAnomaly =
        dayAnomalies.length > 0
          ? dayAnomalies.reduce((top, current) =>
              (current.impactScore || 0) > (top.impactScore || 0)
                ? current
                : top,
            )
          : null

      trends.push({
        date: dateStr,
        count: dayAnomalies.length,
        avgImpact: Math.round(avgImpact * 10) / 10,
        categories,
        topAnomaly: topAnomaly
          ? {
              title: topAnomaly.title,
              category: topAnomaly.category,
              impactScore: topAnomaly.impactScore || 0,
            }
          : null,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate summary stats
    const totalAnomalies = result.rows.length
    const avgPerDay = totalAnomalies / days
    const categoryTotals: Record<string, number> = {}
    result.rows.forEach((a) => {
      categoryTotals[a.category] = (categoryTotals[a.category] || 0) + 1
    })

    // Find peak day
    const peakDay = trends.reduce(
      (peak, day) => (day.count > peak.count ? day : peak),
      trends[0] || { date: '', count: 0 },
    )

    return {
      trends,
      summary: {
        totalAnomalies,
        avgPerDay: Math.round(avgPerDay * 10) / 10,
        peakDay: peakDay?.date || null,
        peakCount: peakDay?.count || 0,
        categoryTotals,
        periodDays: days,
      },
    }
  })

// Delete old anomaly history (cleanup)
const cleanupSchema = z.object({
  olderThanDays: z.number().min(30).max(365).default(90),
})

export const cleanupAnomalyHistoryFn = createServerFn({ method: 'POST' })
  .inputValidator(cleanupSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - data.olderThanDays)

    const queries = [
      Query.lessThan('detectedAt', cutoffDate.toISOString()),
      Query.equal('createdBy', [currentUser.$id]),
      Query.limit(100),
    ]

    const result = await db.anomalyHistory.list(queries)

    // Delete in batches
    let deletedCount = 0
    for (const anomaly of result.rows) {
      await db.anomalyHistory.delete(anomaly.$id)
      deletedCount++
    }

    return { deletedCount }
  })
