import { describe, it, expect } from 'vitest'
import { pickDigestText, SOURCE_META } from '../digest.js'

const item = {
  source: 'anthropic',
  en: { headline: 'Why it matters: x', tweets: ['a','b','c'] },
  ru: { headline: 'Почему важно: x', tweets: ['а','б','в'] },
}

describe('pickDigestText', () => {
  it('returns the requested language block', () => {
    expect(pickDigestText(item, 'ru').headline).toContain('Почему')
    expect(pickDigestText(item, 'en').tweets).toEqual(['a','b','c'])
  })
  it('falls back to en when lang missing', () => {
    expect(pickDigestText({ source:'x', en:item.en }, 'ru').tweets).toEqual(['a','b','c'])
  })
})
describe('SOURCE_META', () => {
  it('has an entry for each known source', () => {
    expect(SOURCE_META.anthropic.label).toBeTruthy()
  })
})
