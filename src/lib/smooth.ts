import Lenis from 'lenis'

let lenis: Lenis | null = null
let raf = 0

/** Start Lenis smooth scrolling (skipped for reduced-motion users). */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
  const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)
  // let in-page anchors (#story etc.) glide too
  document.addEventListener('click', onAnchor)
}

function onAnchor(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!a || !lenis) return
  const el = document.querySelector(a.getAttribute('href')!)
  if (!el) return
  e.preventDefault()
  lenis.scrollTo(el as HTMLElement, { duration: 1.4 })
}

export function stopSmoothScroll() {
  cancelAnimationFrame(raf)
  lenis?.destroy()
  lenis = null
  document.removeEventListener('click', onAnchor)
}

/** Pause/resume page scrolling (e.g. while a lightbox is open). */
export function lockScroll(lock: boolean) {
  if (lock) { lenis?.stop(); document.documentElement.style.overflow = 'hidden' }
  else { lenis?.start(); document.documentElement.style.overflow = '' }
}

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate, duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}
