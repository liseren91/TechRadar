import { describe, it, expect } from 'vitest'
import { categorizeByKeywords } from '../categorize.js'

describe('categorizeByKeywords', () => {
  it('detects known categories', () => {
    expect(categorizeByKeywords('New quantum qubit breakthrough')).toBe(
      'quantum',
    )
    expect(categorizeByKeywords('CRISPR gene therapy trial')).toBe('biotech')
    expect(categorizeByKeywords('SpaceX starship launch')).toBe('space')
  })
  it('defaults to ai on no match', () => {
    expect(categorizeByKeywords('random unrelated text')).toBe('ai')
    expect(categorizeByKeywords('')).toBe('ai')
  })
})
