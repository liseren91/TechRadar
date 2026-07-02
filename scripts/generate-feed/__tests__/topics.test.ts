import { describe, it, expect } from 'vitest'
import { tagTopics, snapshotFromTexts } from '../topics'

describe('tagTopics', () => {
  it('tags known topics', () => {
    expect(tagTopics('a new LLM agent framework')).toContain('llm-agents')
    expect(tagTopics('post-quantum cryptography')).toContain('post-quantum')
  })
  it('returns [] when nothing matches', () => {
    expect(tagTopics('an unrelated cooking blog')).toEqual([])
  })
  it('does not tag on substring-only matches (word boundaries)', () => {
    expect(tagTopics('We upgraded our storage backend')).not.toContain('rag')
    expect(tagTopics('The dragon flew over')).not.toContain('rag')
  })
  it('still tags real RAG mentions', () => {
    expect(tagTopics('a new RAG pipeline')).toContain('rag')
    expect(tagTopics('retrieval augmented generation')).toContain('rag')
  })
})

describe('snapshotFromTexts', () => {
  it('counts topic occurrences per day', () => {
    const snap = snapshotFromTexts(
      ['llm agent', 'llm agent tools'],
      '2026-06-15',
    )
    expect(snap.date).toBe('2026-06-15')
    expect(snap.topics['llm-agents']).toBe(2)
  })
})
