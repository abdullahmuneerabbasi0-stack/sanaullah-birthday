import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { content } from '../data/content'
import { sprinkle } from '../hooks/confetti'
import { SectionHeader } from './ui'

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

export default function Finale() {
  const f = content.finale
  const [open, setOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const { shown, done, skip } = useTypewriter(f.letter, showLetter)

  useEffect(() => { if (done && showLetter) sprinkle() }, [done, showLetter])

  const openEnvelope = () => {
    if (open) return
    setOpen(true)
    setTimeout(() => setShowLetter(true), 900)
  }

  return (
    <section id="finale" className="section">
      <SectionHeader title={f.title} />
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div key="env" exit={{ opacity: 0, y: -30 }} className="flex flex-col items-center">
            <button onClick={openEnvelope} aria-label="Open the envelope" className="relative h-52 w-72 perspective sm:h-60 sm:w-80">
              {/* letter peeking out */}
              <motion.div
                className="absolute inset-x-5 top-4 h-40 rounded-md bg-cream-100 shadow"
                animate={{ y: open ? -70 : 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="mx-5 mt-6 space-y-2">{[0, 1, 2].map((k) => <div key={k} className="h-1.5 rounded bg-plum/10" />)}</div>
              </motion.div>
              {/* envelope body */}
              <div className="absolute inset-0 overflow-hidden rounded-lg bg-plum-500 shadow-paper">
                <div className="absolute inset-0 [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)] bg-plum" />
                <div className="absolute inset-0 [clip-path:polygon(0_100%,50%_50%,100%_100%)] bg-plum-400" />
              </div>
              {/* flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 origin-top [clip-path:polygon(0_0,100%_0,50%_100%)] bg-plum-700"
                animate={{ rotateX: open ? 180 : 0, zIndex: open ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              />
              {/* wax seal */}
              <motion.div
                className="absolute left-1/2 top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-2xl shadow-lg"
                animate={open ? { scale: 0, opacity: 0 } : { scale: [1, 1.08, 1] }}
                transition={open ? { duration: 0.25 } : { repeat: Infinity, duration: 2 }}
              >
                ❤️
              </motion.div>
            </button>
            <p className="mt-8 font-hand text-2xl text-plum-400">{f.envelopeHint}</p>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-xl rounded-sm bg-cream-100 px-6 py-10 shadow-paper sm:px-12"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 38px, rgba(74,29,63,.07) 38px 39px)' }}
            onClick={() => !done && skip()}
          >
            <div className="whitespace-pre-line font-hand text-[26px] leading-[39px] text-plum-700 sm:text-[28px]">
              {shown}
              {!done && <span className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-plum align-middle" />}
            </div>
            <AnimatePresence>
              {done && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <p className="mt-8 font-hand text-[26px] text-plum-700">{f.signOff}</p>
                  <p className="font-hand text-4xl text-plum">— {content.yourName}</p>
                  {f.youtubeId && (
                    <div className="mt-8 aspect-video overflow-hidden rounded-lg shadow-paper">
                      <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}`} title="A video for you" loading="lazy"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  )}
                  {f.ending && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: 'spring' }} className="mt-10">
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
            {!done && <p className="mt-6 text-center text-xs text-plum-400/70">tap to skip ahead</p>}
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  )
}

/** Opens the surprise on its own page (public/surprise.html). */
function SurpriseButton({ label }: { label: string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}surprise.html`}
      className="animate-glow flex w-full min-h-[64px] items-center justify-center rounded-2xl bg-plum px-6 py-5 text-center font-hand text-4xl text-gold-300 transition-transform active:scale-95"
    >
      {label}
    </a>
  )
}
