import confetti from 'canvas-confetti'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { content } from '../data/content'
import { sprinkle } from '../hooks/confetti'
import { SectionHeader, ease } from './ui'

function popAt(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  confetti({
    particleCount: 26, spread: 60, startVelocity: 22, scalar: 0.7, ticks: 90, gravity: 0.9,
    origin: { x: (r.left + r.width * 0.85) / innerWidth, y: (r.top + r.height / 2) / innerHeight },
    colors: ['#C9A24B', '#E7CD8A', '#34A37A', '#FFFBF3'],
  })
}

function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion()
  const v = useMotionValue(0)
  const rounded = useTransform(v, (n) => Math.round(n))
  useEffect(() => {
    const c = animate(v, to, { duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 })
    return () => c.stop()
  }, [to, v, reduce])
  return <motion.span>{rounded}</motion.span>
}

export default function Quiz() {
  const { title, subtitle, questions, results } = content.quiz
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const done = step >= questions.length
  const q = questions[step]
  const progress = (step + (picked !== null ? 1 : 0)) / questions.length

  const choose = (o: number, el: HTMLElement) => {
    if (picked !== null) return
    setPicked(o)
    if (o === q.answer) { setScore((s) => s + 1); popAt(el) }
    if ('vibrate' in navigator) navigator.vibrate?.(o === q.answer ? 12 : [8, 40, 8])
  }
  const next = () => {
    const nextStep = step + 1
    setPicked(null)
    setStep(nextStep)
    if (nextStep >= questions.length) setTimeout(sprinkle, 500)
  }
  const restart = () => { setStep(0); setScore(0); setPicked(null) }
  const result = results.find((r) => score >= r.min) ?? results[results.length - 1]

  return (
    <section id="quiz" className="section">
      <SectionHeader index={4} title={title} subtitle={subtitle} />
      <div className="card-elevated relative mx-auto max-w-lg overflow-hidden p-6 sm:p-10">
        {/* progress */}
        <div className="absolute inset-x-0 top-0 h-1 bg-plum/[.06]">
          <motion.div
            className="h-full w-full origin-left bg-gradient-to-r from-gold-600 via-gold to-gold-300"
            initial={false}
            animate={{ scaleX: done ? 1 : progress }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          />
        </div>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease }}
            >
              <div className="flex items-center justify-between text-[13px] font-medium text-plum-500/80">
                <span>Question {step + 1} of {questions.length}</span>
                <span className="tabular-nums text-gold-600">{score} ✓</span>
              </div>
              <h3 className="mt-5 font-hand text-[2.4rem] leading-[1.05] text-plum">{q.q}</h3>
              <div className="mt-7 grid gap-3">
                {q.options.map((opt, o) => {
                  const isRight = picked !== null && o === q.answer
                  const isWrong = picked === o && o !== q.answer
                  const dim = picked !== null && !isRight && !isWrong
                  return (
                    <motion.button
                      key={o}
                      onClick={(e) => choose(o, e.currentTarget)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isWrong ? { opacity: 1, y: 0, x: [0, -10, 9, -6, 4, 0] }
                        : isRight ? { opacity: 1, y: 0, scale: [1, 1.04, 1] }
                        : { opacity: dim ? 0.45 : 1, y: 0 }
                      }
                      transition={isWrong ? { duration: 0.45 } : isRight ? { duration: 0.4 } : { delay: picked === null ? 0.08 * o + 0.15 : 0, duration: 0.35 }}
                      disabled={picked !== null}
                      whileTap={picked === null ? { scale: 0.97 } : undefined}
                      className={`relative flex min-h-[54px] items-center justify-between overflow-visible rounded-2xl border px-5 py-3 text-left text-[16px] font-medium transition-[background-color,border-color,color] duration-300
                        ${isRight ? 'border-emerald-600/40 bg-emerald-50 text-emerald-900' : ''}
                        ${isWrong ? 'border-rose-500/40 bg-rose-50 text-rose-900' : ''}
                        ${!isRight && !isWrong ? 'border-plum/[.12] bg-white/80 text-plum enabled:hover:border-gold enabled:hover:bg-white' : ''}`}
                      style={{ boxShadow: '0 1px 2px rgba(74,29,63,.05)' }}
                    >
                      <span>{opt}</span>
                      {isRight && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>✓</motion.span>}
                      {isWrong && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✗</motion.span>}
                      {isRight && (
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-500"
                          initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.12 }} transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
              <AnimatePresence>
                {picked !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                    transition={{ duration: 0.45, ease }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-hand text-[1.6rem] leading-tight text-plum-500">{picked === q.answer ? q.right : q.wrong}</p>
                      <button onClick={next} className="btn-gold shrink-0">{step === questions.length - 1 ? 'See my result' : 'Next →'}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, ease }} className="py-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600">You scored</p>
              <p className="mt-2 font-hand text-[6.5rem] leading-none text-plum">
                <CountUp to={score} /><span className="text-5xl text-plum-400">/{questions.length}</span>
              </p>
              <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-4 font-hand text-4xl text-plum">{result.title}</motion.h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mx-auto mt-2 max-w-xs text-plum-500">{result.text}</motion.p>
              <button onClick={restart} className="btn-ghost mt-8">Try again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
