import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { content } from '../data/content'
import { FadeIn, Photo, SectionHeader, tilt } from './ui'

const heights = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-square']

export default function Gallery() {
  const { title, subtitle, photos } = content.gallery
  const [open, setOpen] = useState<number | null>(null)
  const [dir, setDir] = useState(0)

  const go = useCallback((d: number) => {
    setDir(d)
    setOpen((o) => (o === null ? o : (o + d + photos.length) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  return (
    <section id="gallery" className="section">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="columns-2 gap-4 sm:gap-6 md:columns-3">
        {photos.map((p, i) => (
          <FadeIn key={i} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid sm:mb-7">
            <button
              onClick={() => { setDir(0); setOpen(i) }}
              className="polaroid block w-full !p-2 !pb-9 text-left transition-transform duration-300 hover:!rotate-0 hover:scale-[1.03] sm:!p-3 sm:!pb-11"
              style={{ rotate: `${tilt(i + 3, 4)}deg` }}
              aria-label={`Open photo: ${p.caption}`}
            >
              <div className={`${heights[i % heights.length]} overflow-hidden`}>
                <Photo src={p.photo} alt={p.caption} index={i} />
              </div>
              <p className="mt-2 text-center font-hand text-xl leading-none text-plum sm:text-2xl">{p.caption}</p>
            </button>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-plum-900/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog" aria-modal="true"
          >
            <button className="absolute right-3 top-3 h-12 w-12 rounded-full bg-white/10 text-2xl text-cream-100" aria-label="Close">✕</button>
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.figure
                key={open}
                custom={dir}
                initial={{ opacity: 0, x: dir * 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -120 }}
                transition={{ duration: 0.3 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7} onDragEnd={onDragEnd}
                onClick={(e) => e.stopPropagation()}
                className="polaroid w-full max-w-md cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <Photo src={photos[open].photo} alt={photos[open].caption} index={open} className="pointer-events-none bg-cream-200 !object-contain" />
                </div>
                <figcaption className="mt-3 text-center font-hand text-3xl text-plum">{photos[open].caption}</figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 text-cream-100" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => go(-1)} className="h-12 w-12 rounded-full bg-white/10 text-xl" aria-label="Previous">←</button>
              <span className="text-sm tabular-nums">{open + 1} / {photos.length}</span>
              <button onClick={() => go(1)} className="h-12 w-12 rounded-full bg-white/10 text-xl" aria-label="Next">→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
