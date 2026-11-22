import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { asset } from '../data/content'

/** Fades + slides children in once they scroll into view. */
export function FadeIn({
  children, delay = 0, x = 0, y = 24, className, ...rest
}: { children: ReactNode; delay?: number; x?: number; y?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({ title, subtitle, center = true }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <FadeIn className={`mb-12 ${center ? 'text-center' : ''}`}>
      <h2 className="section-title">{title}</h2>
      <div className={`mt-2 h-[3px] w-16 rounded-full bg-gold ${center ? 'mx-auto' : ''}`} />
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </FadeIn>
  )
}

const gradients = [
  'from-blush via-cream-200 to-gold-300',
  'from-plum-400/60 via-blush to-cream-200',
  'from-gold-300 via-cream-200 to-blush',
  'from-cream-300 via-blush to-plum-400/50',
  'from-blush via-gold-300/70 to-cream-200',
]

/** A real photo (lazy-loaded) or a soft gradient placeholder. */
export function Photo({ src, alt, index = 0, className = '' }: { src: string; alt: string; index?: number; className?: string }) {
  if (src) {
    return <img src={asset(src)} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />
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
