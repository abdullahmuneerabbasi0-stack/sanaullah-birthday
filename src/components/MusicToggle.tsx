import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { asset, content } from '../data/content'

/** Floating music button. Only ever plays after the user taps (never autoplays). */
export default function MusicToggle() {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => () => ref.current?.pause(), [])
  if (!content.music) return null

  const toggle = async () => {
    const a = ref.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { try { await a.play(); setPlaying(true) } catch { setPlaying(false) } }
  }
  return (
    <>
      <audio ref={ref} src={asset(content.music)} loop preload="none" />
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }}
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-plum text-2xl text-gold-300 shadow-paper active:scale-95"
      >
        <motion.span animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={playing ? { repeat: Infinity, duration: 3, ease: 'linear' } : {}}>
          {playing ? '🎶' : '🔇'}
        </motion.span>
      </motion.button>
    </>
  )
}
