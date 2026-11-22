import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { asset, content } from '../data/content'
import { lockScroll } from '../lib/smooth'
import { closeSurprise, onSurpriseChange } from '../lib/surprise'

/** Full-screen surprise "page": the image pops in; its sound is handled by lib/music. */
export default function SurpriseView() {
  const [open, setOpen] = useState(false)
  useEffect(() => onSurpriseChange(setOpen), [])
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const prev = document.title
    document.title = 'Your surprise gift 🎁'
    return () => { lockScroll(false); document.title = prev }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="surprise"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[85] flex flex-col items-center justify-center gap-6 bg-[#ED1C24] p-6"
          role="dialog" aria-modal="true" aria-label="Your surprise gift"
        >
          <motion.img
            src={asset(content.finale.surpriseImage)}
            alt="Your surprise gift"
            initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}
            className="max-h-[80svh] w-full max-w-[480px] rounded-2xl object-contain"
          />
          <button
            onClick={closeSurprise}
            className="press min-h-[48px] rounded-full border-2 border-cream-100/70 px-6 py-3 font-semibold text-cream-100"
          >
            ← Back to your birthday page
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
