import confetti from 'canvas-confetti'

const colors = ['#C9A24B', '#E7CD8A', '#4A1D3F', '#7A3F6A', '#F2C9C4', '#FFFBF3']

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function burst() {
  if (prefersReducedMotion()) {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors, disableForReducedMotion: false, ticks: 120 })
    return
  }
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({ origin: { y: 0.7 }, colors, ...opts, particleCount: Math.floor(220 * ratio) })
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
  // side cannons
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors })
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors })
  }, 350)
}

export function sprinkle() {
  confetti({ particleCount: 40, spread: 70, startVelocity: 30, origin: { y: 0.6 }, colors, scalar: 0.8 })
}
