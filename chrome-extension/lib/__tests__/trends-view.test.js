import { describe, it, expect } from 'vitest'
import { nextStage, trajectoryMeta, sparkline } from '../trends-view.js'

describe('nextStage', () => {
  it('advances maturity and caps at mass-market', () => {
    expect(nextStage('research')).toBe('prototype')
    expect(nextStage('early-adopter')).toBe('mass-market')
    expect(nextStage('mass-market')).toBe('mass-market')
  })
})
describe('trajectoryMeta', () => {
  it('maps trajectory to icon direction', () => {
    expect(trajectoryMeta('rising').icon).toBe('up')
    expect(trajectoryMeta('cooling').icon).toBe('down')
    expect(trajectoryMeta('stable').icon).toBe('flat')
  })
})
describe('sparkline', () => {
  it('renders one glyph per week', () => {
    expect(sparkline([0, 2, 4]).length).toBe(3)
  })
})
