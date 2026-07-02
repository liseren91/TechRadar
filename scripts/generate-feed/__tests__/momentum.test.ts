import { describe, it, expect } from 'vitest'
import { computeTrends } from '../momentum'

const labels = {
  'llm-agents': { label: 'LLM Agents', category: 'ai', stage: 'prototype' },
}

describe('computeTrends', () => {
  it('marks a topic rising when recent week exceeds prior week', () => {
    const history = [
      { date: '2026-06-01', topics: { 'llm-agents': 1 } },
      { date: '2026-06-08', topics: { 'llm-agents': 1 } },
      { date: '2026-06-15', topics: { 'llm-agents': 5 } },
      { date: '2026-06-22', topics: { 'llm-agents': 6 } },
    ]
    const [t] = computeTrends(history, labels)
    expect(t.id).toBe('llm-agents')
    expect(t.trajectory).toBe('rising')
    expect(t.momentum).toBeGreaterThan(0)
    expect(t.weeklyCounts.length).toBeGreaterThan(0)
  })
  it('marks stable when counts are flat', () => {
    const history = [
      { date: '2026-06-01', topics: { 'llm-agents': 3 } },
      { date: '2026-06-08', topics: { 'llm-agents': 3 } },
    ]
    const [t] = computeTrends(history, labels)
    expect(t.trajectory).toBe('stable')
  })
})
