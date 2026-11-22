import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { asset, content } from '../data/content'

/** Images worth having ready before the curtain lifts. */
const critical = [content.reveal.photo, ...content.timeline.memories.slice(0, 2).map((m) => m.photo)].filter(Boolean)

function preload(src: string) {
  return new Promise<void>((res) => {
    const img = new Image()
    img.onload = img.onerror = () => res()
    img.src = asset(src)
    img.decode?.().then(() => res(), () => res())
  })
}

/** Small cake + initials loader. Calls onDone once fonts & first images are ready. */
export default function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    let finished = false
    const finish = () => { if (!finished) { finished = true; onDone() } }
    const minTime = new Promise((r) => setTimeout(r, 1500))
    const ready = Promise.all([document.fonts?.ready ?? Promise.resolve(), ...critical.map(preload)])
    Promise.all([minTime, ready]).then(finish)
    const cap = setTimeout(finish, 4500) // never hold the gift hostage on slow data
    return () => clearTimeout(cap)
  }, [onDone])

  const initial = content.friendName.charAt(0)
  return (
    <motion.div
      key="loader"
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-plum-900 text-cream-100"
      role="status"
      aria-label="Loading your gift"
    >
      <div className="relative h-28 w-28">
        {/* candle flame */}
        <div className="absolute inset-x-0 top-0 flex justify-center">
        <motion.div
          className="h-5 w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-gold to-[#FFF1C1]"
          style={{ boxShadow: '0 0 24px 6px rgba(231,205,138,.55)', transformOrigin: '50% 100%' }}
          animate={{ scaleY: [1, 1.18, 0.92, 1.1, 1], rotate: [-3, 3, -2, 2, -3] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        </div>
        <div className="absolute left-1/2 top-5 h-6 w-1.5 -translate-x-1/2 rounded-sm bg-cream-200" />
        {/* cake */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom' }}
          className="relative flex h-[68px] w-24 items-center justify-center rounded-t-xl rounded-b-md bg-gradient-to-b from-gold-300 to-gold-600 shadow-[0_12px_30px_-8px_rgba(201,162,75,.6)]"
        >
          <div className="absolute inset-x-0 top-0 h-4 rounded-t-xl bg-cream-100 [clip-path:polygon(0_0,100%_0,100%_60%,88%_100%,76%_55%,62%_100%,50%_60%,38%_100%,24%_55%,12%_100%,0_60%)]" />
          <span className="mt-3 font-hand text-4xl font-bold text-plum-900">{initial}</span>
        </motion.div>
        </div>
      </div>
      <div className="mt-10 h-[2px] w-32 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full w-full origin-left bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }} />
      </div>
    </motion.div>
  )
}
