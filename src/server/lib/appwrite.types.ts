import { type Models } from 'node-appwrite'

export type AnomalyHistory = Models.Row & {
  createdBy: string
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
}
