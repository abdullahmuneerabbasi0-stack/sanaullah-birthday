import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { content } from '../data/content'
import { lockScroll } from '../lib/smooth'
import { Photo, SectionHeader, tilt } from './ui'

const heights = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-square']
const zoom = { type: 'spring', stiffness: 260, damping: 30 } as const

export default function Gallery() {
  const { title, subtitle, photos } = content.gallery
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const [entry, setEntry] = useState<number | null>(null) // the thumbnail we zoomed from
  const [dir, setDir] = useState(0)

  const go = useCallback((d: number) => {
    setDir(d)
    setOpen((o) => (o === null ? o : (o + d + photos.length) % photos.length))
  }, [photos.length])

  const show = (i: number) => { setDir(0); setEntry(i); setOpen(i) }
  const close = () => setOpen(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    lockScroll(true)
    window.addEventListener('keydown', onKey)
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey) }
  }, [open, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
    else if (info.offset.y > 120) close()
  }

  const shared = open !== null && open === entry

  return (
    <section id="gallery" className="section">
      <SectionHeader index={2} title={title} subtitle={subtitle} />
      <LayoutGroup>
        <div className="columns-2 gap-4 sm:gap-7 md:columns-3">
          {photos.map((p, i) => {
            const r = tilt(i + 3, 4)
            return (
              <div key={i} className="mb-6 break-inside-avoid sm:mb-9">
                <motion.button
                  onClick={() => show(i)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -70, scale: 1.18, rotate: r * 3 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotate: r }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ type: 'spring', stiffness: 170, damping: 17, mass: 0.9, delay: (i % 3) * 0.07, opacity: { duration: 0.35 } }}
                  whileHover={reduce ? undefined : { y: -8, scale: 1.035, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  whileTap={{ scale: 0.97, y: -4 }}
                  className="polaroid group block w-full !p-2 !pb-9 text-left sm:!p-3 sm:!pb-11"
                  aria-label={`Open photo: ${p.caption}`}
                >
                  <motion.div
                    layoutId={`g-${i}`}
                    transition={zoom}
                    className={`${heights[i % heights.length]} overflow-hidden bg-cream-200`}
                    style={{ opacity: shared && entry === i ? 0 : 1 }}
                  >
                    <Photo src={p.photo} alt={p.caption} index={i} />
                  </motion.div>
                  <p className="mt-2.5 px-1 text-center font-hand text-[1.3rem] leading-[1.05] text-plum sm:text-2xl">{p.caption}</p>
                </motion.button>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {open !== null && (
            <motion.div
              key="lightbox"
              className="fixed inset-0 z-[65] flex flex-col items-center justify-center p-4"
              role="dialog" aria-modal="true" aria-label="Photo viewer"
            >
              <motion.div
                className="absolute inset-0 bg-plum-900/90 backdrop-blur-md"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                onClick={close}
              />
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.figure
                  key={open}
                  initial={shared ? { opacity: 0, scale: 0.97 } : { opacity: 0, x: dir * 140, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={open === entry ? { opacity: 0 } : { opacity: 0, x: dir * -140, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.6} onDragEnd={onDragEnd}
                  className="polaroid relative w-full max-w-md cursor-grab touch-none !pb-6 active:cursor-grabbing"
                >
                  <motion.div
                    layoutId={open === entry ? `g-${open}` : undefined}
                    transition={zoom}
                    className="aspect-[4/5] overflow-hidden bg-cream-200"
                  >
                    <Photo src={photos[open].photo} alt={photos[open].caption} index={open} eager className="pointer-events-none !object-contain" />
                  </motion.div>
                  <motion.figcaption
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="mt-4 text-center font-hand text-3xl text-plum"
                  >
                    {photos[open].caption}
                  </motion.figcaption>
                </motion.figure>
              </AnimatePresence>
              <motion.button
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                onClick={close}
                className="press absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-cream-100 backdrop-blur"
                aria-label="Close"
              >
                ✕
              </motion.button>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-0 right-0 flex items-center justify-center gap-6 text-cream-100"
              >
                <button onClick={() => go(-1)} className="press h-12 w-12 rounded-full bg-white/10 text-xl backdrop-blur" aria-label="Previous photo">←</button>
                <span className="min-w-[3.5rem] text-center text-sm tabular-nums text-cream-200/80">{open + 1} / {photos.length}</span>
                <button onClick={() => go(1)} className="press h-12 w-12 rounded-full bg-white/10 text-xl backdrop-blur" aria-label="Next photo">→</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  )
}
