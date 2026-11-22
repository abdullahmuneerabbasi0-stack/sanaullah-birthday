import { startSurprise, stopSurprise } from './music'

/** Opens the surprise as its own page (URL becomes …/surprise.html) without reloading,
 *  so the sound can start by itself. Back button / back link returns to the site. */
const listeners = new Set<(open: boolean) => void>()
let isOpen = false
const set = (v: boolean) => { isOpen = v; listeners.forEach((l) => l(v)) }

export function openSurprise() {
  startSurprise() // must run inside the tap
  history.pushState({ surprise: true }, '', `${import.meta.env.BASE_URL}surprise.html`)
  set(true)
}

export function closeSurprise() {
  if (history.state?.surprise) history.back() // popstate below does the rest
  else { stopSurprise(); set(false) }
}

window.addEventListener('popstate', () => {
  if (isOpen && !history.state?.surprise) { stopSurprise(); set(false) }
  else if (!isOpen && history.state?.surprise) { history.back() } // forward into a stale surprise: bounce
})

export function onSurpriseChange(fn: (open: boolean) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
