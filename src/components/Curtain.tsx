import { motion } from 'framer-motion'

/** Cinematic beat between the gate and the reveal: screen dims, a warm light builds, then lifts. */
export default function Curtain({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center overflow-hidden bg-plum-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: reduce ? 0.1 : 1.35, duration: reduce ? 0.4 : 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      {!reduce && (
        <>
          <motion.div
            className="h-[60vmax] w-[60vmax] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,241,193,.95) 0%, rgba(231,205,138,.55) 25%, rgba(201,162,75,.18) 50%, transparent 70%)' }}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 3.2, opacity: 1 }}
            transition={{ delay: 0.25, duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          />
        </>
      )}
    </motion.div>
  )
}
