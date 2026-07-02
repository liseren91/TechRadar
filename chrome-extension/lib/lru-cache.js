export class BoundedCache {
  constructor(maxEntries, ttlMs, now = () => Date.now()) {
    this.max = maxEntries
    this.ttl = ttlMs
    this.now = now
    this.map = new Map() // key -> { value, at }
  }
  get(key) {
    const e = this.map.get(key)
    if (!e) return undefined
    if (this.now() - e.at > this.ttl) {
      this.map.delete(key)
      return undefined
    }
    // refresh recency
    this.map.delete(key)
    this.map.set(key, e)
    return e.value
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, { value, at: this.now() })
    while (this.map.size > this.max) {
      const oldest = this.map.keys().next().value
      this.map.delete(oldest)
    }
  }
  get size() {
    return this.map.size
  }
}
