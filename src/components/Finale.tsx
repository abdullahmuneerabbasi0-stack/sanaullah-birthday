import confetti from 'canvas-confetti'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { content } from '../data/content'
import { sprinkle } from '../hooks/confetti'
import { openSurprise } from '../lib/surprise'
import { SectionHeader, ease } from './ui'

function useTypewriter(text: string, run: boolean, speed = 28) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) { setN(0); return }
    if (reduce) { setN(text.length); return }
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed)
    return () => clearInterval(id)
  }, [run, text, speed, reduce])
  return { shown: text.slice(0, n), done: n >= text.length, skip: () => setN(text.length) }
}

function heartBurst() {
  const shapes = ['❤️', '💛', '🤍'].map((text) => confetti.shapeFromText({ text, scalar: 2 }))
  const base = { shapes, scalar: 2, ticks: 160, gravity: 0.6, decay: 0.93, startVelocity: 26, flat: true }
  confetti({ ...base, particleCount: 18, spread: 80, origin: { x: 0.5, y: 0.7 } })
  setTimeout(() => confetti({ ...base, particleCount: 12, spread: 120, origin: { x: 0.5, y: 0.65 } }), 250)
}

export default function Finale() {
  const f = content.finale
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const { shown, done, skip } = useTypewriter(f.letter, showLetter)

  useEffect(() => {
    if (!(done && showLetter)) return
    const t = setTimeout(() => (reduce ? sprinkle() : heartBurst()), 300)
    return () => clearTimeout(t)
  }, [done, showLetter, reduce])

  const openEnvelope = () => {
    if (open) return
    setOpen(true)
    navigator.vibrate?.(15)
    setTimeout(() => setShowLetter(true), reduce ? 300 : 1700)
  }

  return (
    <section id="finale" className="section">
      <SectionHeader index={6} title={f.title} />
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key="env"
            exit={{ opacity: 0, y: 40, scale: 0.92, filter: 'blur(4px)', transition: { duration: 0.5, ease } }}
            className="flex flex-col items-center"
          >
            <motion.button
              onClick={openEnvelope}
              aria-label="Open the envelope"
              whileHover={open || reduce ? undefined : { y: -6, rotate: -1.5 }}
              whileTap={open ? undefined : { scale: 0.97 }}
              animate={open || reduce ? {} : { y: [0, -5, 0] }}
              transition={{ y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
              className="relative mt-16 h-52 w-[18.5rem] sm:h-60 sm:w-80"
              style={{ perspective: 900 }}
            >
              {/* soft floor shadow */}
              <span aria-hidden className="absolute -bottom-6 left-6 right-6 h-6 rounded-[50%] bg-plum-900/25 blur-lg" />
              {/* back of envelope */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-plum-700 to-plum-900" />
              {/* letter inside, slides up */}
              <motion.div
                className="absolute inset-x-5 top-3 h-[85%] rounded-md bg-gradient-to-b from-cream-100 to-cream-200 shadow-[0_-4px_14px_rgba(36,9,30,.15)]"
                style={{ zIndex: 5 }}
                initial={false}
                animate={{ y: open ? -120 : 0 }}
                transition={{ delay: 0.55, duration: 0.9, ease }}
              >
                <div className="mx-5 mt-6 space-y-2.5">
                  <div className="h-1.5 w-1/3 rounded bg-plum/20" />
                  {[0, 1, 2, 3].map((k) => <div key={k} className="h-1.5 rounded bg-plum/10" />)}
                </div>
              </motion.div>
              {/* front pocket */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" style={{ zIndex: 10 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-plum-400 to-plum-500 [clip-path:polygon(0_0,50%_56%,0_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-bl from-plum-400 to-plum-500 [clip-path:polygon(100%_0,50%_56%,100%_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum to-plum-400 [clip-path:polygon(0_100%,50%_48%,100%_100%)]" />
              </div>
              {/* flap opens in 3D */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[58%] origin-top"
                style={{ transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateX: open ? -178 : 0, zIndex: open ? [20, 20, 1] : 20 }}
                transition={{ duration: reduce ? 0.01 : 0.75, ease: [0.65, 0, 0.35, 1], zIndex: { duration: 0.75, times: [0, 0.5, 0.51] } }}
              >
                <div className="backface-hidden absolute inset-0 bg-gradient-to-b from-plum-700 to-plum [clip-path:polygon(0_0,100%_0,50%_100%)]" />
                <div className="backface-hidden absolute inset-0 bg-gradient-to-t from-plum-500 to-plum-400 [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ transform: 'rotateX(180deg)' }} />
              </motion.div>
              {/* wax seal */}
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold to-gold-600 text-2xl"
                  style={{ boxShadow: 'inset 0 2px 3px rgba(255,255,255,.5), inset 0 -3px 6px rgba(0,0,0,.2), 0 6px 14px rgba(36,9,30,.45)' }}
                  animate={open ? { scale: 0, rotate: 90, opacity: 0 } : { scale: [1, 1.08, 1] }}
                  transition={open ? { duration: 0.3, ease: 'backIn' } : { repeat: Infinity, duration: 2.2 }}
                >
                  ❤️
                </motion.div>
              </div>
            </motion.button>
            <motion.p animate={{ opacity: open ? 0 : 1 }} className="mt-12 font-hand text-2xl text-plum-500">{f.envelopeHint}</motion.p>
          </motion.div>
        ) : (
          <div key="letter" style={{ perspective: 1400 }}>
            <motion.article
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40, rotateX: -80, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 70, damping: 14, opacity: { duration: 0.3 } }}
              style={{
                transformOrigin: '50% 0%',
                backgroundImage: 'repeating-linear-gradient(transparent 0 38px, rgba(74,29,63,.07) 38px 39px)',
                boxShadow: '0 1px 2px rgba(74,29,63,.08), 0 30px 60px -24px rgba(74,29,63,.45)',
              }}
              className="relative mx-auto max-w-xl rounded-sm bg-cream-100 px-6 py-10 sm:px-12"
              onClick={() => !done && skip()}
            >
              {/* fold crease fading away as it unfolds */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/3 h-16 bg-gradient-to-b from-transparent via-plum/10 to-transparent"
                initial={{ opacity: reduce ? 0 : 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.5, duration: 1.4 }}
              />
              <div className="relative whitespace-pre-line font-hand text-[26px] leading-[39px] text-plum-700 sm:text-[28px]">
                {shown}
                {!done && <span aria-hidden className="caret ml-0.5 inline-block h-6 w-[2px] bg-plum align-middle" />}
              </div>
              <AnimatePresence>
                {done && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative">
                    <p className="mt-8 font-hand text-[26px] text-plum-700">{f.signOff}</p>
                    <p className="font-hand text-4xl text-plum">— {content.yourName}</p>
                    {f.youtubeId && (
                      <div className="mt-8 aspect-video overflow-hidden rounded-lg shadow-paper">
                        <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}`} title="A video for you" loading="lazy"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    )}
                    {f.ending && (
                      <motion.div initial={{ scale: 0.8, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 14 }} className="mt-10">
                        {f.surpriseImage ? (
                          <SurpriseButton label={f.ending} />
                        ) : (
                          <p className="rounded-2xl bg-plum px-6 py-5 text-center font-hand text-4xl text-gold-300">{f.ending}</p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {!done && <p className="relative mt-6 text-center text-xs text-plum-500/70">tap to skip ahead</p>}
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

/** Opens the surprise page (in-app, so its sound can start by itself). */
function SurpriseButton({ label }: { label: string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}surprise.html`}
      onClick={(e) => { e.preventDefault(); openSurprise() }}
      className="press animate-glow group relative flex min-h-[64px] w-full items-center justify-center overflow-hidden rounded-2xl px-6 py-5 text-center font-hand text-4xl text-gold-300"
      style={{ background: 'linear-gradient(180deg,#6A3260,#4A1D3F)' }}
    >
      <span aria-hidden className="sheen absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="relative">{label}</span>
    </a>
  )
}
