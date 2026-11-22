import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { content } from '../data/content'
import { SectionHeader, tilt } from './ui'

// warm paper tones that sit with plum + gold
const notes = [
  'from-[#FFF4CF] to-[#F8E7AE]',
  'from-[#F9DDD7] to-[#F1C7BF]',
  'from-[#F1E2EC] to-[#E3CCDD]',
  'from-[#F4E6C2] to-[#E8D29C]',
  'from-[#FCE6D2] to-[#F4D0B2]',
  'from-[#FBF5EA] to-[#EFE3CC]',
]

type Msg = (typeof content.messages.list)[number]

export default function Messages() {
  const { title, subtitle, list } = content.messages
  return (
    <section id="messages" className="section">
      <SectionHeader index={5} title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m, i) => <Note key={i} m={m} i={i} />)}
      </div>
    </section>
  )
}

function Note({ m, i }: { m: Msg; i: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const r = tilt(i + 11, 3)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const depth = [18, -12, 26][i % 3]
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [depth, -depth])
  const sway = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [-1.2, 0, 1.2])

  return (
    <motion.div ref={ref} style={{ y, rotate: sway }}>
      <motion.figure
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -30, scale: 0.85, rotate: r - 10 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: r }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ type: 'spring', stiffness: 180, damping: 9, mass: 0.8, delay: (i % 3) * 0.12, opacity: { duration: 0.3 } }}
        style={{ transformOrigin: '50% 6%' }}
        className={`relative min-h-[11.5rem] bg-gradient-to-br p-6 pt-9 ${notes[i % notes.length]}`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[0_1px_2px_rgba(74,29,63,.08),0_6px_10px_-6px_rgba(74,29,63,.2),0_22px_32px_-18px_rgba(74,29,63,.45)]" />
        {/* soft fold highlight */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent" />
        {/* pin */}
        <span aria-hidden className="absolute left-1/2 top-2.5 -ml-[9px] h-[18px] w-[18px] rounded-full bg-gradient-to-br from-plum-400 to-plum-700 shadow-[0_3px_4px_rgba(36,9,30,.35),inset_-2px_-2px_0_rgba(0,0,0,.2),inset_2px_2px_0_rgba(255,255,255,.25)]" />
        <blockquote className="relative font-hand text-[1.65rem] leading-snug text-plum-700">{m.message}</blockquote>
        <figcaption className="relative mt-4 text-right text-sm font-semibold tracking-wide text-plum-500">— {m.name}</figcaption>
      </motion.figure>
    </motion.div>
  )
}
