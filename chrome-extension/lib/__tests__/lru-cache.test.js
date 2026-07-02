import { describe, it, expect } from 'vitest'
import { BoundedCache } from '../lru-cache.js'

describe('BoundedCache', () => {
  it('evicts oldest beyond maxEntries', () => {
    const c = new BoundedCache(2, 60000)
    c.set('a', 1)
    c.set('b', 2)
    c.set('c', 3)
    expect(c.get('a')).toBeUndefined()
    expect(c.get('c')).toBe(3)
    expect(c.size).toBe(2)
  })
  it('expires entries past ttl', () => {
    let now = 1000
    const c = new BoundedCache(10, 500, () => now)
    c.set('x', 42)
    now = 1400
    expect(c.get('x')).toBe(42)
    now = 1600
    expect(c.get('x')).toBeUndefined()
  })
})
