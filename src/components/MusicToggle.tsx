import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { hasMusic, isPlaying, onMusicChange, toggleMusic } from '../lib/music'

/** Floating play/pause button with equaliser bars. Music starts with the gift tap (see App). */
export default function MusicToggle() {
  const [playing, setPlaying] = useState(isPlaying)
  useEffect(() => onMusicChange(setPlaying), [])
  if (!hasMusic()) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.5, type: 'spring', stiffness: 300, damping: 18 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMusic}
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
  )
}
