import { z } from 'zod'
import type { RawPost } from './sources'

const TweetTriple = z.tuple([
  z.string().min(1),
  z.string().min(1),
  z.string().min(1),
])
const LangBlockSchema = z.object({
  headline: z.string().min(1),
  tweets: TweetTriple,
})

export const DigestItemSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceUrl: z.string(),
  publishedAt: z.string(),
  category: z.string(),
  en: LangBlockSchema,
  ru: LangBlockSchema,
})
export type DigestItem = z.infer<typeof DigestItemSchema>

const ModelResponseSchema = z.object({
  category: z.enum([
    'ai',
    'quantum',
    'robotics',
    'web3',
    'cybersecurity',
    'biotech',
    'energy',
    'space',
  ]),
  en: LangBlockSchema,
  ru: LangBlockSchema,
})
export type LangBlock = z.infer<typeof LangBlockSchema>

export const DIGEST_SYSTEM_PROMPT = `You turn a technical engineering-blog post into a scannable digest for a busy engineer.
Output STRICT JSON only, matching:
{ "category": one of ["ai","quantum","robotics","web3","cybersecurity","biotech","energy","space"],
  "en": { "headline": string, "tweets": [string, string, string] },
  "ru": { "headline": string, "tweets": [string, string, string] } }
Rules:
- "headline" starts with "Why it matters: " (en) / "Почему важно: " (ru); one sentence, concrete, no hype.
- "tweets" are exactly 3 punchy standalone takeaways (<= 160 chars each), the core substance of the post.
- Plain human language, no marketing. RU must be natural Russian, not a literal machine translation.
- No markdown, no backticks, JSON only.`

export async function summarizePost(
  post: RawPost,
  client: { create: (args: any) => Promise<any> },
): Promise<{ en: LangBlock; ru: LangBlock; category: string }> {
  const user = `SOURCE: ${post.source}\nTITLE: ${post.title}\nURL: ${post.url}\n\nCONTENT:\n${post.contentText.slice(0, 6000)}`
  const resp = await client.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: DIGEST_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: user }],
  })
  const text = (resp.content ?? [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
  const json = JSON.parse(text)
  const parsed = ModelResponseSchema.parse(json)
  return { en: parsed.en, ru: parsed.ru, category: parsed.category }
}
