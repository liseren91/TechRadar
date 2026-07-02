// Deterministic hash → value in [-0.5, 0.5], stable across renders.
export function seededJitter(id, index) {
  const str = `${id}:${index}`
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const unit = ((h >>> 0) % 100000) / 100000 // [0,1)
  return unit - 0.5
}
