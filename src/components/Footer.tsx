import { motion } from 'framer-motion'
import { content } from '../data/content'

export default function Footer({ onReplay }: { onReplay: () => void }) {
  return (
    <footer className="relative mt-8 px-5 pb-[max(3rem,env(safe-area-inset-bottom))] pt-16 text-center">
      <div aria-hidden className="mx-auto mb-12 flex max-w-xs items-center gap-4 text-gold">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="text-sm">✦</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      <button onClick={onReplay} className="btn-gold">
        <motion.span aria-hidden animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}>🎉</motion.span>
        {content.footer.replay}
      </button>
      <p className="mt-7 text-sm text-plum-500/80">
        {content.footer.madeWith} <span className="font-hand text-2xl text-plum">{content.yourName}</span>
      </p>
    </footer>
  )
}
