import { XMLParser } from 'fast-xml-parser'

export type RawPost = {
  source: string
  title: string
  url: string
  publishedAt: string
  contentText: string
}

export const SOURCES = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    feedUrl: 'https://www.anthropic.com/rss.xml',
  },
  { id: 'openai', name: 'OpenAI', feedUrl: 'https://openai.com/blog/rss.xml' },
  {
    id: 'latent-space',
    name: 'Latent Space',
    feedUrl: 'https://www.latent.space/feed',
  },
  {
    id: 'deepmind',
    name: 'Google DeepMind',
    feedUrl: 'https://deepmind.google/blog/rss.xml',
  },
  {
    id: 'simonw',
    name: 'Simon Willison',
    feedUrl: 'https://simonwillison.net/atom/everything/',
  },
  {
    id: 'hf',
    name: 'Hugging Face',
    feedUrl: 'https://huggingface.co/blog/feed.xml',
  },
  { id: 'meta', name: 'Meta AI', feedUrl: 'https://ai.meta.com/blog/rss/' },
  {
    id: 'mistral',
    name: 'Mistral',
    feedUrl: 'https://mistral.ai/news/rss.xml',
  },
]

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

function stripHtml(s: string): string {
  return String(s ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return []
  return Array.isArray(v) ? v : [v]
}

export function parseFeed(xml: string, sourceId: string): RawPost[] {
  const doc = parser.parse(xml)
  const out: RawPost[] = []

  // RSS: rss.channel.item[]
  const items = asArray(doc?.rss?.channel?.item)
  for (const it of items) {
    out.push({
      source: sourceId,
      title: stripHtml(it.title),
      url: typeof it.link === 'string' ? it.link : (it.link?.['#text'] ?? ''),
      publishedAt: new Date(
        it.pubDate ?? it['dc:date'] ?? Date.now(),
      ).toISOString(),
      contentText: stripHtml(it['content:encoded'] ?? it.description ?? ''),
    })
  }

  // Atom: feed.entry[]
  const entries = asArray(doc?.feed?.entry)
  for (const e of entries) {
    const link =
      asArray(e.link).find(
        (l: any) => !l['@_rel'] || l['@_rel'] === 'alternate',
      ) ?? asArray(e.link)[0]
    out.push({
      source: sourceId,
      title: stripHtml(
        typeof e.title === 'string' ? e.title : e.title?.['#text'],
      ),
      url: link?.['@_href'] ?? '',
      publishedAt: new Date(
        e.updated ?? e.published ?? Date.now(),
      ).toISOString(),
      contentText: stripHtml(
        e.summary?.['#text'] ??
          e.summary ??
          e.content?.['#text'] ??
          e.content ??
          '',
      ),
    })
  }

  return out.filter((p) => p.title && p.url)
}

export async function fetchAllPosts(
  fetchImpl: typeof fetch = fetch,
): Promise<RawPost[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (s) => {
      const res = await fetchImpl(s.feedUrl, {
        headers: { 'User-Agent': 'TechRadar/1.1' },
      })
      if (!res.ok) throw new Error(`${s.id}: ${res.status}`)
      return parseFeed(await res.text(), s.id)
    }),
  )
  const posts: RawPost[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') posts.push(...r.value)
    else
      console.warn(
        `[sources] ${SOURCES[i].id} failed:`,
        r.reason?.message ?? r.reason,
      )
  })
  return posts
}
