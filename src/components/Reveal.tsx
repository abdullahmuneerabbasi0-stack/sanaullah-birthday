import { motion, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'

export default function Reveal() {
  const reduce = useReducedMotion()
  const line1 = 'Happy Birthday,'
  const line2 = `${content.friendName}!`
  let n = 0
  const letter = (ch: string, i: number) => {
    const d = 0.3 + n++ * 0.06
    return (
      <motion.span
        key={i}
        className="inline-block"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: reduce ? 0 : d, type: 'spring', stiffness: 260, damping: 18 }}
      >
        {ch}
      </motion.span>
    )
  }
  // keep each word together so lines only break between words
  const letters = (s: string) =>
    s.split(' ').map((word, w) => (
      <span key={w} className="inline-block whitespace-nowrap">
        {word.split('').map(letter)}
        {w < s.split(' ').length - 1 && '\u00A0'}
      </span>
    ))
  const total = 0.3 + (line1.length + line2.length) * 0.06

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-floaty absolute left-[8%] top-[14%] text-4xl">🎈</div>
        <div className="animate-floaty absolute right-[10%] top-[22%] text-3xl [animation-delay:1.5s]">✨</div>
        <div className="animate-floaty absolute bottom-[20%] left-[14%] text-3xl [animation-delay:3s]">🎂</div>
        <div className="animate-floaty absolute bottom-[14%] right-[12%] text-4xl [animation-delay:.8s]">🎉</div>
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/30 blur-3xl" />
      </div>
      <h1 className="relative font-hand leading-[0.95] text-plum">
        <span className="block text-[3.25rem] sm:text-8xl">{letters(line1)}</span>
        <span className="mt-2 block bg-gradient-to-r from-plum via-plum-400 to-gold-600 bg-clip-text text-[4rem] text-transparent sm:text-9xl">
          {letters(line2)}
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : total + 0.2, duration: 0.8 }}
        className="relative mt-8 max-w-md text-lg text-plum-400"
      >
        {content.reveal.subtitle}
      </motion.p>
      <motion.a
        href="#story"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: total + 0.8 }, y: { repeat: Infinity, duration: 2, delay: total + 0.8 } }}
        className="absolute bottom-8 font-hand text-2xl text-plum-400"
      >
        {content.reveal.scrollHint}
      </motion.a>
    </section>
  )
}
