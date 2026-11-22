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

/** Call directly inside a click/tap handler. */
export function playMusic() {
  if (!hasMusic()) return
  el().play().catch(emit)
}
export function pauseMusic() { audio?.pause() }
export function toggleMusic() { if (isPlaying()) pauseMusic(); else playMusic() }

export function onMusicChange(fn: (playing: boolean) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
