import { describe, it, expect } from 'vitest'
import { calculateMaturity, calculateImpact } from '../scoring.js'

describe('calculateMaturity', () => {
  it('maps popularity to a maturity stage deterministically', () => {
    expect(calculateMaturity(50)).toBe('research')
    expect(calculateMaturity(500)).toBe('prototype')
    expect(calculateMaturity(5000)).toBe('early-adopter')
    expect(calculateMaturity(50000)).toBe('mass-market')
  })
})

describe('calculateImpact', () => {
  it('is monotonic and bounded 1..10', () => {
    expect(calculateImpact(0)).toBe(1)
    expect(calculateImpact(60000, 0)).toBe(10)
    expect(calculateImpact(1500)).toBeGreaterThanOrEqual(calculateImpact(600))
  })
  it('has no randomness (stable across calls)', () => {
    expect(calculateImpact(3000, 100)).toBe(calculateImpact(3000, 100))
  })
})
