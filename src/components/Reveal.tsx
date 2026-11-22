import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { asset, content } from '../data/content'
import { Balloon } from './ScrollProgress'

const balloons = [
  { left: '6%', color: '#C9A24B', size: 'h-16 w-10', dur: '15s', delay: '0s' },
  { left: '22%', color: '#7A3F6A', size: 'h-12 w-8', dur: '18s', delay: '2.5s' },
  { left: '74%', color: '#F2C9C4', size: 'h-14 w-9', dur: '16s', delay: '1s' },
  { left: '88%', color: '#C9A24B', size: 'h-11 w-7', dur: '19s', delay: '4s' },
  { left: '50%', color: '#E7CD8A', size: 'h-10 w-6', dur: '21s', delay: '6s' },
]

export default function Reveal({ start = 0.2 }: { start?: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const line1 = 'Happy Birthday,'
  const line2 = `${content.friendName}!`
  let n = 0
  // background-clip text breaks on transformed letters, so the plum→gold blend is per letter
  const grad = (t: number) => {
    const a = [74, 29, 63], b = [169, 130, 47]
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`
  }
  const letter = (ch: string, i: number, colorAt?: number) => {
    const d = start + 0.35 + n++ * 0.045
    return (
      <motion.span
        key={i}
        className="inline-block will-change-transform"
        style={colorAt !== undefined ? { color: grad(colorAt) } : undefined}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.6em', rotate: -8, scale: 0.6, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: reduce ? start : d, type: 'spring', stiffness: 320, damping: 16, mass: 0.7, filter: { duration: 0.4, delay: d } }}
      >
        {ch}
      </motion.span>
    )
  }
  // keep each word together so lines only break between words
  const letters = (s: string, blend = false) =>
    s.split(' ').map((word, w, arr) => (
      <span key={w} className="inline-block whitespace-nowrap">
        {word.split('').map((ch, i) => letter(ch, i, blend ? i / Math.max(1, word.length - 1) : undefined))}
        {w < arr.length - 1 && ' '}
      </span>
    ))
  const total = start + 0.35 + (line1.length + line2.length) * 0.045

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-16 text-center">
      {/* drifting balloons, start after the name lands */}
      {!reduce && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: total, duration: 1 }}>
          {balloons.map((b, i) => (
            <div key={i} className="balloon-rise absolute -bottom-20" style={{ left: b.left, ['--dur' as string]: b.dur, ['--delay' as string]: b.delay }}>
              <Balloon className={`${b.size} opacity-80`} color={b.color} />
            </div>
          ))}
        </motion.div>
      )}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/30 blur-3xl" />

      <motion.div style={{ y: photoY, opacity: fade }} className="relative flex flex-col items-center">
        {content.reveal.photo && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: -10, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: -3, y: 0 }}
            transition={{ delay: start, type: 'spring', stiffness: 140, damping: 15 }}
            className="relative mb-7 rounded-[1.75rem] bg-white p-2.5 pb-8"
            style={{ boxShadow: '0 2px 4px rgba(74,29,63,.08), 0 30px 60px -20px rgba(74,29,63,.45), 0 0 0 1px rgba(74,29,63,.04)' }}
          >
            <img
              src={asset(content.reveal.photo)}
              alt={content.friendName}
              fetchPriority="high"
              className="h-48 w-40 rounded-[1.25rem] object-cover object-top sm:h-56 sm:w-44 xl:h-64 xl:w-52"
            />
            <motion.span
              aria-hidden className="absolute -right-3 -top-3 text-2xl"
              initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 12 }}
              transition={{ delay: total, type: 'spring', stiffness: 300, damping: 12 }}
            >
              ✨
            </motion.span>
          </motion.div>
        )}
        <h1 className="relative font-hand leading-[0.95] text-plum" aria-label={`${line1} ${line2}`}>
          <span aria-hidden className="block text-[3.25rem] sm:text-8xl">{letters(line1)}</span>
          <span aria-hidden className="mt-1 block pb-2 text-[4.25rem] sm:text-9xl">
            {letters(line2, true)}
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: reduce ? start : total + 0.15, duration: 0.9 }}
          className="relative mt-6 max-w-sm text-balance text-[17px] leading-relaxed text-plum-500 sm:max-w-md"
        >
          {content.reveal.subtitle}
        </motion.p>
      </motion.div>

      {/* scroll hint */}
      <motion.a
        href="#story"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? start : total + 0.9, duration: 0.8 }}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex min-h-[48px] flex-col items-center justify-center gap-1.5 px-4 font-hand text-2xl text-plum-500"
      >
        {content.reveal.scrollHint}
        <span aria-hidden className="relative flex h-8 w-5 justify-center rounded-full border-[1.5px] border-plum/30">
          <motion.span
            className="mt-1.5 h-1.5 w-1 rounded-full bg-gold-600"
            animate={reduce ? {} : { y: [0, 9, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
