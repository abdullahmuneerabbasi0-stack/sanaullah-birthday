import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { asset, content } from '../data/content'

/** Floating music button with equaliser bars. Plays the playlist in order and loops.
 *  Only ever plays after a tap (never autoplays). */
export default function MusicToggle() {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const tracks = content.music
  useEffect(() => () => ref.current?.pause(), [])
  // when a track ends, move to the next one (wrapping round) and keep playing
  useEffect(() => {
    const a = ref.current
    if (a && playing) a.play().catch(() => setPlaying(false))
  }, [track]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!tracks.length) return null

  const toggle = async () => {
    const a = ref.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { try { await a.play(); setPlaying(true) } catch { setPlaying(false) } }
  }
  return (
    <>
      <audio
        ref={ref}
        src={asset(tracks[track])}
        loop={tracks.length === 1}
        preload="none"
        onEnded={() => setTrack((t) => (t + 1) % tracks.length)}
      />
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.5, type: 'spring', stiffness: 300, damping: 18 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[58] flex h-14 w-14 items-center justify-center gap-[3px] rounded-full text-gold-300"
        style={{ background: 'linear-gradient(180deg,#6A3260,#4A1D3F)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), 0 12px 28px -10px rgba(36,9,30,.7)' }}
      >
        {[0.9, 0.55, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className="w-[3px] origin-bottom rounded-full bg-gold-300"
            style={{
              height: 18 * h,
              transform: playing ? undefined : 'scaleY(.25)',
              animation: playing ? `eq ${0.7 + i * 0.17}s ease-in-out ${i * 0.1}s infinite` : 'none',
              transition: 'transform .3s',
            }}
          />
        ))}
      </motion.button>
    </>
  )
}
