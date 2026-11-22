import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
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

  const reveal = () => {
    setFlipped(true)
    const s = Math.max(seen, i + 1)
    setSeen(s)
    if (s === list.length && seen < list.length) sprinkle()
  }
  const next = () => {
    setFlipped(false)
    setI((v) => (v + 1) % list.length)
  }

  return (
    <section id="reasons" className="section">
      <SectionHeader index={3} title={title} subtitle={subtitle} />
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="relative h-[23rem] w-full" style={{ perspective: 1400 }}>
          {/* the rest of the deck */}
          {[2, 1].map((k) => (
            <motion.div
              key={`${i}-${k}`}
              aria-hidden
              className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-plum-500 to-plum-700"
              initial={false}
              animate={{ y: k * 12, scale: 1 - k * 0.05, rotate: k % 2 ? 3 : -3, opacity: 1 - k * 0.25 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{ boxShadow: '0 20px 40px -20px rgba(36,9,30,.5)' }}
            />
          ))}
          <AnimatePresence initial={false}>
            <TopCard key={i} n={i + 1} text={list[i]} flipped={flipped} last={last} onReveal={reveal} onNext={next} />
          </AnimatePresence>
        </div>
        <div className="mt-12 flex items-center gap-3">
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-plum/10">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-gold-600 to-gold-300"
              initial={false}
              animate={{ scaleX: seen / list.length }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="min-w-[3.5rem] text-sm font-medium tabular-nums text-plum-500">{seen} / {list.length}</span>
        </div>
      </div>
    </section>
  )
}

function TopCard({ n, text, flipped, last, onReveal, onNext }: {
  n: number; text: string; flipped: boolean; last: boolean; onReveal: () => void; onNext: () => void
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-16, 16])
  const [gone, setGone] = useState(false)

  const flyOut = (dir: number) => {
    if (gone) return
    setGone(true)
    if (!flipped) onReveal()
    animate(x, dir * 480, { duration: 0.4, ease: [0.4, 0, 1, 1] }).then(onNext)
  }

  return (
    <motion.div
      className="absolute inset-0 touch-pan-y"
      style={{ x, rotate }}
      initial={{ scale: 0.92, y: 18, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      drag={reduce ? false : 'x'}
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) flyOut(Math.sign(info.offset.x || info.velocity.x))
        else animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
      }}
    >
      <motion.button
        onTap={() => (flipped ? flyOut(1) : onReveal())}
        className="relative h-full w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0, scale: flipped ? [1, 1.06, 1] : 1, z: 0 }}
        transition={{ rotateY: { type: 'spring', stiffness: 120, damping: 16 }, scale: { duration: 0.7 } }}
        aria-label={flipped ? 'Next reason' : `Flip reason ${n}`}
      >
        {/* front */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-plum-400 via-plum to-plum-700 p-8 text-cream-100"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.15), 0 2px 4px rgba(36,9,30,.2), 0 30px 60px -24px rgba(36,9,30,.7)' }}
        >
          <div className="absolute inset-3 rounded-[1.35rem] border border-gold/40" />
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-2xl" />
          <span className="font-hand text-2xl text-gold-300/90">reason</span>
          <span className="font-hand text-[6.5rem] leading-none text-gold-300 drop-shadow-[0_6px_20px_rgba(201,162,75,.35)]">#{n}</span>
          <span className="mt-6 rounded-full border border-gold/30 px-4 py-1.5 text-[13px] text-cream-200/90">tap to flip ✨</span>
        </div>
        {/* back */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] bg-gradient-to-b from-cream-100 to-cream-200 p-8"
          style={{ transform: 'rotateY(180deg)', boxShadow: 'inset 0 1px 0 #fff, 0 2px 4px rgba(74,29,63,.1), 0 30px 60px -24px rgba(74,29,63,.55)' }}
        >
          <div className="absolute inset-3 rounded-[1.35rem] border border-gold/50" />
          <span className="text-3xl">💛</span>
          <p className="mt-4 font-hand text-[1.9rem] leading-snug text-plum">{text}</p>
          <span className="mt-6 text-[13px] text-plum-500/80">{last ? 'tap to start again' : 'tap for the next one →'}</span>
        </div>
      </motion.button>
    </motion.div>
  )
}
