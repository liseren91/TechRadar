import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { fetchAllPosts } from './sources'
import { summarizePost, DigestItemSchema, type DigestItem } from './summarize'
import { computeTrends, type SignalSnapshot } from './momentum'
import { TOPIC_LABELS, snapshotFromTexts } from './topics'

const DATA_DIR = 'public/data'
const DIGEST_MAX = 10

function stableId(url: string): string {
  let h = 2166136261
  for (let i = 0; i < url.length; i++) { h ^= url.charCodeAt(i); h = Math.imul(h, 16777619) }
  return 'd-' + (h >>> 0).toString(36)
}

function todayIso(): string {
  // Cron passes the date; fall back to now. Use date-only for snapshot bucketing.
  return new Date().toISOString().slice(0, 10)
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is required (set as a GitHub Actions secret)')
  mkdirSync(DATA_DIR, { recursive: true })

  const posts = await fetchAllPosts()
  posts.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  const freshest = posts.slice(0, DIGEST_MAX)

  const anthropic = new Anthropic({ apiKey })
  const client = { create: (args: any) => anthropic.messages.create(args) }

  // 1) News digest
  const items: DigestItem[] = []
  for (const p of freshest) {
    try {
      const s = await summarizePost(p, client)
      const item = DigestItemSchema.parse({
        id: stableId(p.url), source: p.source, sourceUrl: p.url,
        publishedAt: p.publishedAt, category: s.category, en: s.en, ru: s.ru,
      })
      items.push(item)
    } catch (e) {
      console.warn(`[digest] skip ${p.url}:`, (e as Error).message)
    }
  }
  writeFileSync(`${DATA_DIR}/digest.json`, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2))

  // 2) Trend snapshot + history (append today)
  const historyPath = `${DATA_DIR}/history.json`
  const history: SignalSnapshot[] = existsSync(historyPath)
    ? JSON.parse(readFileSync(historyPath, 'utf8'))
    : []
  const snapTexts = posts.map((p) => `${p.title} ${p.contentText}`)
  const today = todayIso()
  const filtered = history.filter((s) => s.date !== today) // idempotent per day
  filtered.push(snapshotFromTexts(snapTexts, today))
  const trimmed = filtered.slice(-120) // keep ~4 months
  writeFileSync(historyPath, JSON.stringify(trimmed, null, 2))

  const labels = Object.fromEntries(
    Object.entries(TOPIC_LABELS).map(([id, d]) => [id, { label: d.label, category: d.category, stage: d.stage }]),
  )
  const topics = computeTrends(trimmed, labels)
  writeFileSync(`${DATA_DIR}/trends.json`, JSON.stringify({ generatedAt: new Date().toISOString(), window: 'rolling-120d', topics }, null, 2))

  console.log(`[generate-feed] digest items: ${items.length}, topics: ${topics.length}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
