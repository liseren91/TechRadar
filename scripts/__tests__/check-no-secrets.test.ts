import { describe, it, expect } from 'vitest'
import { scanForSecrets } from '../check-no-secrets'

describe('scanForSecrets', () => {
  it('flags anthropic-style keys', () => {
    expect(scanForSecrets('x sk-ant-api03-ABCdef123 y').length).toBeGreaterThan(
      0,
    )
  })
  it('passes clean content', () => {
    expect(scanForSecrets('{"headline":"Why it matters"}')).toEqual([])
  })
})
