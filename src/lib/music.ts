import { asset, content } from '../data/content'

/**
 * One shared audio player for the playlist. It lives outside React so the
 * "Tap to open your gift" click can start it synchronously (mobile browsers
 * only allow audio that starts inside a real tap).
 */
const tracks = content.music
let audio: HTMLAudioElement | null = null
let index = 0
const listeners = new Set<(playing: boolean) => void>()

function emit() { const p = isPlaying(); listeners.forEach((l) => l(p)) }

function el() {
  if (audio) return audio
  audio = new Audio()
  audio.preload = 'auto'
  audio.loop = tracks.length === 1
  audio.src = asset(tracks[0])
  audio.addEventListener('play', emit)
  audio.addEventListener('pause', emit)
  audio.addEventListener('ended', () => {
    index = (index + 1) % tracks.length
    audio!.src = asset(tracks[index])
    audio!.play().catch(emit)
  })
  return audio
}

export const hasMusic = () => tracks.length > 0
export const isPlaying = () => !!audio && !audio.paused

let userPaused = false
let retryArmed = false

/** If the browser refused to start (e.g. strict autoplay rules), try again on the next tap anywhere. */
function armRetry() {
  if (retryArmed) return
  retryArmed = true
  const retry = () => {
    window.removeEventListener('pointerdown', retry, true)
    window.removeEventListener('touchend', retry, true)
    window.removeEventListener('keydown', retry, true)
    retryArmed = false
    if (!userPaused && !isPlaying()) el().play().catch(armRetry)
  }
  window.addEventListener('pointerdown', retry, true)
  window.addEventListener('touchend', retry, true)
  window.addEventListener('keydown', retry, true)
}

/** Create the player and start buffering the first track early (no sound). */
export function primeMusic() { if (hasMusic()) el().load() }

/** Call directly inside a click/tap handler. */
export function playMusic() {
  if (!hasMusic()) return
  userPaused = false
  const p = el().play()
  p?.catch(() => { emit(); armRetry() })
}
export function pauseMusic() { userPaused = true; audio?.pause() }
export function toggleMusic() { if (isPlaying()) pauseMusic(); else playMusic() }
export const musicError = () => audio?.error?.code ?? null

export function onMusicChange(fn: (playing: boolean) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
