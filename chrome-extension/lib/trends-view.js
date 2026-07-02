const ORDER = ['research', 'prototype', 'early-adopter', 'mass-market']

export function nextStage(stage) {
  const i = ORDER.indexOf(stage)
  if (i < 0) return ORDER[0]
  return ORDER[Math.min(i + 1, ORDER.length - 1)]
}

export function trajectoryMeta(trajectory) {
  if (trajectory === 'rising') return { icon: 'up', color: '#22c55e' }
  if (trajectory === 'cooling') return { icon: 'down', color: '#ef4444' }
  return { icon: 'flat', color: 'rgba(255,255,255,0.4)' }
}

const BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
export function sparkline(weeklyCounts) {
  if (!weeklyCounts || weeklyCounts.length === 0) return ''
  const max = Math.max(1, ...weeklyCounts)
  return weeklyCounts.map((c) => BLOCKS[Math.round((c / max) * (BLOCKS.length - 1))]).join('')
}
