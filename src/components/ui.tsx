import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { asset } from '../data/content'

export const ease = [0.22, 1, 0.36, 1] as const

/** Fade + rise + blur-to-sharp once the element scrolls into view. */
export function FadeIn({
  children, delay = 0, x = 0, y = 28, className, ...rest
}: { children: ReactNode; delay?: number; x?: number; y?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: reduce ? 0.4 : 0.9, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Parent + child variants for staggered reveals. */
export const stagger = (gap = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
})
export const rise: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease } },
}

export function SectionHeader({ index, title, subtitle }: { index?: number; title: string; subtitle?: string }) {
  return (
    <motion.header
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15% 0px' }}
      className="mb-14 text-center sm:mb-20"
    >
      {index !== undefined && (
        <motion.div variants={rise} aria-hidden className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.35em] text-gold-600">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
          {String(index).padStart(2, '0')}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
        </motion.div>
      )}
      <motion.h2 variants={rise} className="section-title">{title}</motion.h2>
      {subtitle && <motion.p variants={rise} className="section-sub">{subtitle}</motion.p>}
    </motion.header>
  )
}

const gradients = [
  'from-blush via-cream-200 to-gold-300',
  'from-plum-400/60 via-blush to-cream-200',
  'from-gold-300 via-cream-200 to-blush',
  'from-cream-300 via-blush to-plum-400/50',
  'from-blush via-gold-300/70 to-cream-200',
]

/** A real photo (lazy-loaded, fades in when decoded) or a soft gradient placeholder. */
export function Photo({ src, alt, index = 0, className = '', eager = false }: { src: string; alt: string; index?: number; className?: string; eager?: boolean }) {
  if (src) {
    return (
      <img
        src={asset(src)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
        className={`photo-fade h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (photo coming soon)`}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]} ${className}`}
    >
      <span className="text-3xl opacity-40">📷</span>
    </div>
  )
}

/** Stable pseudo-random rotation per index, so it doesn't change on re-render. */
export const tilt = (i: number, max = 4) => ((((i * 9301 + 49297) % 233280) / 233280) * 2 - 1) * max
