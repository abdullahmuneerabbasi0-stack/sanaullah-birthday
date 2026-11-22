import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { content } from '../data/content'
import { sprinkle } from '../hooks/confetti'
import { SectionHeader } from './ui'

export default function Quiz() {
  const { title, subtitle, questions, results } = content.quiz
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const done = step >= questions.length
  const q = questions[step]

  const choose = (o: number) => {
    if (picked !== null) return
    setPicked(o)
    if (o === q.answer) setScore((s) => s + 1)
  }
  const next = () => {
    const nextStep = step + 1
    setPicked(null)
    setStep(nextStep)
    if (nextStep >= questions.length) setTimeout(sprinkle, 250)
  }
  const restart = () => { setStep(0); setScore(0); setPicked(null) }
  const result = results.find((r) => score >= r.min) ?? results[results.length - 1]

  return (
    <section id="quiz" className="section">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-lg rounded-3xl border border-plum/10 bg-cream-100/90 p-6 shadow-paper sm:p-9">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center justify-between text-sm text-plum-400">
                <span>Question {step + 1} of {questions.length}</span>
                <span className="flex gap-1">
                  {questions.map((_, k) => (
                    <span key={k} className={`h-2 w-2 rounded-full ${k < step ? 'bg-gold' : k === step ? 'bg-plum' : 'bg-plum/15'}`} />
                  ))}
                </span>
              </div>
              <h3 className="mt-5 font-hand text-4xl leading-tight text-plum">{q.q}</h3>
              <div className="mt-6 grid gap-3">
                {q.options.map((opt, o) => {
                  const isRight = picked !== null && o === q.answer
                  const isWrong = picked === o && o !== q.answer
                  return (
                    <motion.button
                      key={o}
                      onClick={() => choose(o)}
                      animate={isWrong ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      disabled={picked !== null}
                      className={`min-h-[52px] rounded-2xl border px-5 py-3 text-left text-[16px] font-medium transition-colors
                        ${isRight ? 'border-emerald-600/40 bg-emerald-50 text-emerald-900' : ''}
                        ${isWrong ? 'border-rose-500/40 bg-rose-50 text-rose-900' : ''}
                        ${!isRight && !isWrong ? 'border-plum/15 bg-white/70 text-plum enabled:active:scale-[.98] enabled:hover:border-gold' : ''}
                        ${picked !== null && !isRight && !isWrong ? 'opacity-50' : ''}`}
                    >
                      {opt} {isRight && '✓'} {isWrong && '✗'}
                    </motion.button>
                  )
                })}
              </div>
              <AnimatePresence>
                {picked !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-hand text-2xl text-plum-500">{picked === q.answer ? q.right : q.wrong}</p>
                    <button onClick={next} className="btn-gold shrink-0">{step === questions.length - 1 ? 'See my result' : 'Next →'}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-gold-600">You scored</p>
              <p className="font-hand text-8xl leading-none text-plum">{score}<span className="text-5xl text-plum-400">/{questions.length}</span></p>
              <h3 className="mt-4 font-hand text-4xl text-plum">{result.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-plum-400">{result.text}</p>
              <button onClick={restart} className="btn-ghost mt-8">Try again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
