import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { content } from '../data/content'

const target = new Date(content.birthdayISO).getTime()

function remaining() {
  const ms = Math.max(0, target - Date.now())
  return {
    ms,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

export default function CountdownGate({ onOpen }: { onOpen: () => void }) {
  const preview = new URLSearchParams(window.location.search).get('preview') === '1'
  const [t, setT] = useState(remaining)
  const ready = preview || t.ms <= 0

  useEffect(() => {
    if (ready) return
    const id = setInterval(() => setT(remaining()), 1000)
    return () => clearInterval(id)
  }, [ready])

  return (
    <motion.section
      key="gate"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-40 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-plum-900 px-6 text-center text-cream-100"
    >
      <Sparkles />
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div key="count" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative">
            <p className="font-hand text-4xl text-gold-300 sm:text-5xl">{content.gate.teaser}</p>
            <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4">
              {([['days', t.days], ['hours', t.hours], ['mins', t.minutes], ['secs', t.seconds]] as const).map(([label, v]) => (
                <div key={label} className="min-w-[70px] rounded-2xl border border-gold/30 bg-white/5 px-2 py-4 backdrop-blur sm:min-w-[96px]">
                  <div className="text-3xl font-semibold tabular-nums sm:text-5xl">{String(v).padStart(2, '0')}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-cream-300/70">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ready" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative flex flex-col items-center">
            <motion.div className="text-7xl" animate={{ rotate: [0, -8, 8, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}>
              🎁
            </motion.div>
            <p className="mt-6 font-hand text-4xl text-gold-300 sm:text-5xl">{content.gate.readyLine}</p>
            <button onClick={onOpen} className="animate-glow mt-10 min-h-[56px] rounded-full bg-gradient-to-r from-gold-600 via-gold to-gold-400 px-9 py-4 text-lg font-semibold text-plum-900 transition-transform active:scale-95">
              {content.gate.button}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function Sparkles() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
    left: (i * 37) % 100, top: (i * 61) % 100, size: 2 + (i % 3), delay: (i % 7) * 0.5,
  }))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-plum-400/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-300"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{ duration: 3, delay: d.delay, repeat: Infinity }}
        />
      ))}
    </div>
  )
}
