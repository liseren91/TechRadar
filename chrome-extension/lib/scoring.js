export function calculateMaturity(popularity) {
  if (popularity > 10000) return 'mass-market'
  if (popularity > 1000) return 'early-adopter'
  if (popularity > 100) return 'prototype'
  return 'research'
}

export function calculateImpact(primary, secondary = 0) {
  const combined = primary + secondary * 2
  if (combined > 50000) return 10
  if (combined > 20000) return 9
  if (combined > 10000) return 8
  if (combined > 5000) return 7
  if (combined > 2000) return 6
  if (combined > 1000) return 5
  if (combined > 500) return 4
  if (combined > 100) return 3
  if (combined > 50) return 2
  return 1
}
