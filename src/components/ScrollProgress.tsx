import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

/** Thin gold line at the top, plus a little balloon rising along the right edge (desktop). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const balloonY = useTransform(p, [0, 1], ['0vh', '-72vh'])
  const sway = useTransform(p, (v) => Math.sin(v * 24) * 6)
  return (
    <>
      <motion.div aria-hidden style={{ scaleX: p }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-600 via-gold to-gold-300" />
      <div aria-hidden className="pointer-events-none fixed bottom-[12vh] right-5 z-[55] hidden h-[72vh] w-6 md:block">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-plum/10" />
        <motion.div style={{ y: balloonY, rotate: sway }} className="absolute bottom-0 left-1/2 -ml-3 origin-bottom">
          <Balloon className="h-10 w-6" color="#C9A24B" />
        </motion.div>
      </div>
    </>
  )
}

export function Balloon({ className = '', color = '#C9A24B' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 70" className={className} aria-hidden>
      <defs>
        <radialGradient id={`b${color.slice(1)}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".7" />
          <stop offset="25%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity=".85" />
        </radialGradient>
      </defs>
      <path d="M20 2C9 2 2 11 2 21c0 12 10 22 18 24 8-2 18-12 18-24C38 11 31 2 20 2z" fill={`url(#b${color.slice(1)})`} />
      <path d="M17 45l3 4 3-4z" fill={color} />
      <path d="M20 49c-3 6 3 10 0 20" stroke={color} strokeOpacity=".6" strokeWidth="1" fill="none" />
    </svg>
  )
}
