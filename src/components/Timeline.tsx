import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { asset, content } from '../data/content'
import { SectionHeader, ease, tilt } from './ui'

type Memory = (typeof content.timeline.memories)[number]

// gentle hand-drawn wave, stretched to the list height
const wave = Array.from({ length: 10 }, (_, i) => {
  const y = i * 100
  return `C ${i % 2 ? 4 : 20} ${y + 33}, ${i % 2 ? 20 : 4} ${y + 66}, 12 ${y + 100}`
}).join(' ')
const pathD = `M 12 0 ${wave}`

export default function Timeline() {
  const { title, subtitle, memories } = content.timeline
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] })
  const spring = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 })
  const draw = useTransform(spring, (v) => (reduce ? 1 : v))

  return (
    <section id="story" className="section">
      <SectionHeader index={1} title={title} subtitle={subtitle} />
      <div className="relative">
        {/* the line draws itself as you scroll */}
        <svg
          aria-hidden
          className="absolute bottom-0 left-4 top-0 h-full w-6 -translate-x-1/2 overflow-visible md:left-1/2"
          viewBox="0 0 24 1000" preserveAspectRatio="none"
        >
          <path d={pathD} fill="none" stroke="rgba(201,162,75,.18)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={pathD} fill="none" stroke="url(#tl-grad)" strokeWidth="2.5" strokeLinecap="round"
            vectorEffect="non-scaling-stroke" style={{ pathLength: draw }}
          />
          <defs>
            <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E7CD8A" />
              <stop offset="100%" stopColor="#A9822F" />
            </linearGradient>
          </defs>
        </svg>
        <ol ref={listRef} className="space-y-16 sm:space-y-24">
          {memories.map((m, i) => <MemoryCard key={i} m={m} i={i} />)}
        </ol>
      </div>
    </section>
  )
}

function MemoryCard({ m, i }: { m: Memory; i: number }) {
  const right = i % 2 === 1
  const reduce = useReducedMotion()
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%'])

  return (
    <li ref={ref} className="relative md:grid md:grid-cols-2 md:gap-16">
      <motion.span
        aria-hidden
        className="absolute left-4 top-8 z-10 -ml-[9px] h-[18px] w-[18px] rounded-full border-[3px] border-cream bg-gold md:left-1/2"
        style={{ boxShadow: '0 0 0 4px rgba(201,162,75,.18), 0 2px 6px rgba(74,29,63,.3)' }}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
      />
      <div className={`perspective pl-12 md:pl-0 ${right ? 'md:col-start-2' : 'md:col-start-1 md:flex md:justify-end'}`}>
        <motion.article
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 50, rotateY: right ? -22 : 22, rotateX: 12, scale: 0.94, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 1, ease }}
          className="polaroid tape relative w-full max-w-sm !pb-6 text-left"
          style={{ rotate: tilt(i, 2.5), transformOrigin: right ? 'left center' : 'right center' }}
        >
          <div className="aspect-[4/3] overflow-hidden bg-cream-200">
            {m.photo ? (
              <motion.img
                src={asset(m.photo)} alt={m.title} loading="lazy" decoding="async"
                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                style={{ y: photoY, scale: 1.2 }}
                className="photo-fade h-full w-full object-cover will-change-transform"
              />
            ) : (
              <div role="img" aria-label={m.title} className="h-full w-full bg-gradient-to-br from-blush via-cream-200 to-gold-300" />
            )}
          </div>
          <div className="px-1 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">{m.date}</p>
            <h3 className="mt-1.5 font-hand text-[2rem] leading-tight text-plum">{m.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-plum-500/90">{m.caption}</p>
          </div>
        </motion.article>
      </div>
    </li>
  )
}
