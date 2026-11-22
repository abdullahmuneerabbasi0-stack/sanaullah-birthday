import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const interactive = 'a, button, [role="button"], input, label, [data-cursor]'

/** Small dot that trails the mouse and grows over clickable things. Desktop (fine pointer) only. */
export default function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine) and (hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY); setVisible(true)
      setHover(!!(e.target as Element)?.closest?.(interactive))
    }
    const leave = () => setVisible(false)
    const d = () => setDown(true)
    const u = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', d)
    window.addEventListener('pointerup', u)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', d)
      window.removeEventListener('pointerup', u)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: hover ? 44 : 10, height: hover ? 44 : 10,
        opacity: visible ? 1 : 0,
        scale: down ? 0.8 : 1,
        backgroundColor: hover ? 'rgba(201,162,75,0.18)' : 'rgba(74,29,63,0.9)',
        boxShadow: hover ? 'inset 0 0 0 1.5px rgba(201,162,75,1)' : 'inset 0 0 0 0px rgba(201,162,75,0)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    />
  )
}
