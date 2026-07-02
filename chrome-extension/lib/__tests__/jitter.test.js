import { describe, it, expect } from 'vitest'
import { seededJitter } from '../jitter.js'

describe('seededJitter', () => {
  it('is deterministic for the same id+index', () => {
    expect(seededJitter('gh-42', 3)).toBe(seededJitter('gh-42', 3))
  })
  it('differs across ids', () => {
    expect(seededJitter('gh-1', 0)).not.toBe(seededJitter('gh-2', 0))
  })
  it('stays within [-0.5, 0.5]', () => {
    for (let i = 0; i < 50; i++) {
      const v = seededJitter('id-' + i, i)
      expect(v).toBeGreaterThanOrEqual(-0.5)
      expect(v).toBeLessThanOrEqual(0.5)
    }
  })
})
