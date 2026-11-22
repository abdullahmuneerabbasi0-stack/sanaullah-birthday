import { asset, content } from '../data/content'

/**
 * One shared audio player for the playlist. It lives outside React so the
 * "Tap to open your gift" click can start it synchronously (mobile browsers
 * only allow audio that starts inside a real tap).
 *
 * Playlist rule: every track plays once in order, and the LAST track repeats forever.
 */
const tracks = content.music
const last = tracks.length - 1
/** Silence between the gift tap and the first note, in ms. */
const START_DELAY = 3000

let audio: HTMLAudioElement | null = null
let index = 0
let userPaused = false
let retryArmed = false
let startTimer = 0
let mode: 'playlist' | 'surprise' = 'playlist'
let saved = { index: 0, time: 0, playing: false }
let gapTimer = 0
/** Surprise sound: starts this long after the surprise opens, then repeats with GAP between plays. */
const SURPRISE_SRC = 'music/surprise.mp3'
const SURPRISE_DELAY = 2000
const SURPRISE_GAP = 1500
const listeners = new Set<(playing: boolean) => void>()

function emit() { const p = isPlaying(); listeners.forEach((l) => l(p)) }

function setTrack(i: number) {
  index = i
  const a = el()
  a.src = asset(tracks[i])
  a.loop = i === last
}

function el() {
  if (audio) return audio
  audio = new Audio()
  audio.preload = 'auto'
  audio.src = asset(tracks[0])
  audio.loop = last === 0
  audio.addEventListener('play', emit)
  audio.addEventListener('pause', emit)
  audio.addEventListener('ended', () => {
    if (mode === 'surprise') {
      clearTimeout(gapTimer)
      gapTimer = window.setTimeout(() => { if (mode === 'surprise') audio!.play().catch(emit) }, SURPRISE_GAP)
      return
    }
    if (index >= last) return // last track loops natively
    setTrack(index + 1)
    audio!.play().catch(emit)
  })
  return audio
}

/** If the browser refused to start (strict autoplay rules), try again on the next tap anywhere. */
function armRetry() {
  if (retryArmed) return
  retryArmed = true
  const retry = () => {
    window.removeEventListener('pointerdown', retry, true)
    window.removeEventListener('touchend', retry, true)
    window.removeEventListener('keydown', retry, true)
    retryArmed = false
    if (!userPaused && !isPlaying()) { const a = el(); a.muted = false; a.play().catch(armRetry) }
  }
  window.addEventListener('pointerdown', retry, true)
  window.addEventListener('touchend', retry, true)
  window.addEventListener('keydown', retry, true)
}

export const hasMusic = () => tracks.length > 0
export const isPlaying = () => !!audio && !audio.paused

/** Create the player and start buffering the first track early (no sound). */
export function primeMusic() { if (hasMusic()) el().load() }

/**
 * Call directly inside the gift tap. Phones only allow audio started inside a tap,
 * so playback starts *now* but muted, then rewinds and becomes audible after the delay.
 */
export function startMusicDelayed(delay = START_DELAY) {
  if (!hasMusic()) return
  userPaused = false
  setTrack(0)
  const a = el()
  a.muted = true
  a.play()?.catch(() => { emit(); armRetry() })
  clearTimeout(startTimer)
  startTimer = window.setTimeout(() => {
    if (userPaused) return
    a.currentTime = 0
    a.muted = false
    if (a.paused) a.play().catch(armRetry)
  }, delay)
}

export function playMusic() {
  if (!hasMusic()) return
  userPaused = false
  clearTimeout(startTimer)
  const a = el()
  a.muted = false
  a.play()?.catch(() => { emit(); armRetry() })
}
export function pauseMusic() { userPaused = true; clearTimeout(startTimer); audio?.pause() }
export function toggleMusic() { if (isPlaying()) pauseMusic(); else playMusic() }

/**
 * Call directly inside the "A surprise gift" tap. Reuses the already-unlocked player so
 * phones allow the sound to start by itself 3s later (muted play now, unmute later).
 */
export function startSurprise() {
  const a = el()
  saved = { index, time: a.currentTime, playing: !a.paused && !a.muted }
  mode = 'surprise'
  clearTimeout(startTimer); clearTimeout(gapTimer)
  a.pause()
  a.loop = false
  a.src = asset(SURPRISE_SRC)
  a.muted = true
  a.play()?.catch(() => { emit(); armRetry() })
  startTimer = window.setTimeout(() => {
    if (mode !== 'surprise') return
    a.currentTime = 0
    a.muted = false
    if (a.paused) a.play().catch(armRetry)
  }, SURPRISE_DELAY)
}

/** Leave the surprise and pick the birthday playlist back up where it was. */
export function stopSurprise() {
  if (mode !== 'surprise') return
  mode = 'playlist'
  clearTimeout(startTimer); clearTimeout(gapTimer)
  const a = el()
  a.pause()
  a.muted = false
  setTrack(saved.index)
  const resume = () => { try { a.currentTime = saved.time } catch { /* not seekable yet */ } }
  a.addEventListener('loadedmetadata', resume, { once: true })
  if (saved.playing && !userPaused) a.play().catch(emit)
}

export function onMusicChange(fn: (playing: boolean) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
