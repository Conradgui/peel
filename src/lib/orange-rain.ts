// Orange rain animation — jittered grid algorithm.
// Ported from docs/mockups/app.html JS.

export interface Raindrop {
  id: string
  type: 'blossom' | 'orange'
  leftPct: number
  delayMs: number
  durationMs: number
  rotateEnd: number
  scale: number
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateRain(): Raindrop[] {
  const total = 20  // 14 blossoms + 6 oranges (≥6 for brand recognition)
  const blossomCount = 14
  const orangeCount = 6

  // Jittered grid: horizontal positions — guarantees even spread
  const slotWidth = 96 / total
  const positions = shuffle(
    Array.from({ length: total }, (_, i) =>
      2 + i * slotWidth + Math.random() * slotWidth * 0.7,
    ),
  )

  // Jittered grid: time delays — staggered, no simultaneous burst
  const timeSlot = 2500 / total
  const delays = Array.from({ length: total }, (_, i) =>
    i * timeSlot + Math.random() * timeSlot * 0.6,
  )

  // Mix blossoms & oranges so oranges aren't clumped
  const types: ('blossom' | 'orange')[] = shuffle([
    ...Array<'blossom'>(blossomCount).fill('blossom'),
    ...Array<'orange'>(orangeCount).fill('orange'),
  ])

  return types.map((type, i) => ({
    id: `${Date.now()}-${i}`,
    type,
    leftPct: positions[i],
    delayMs: delays[i],
    durationMs: 4000 + Math.random() * 1800,
    rotateEnd: Math.random() * 360 - 180,
    scale: 0.85 + Math.random() * 0.30,
  }))
}
