import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { content } from '../data/content'
import { sprinkle } from '../hooks/confetti'
import { SectionHeader } from './ui'

export default function Reasons() {
  const { title, subtitle, list } = content.reasons
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState(0)
  const last = i === list.length - 1

  const flip = () => {
    if (!flipped) {
      setFlipped(true)
      const s = Math.max(seen, i + 1)
      setSeen(s)
      if (s === list.length) sprinkle()
    } else {
      next()
    }
  }
  const next = () => {
    setFlipped(false)
    setTimeout(() => setI((v) => (v + 1) % list.length), 180)
  }

  return (
    <section id="reasons" className="section">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="relative h-[22rem] w-full perspective">
          {/* the rest of the deck peeking out behind */}
          {[2, 1].map((k) => (
            <div key={k} aria-hidden className="absolute inset-0 rounded-3xl border border-plum/10 bg-cream-200 shadow-paper"
              style={{ transform: `translateY(${k * 10}px) scale(${1 - k * 0.04}) rotate(${k % 2 ? 2 : -2}deg)` }} />
          ))}
          <AnimatePresence mode="wait">
            <motion.button
              key={i}
              onClick={flip}
              initial={{ opacity: 0, y: -30, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, x: 140, rotate: 12 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 w-full"
              aria-label={flipped ? 'Next reason' : `Flip reason ${i + 1}`}
            >
              <motion.div
                className="relative h-full w-full preserve-3d"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-plum to-plum-400 p-8 text-cream-100 shadow-paper">
                  <div className="absolute inset-3 rounded-[1.25rem] border border-gold/40" />
                  <span className="font-hand text-2xl text-gold-300">reason</span>
                  <span className="font-hand text-8xl leading-none text-gold-300">#{i + 1}</span>
                  <span className="mt-6 text-sm text-cream-200/80">tap to flip ✨</span>
                </div>
                <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-cream-100 p-8 shadow-paper [transform:rotateY(180deg)]">
                  <div className="absolute inset-3 rounded-[1.25rem] border border-gold/50" />
                  <span className="text-3xl">💛</span>
                  <p className="mt-4 font-hand text-3xl leading-snug text-plum">{list[i]}</p>
                  <span className="mt-6 text-sm text-plum-400">{last ? 'tap to start again' : 'tap for the next one →'}</span>
                </div>
              </motion.div>
            </motion.button>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-plum/10">
            <motion.div className="h-full rounded-full bg-gold" animate={{ width: `${(seen / list.length) * 100}%` }} />
          </div>
          <span className="text-sm font-medium tabular-nums text-plum-400">{seen} / {list.length}</span>
        </div>
      </div>
    </section>
  )
}
