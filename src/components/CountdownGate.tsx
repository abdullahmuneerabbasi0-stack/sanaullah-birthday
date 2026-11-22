import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
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

/** One digit that rolls up when it changes. */
function RollingDigit({ d }: { d: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={d}
          className="absolute inset-0 flex items-center justify-center"
          initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  )
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-plum-900 px-6 text-center text-cream-100"
    >
      <Particles />
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div key="count" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative">
            <p className="font-hand text-4xl text-gold-300 sm:text-6xl">{content.gate.teaser}</p>
            <div className="mt-10 grid grid-cols-4 gap-2.5 sm:gap-4">
              {([['days', t.days], ['hours', t.hours], ['mins', t.minutes], ['secs', t.seconds]] as const).map(([label, v]) => (
                <div
                  key={label}
                  className="relative min-w-[72px] overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-b from-white/[.09] to-white/[.02] px-2 py-4 sm:min-w-[104px] sm:py-6"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 20px 40px -20px rgba(0,0,0,.6)' }}
                >
                  <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-black/30" />
                  <div className="flex justify-center text-[2rem] font-semibold tabular-nums leading-none sm:text-6xl">
                    {String(v).padStart(2, '0').split('').map((d, i) => <RollingDigit key={i} d={d} />)}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-cream-300/70 sm:text-[11px]">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ready" initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative flex flex-col items-center">
            <motion.div className="text-7xl drop-shadow-[0_10px_30px_rgba(201,162,75,.45)]" animate={{ rotate: [0, -8, 8, -4, 0], y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}>
              🎁
            </motion.div>
            <p className="mt-6 max-w-xs font-hand text-[2.5rem] leading-tight text-gold-300 sm:max-w-md sm:text-5xl">{content.gate.readyLine}</p>
            <button
              onClick={onOpen}
              className="press animate-glow mt-10 min-h-[58px] rounded-full bg-gradient-to-r from-gold-600 via-gold to-gold-400 px-9 py-4 text-lg font-semibold text-plum-900"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)' }}
            >
              {content.gate.button}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

/** Drifting gold dust: transform/opacity only. */
function Particles() {
  const reduce = useReducedMotion()
  const dots = useMemo(() => Array.from({ length: 34 }, (_, i) => ({
    left: (i * 37 + 11) % 100, top: (i * 61 + 7) % 100, size: 1.5 + (i % 4) * 0.8,
    delay: (i % 9) * 0.6, dur: 5 + (i % 5), drift: ((i % 7) - 3) * 8,
  })), [])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-plum-400/40 blur-3xl" />
      <div className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.45)_100%)]" />
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-300"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, boxShadow: '0 0 6px rgba(231,205,138,.8)' }}
          animate={reduce ? { opacity: 0.5 } : { opacity: [0, 0.9, 0], y: [0, -40], x: [0, d.drift] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
