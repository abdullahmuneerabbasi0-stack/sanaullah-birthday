import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import CountdownGate from './components/CountdownGate'
import Cursor from './components/Cursor'
import Curtain from './components/Curtain'
import Finale from './components/Finale'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Loader from './components/Loader'
import Messages from './components/Messages'
import MusicToggle from './components/MusicToggle'
import Quiz from './components/Quiz'
import Reasons from './components/Reasons'
import Reveal from './components/Reveal'
import ScrollProgress from './components/ScrollProgress'
import Timeline from './components/Timeline'
import { burst } from './hooks/confetti'
import { playMusic } from './lib/music'
import { scrollToTop, startSmoothScroll } from './lib/smooth'

type Stage = 'loading' | 'gate' | 'open'

export default function App() {
  const reduce = !!useReducedMotion()
  const [stage, setStage] = useState<Stage>('loading')
  const [revealKey, setRevealKey] = useState(0)
  const [curtain, setCurtain] = useState(false)

  const loaded = useCallback(() => setStage('gate'), [])

  const open = () => {
    playMusic() // must run inside the tap itself so phones allow the audio
    window.scrollTo(0, 0)
    setCurtain(true)
    setStage('open')
    setTimeout(burst, reduce ? 300 : 1500)
    setTimeout(() => setCurtain(false), reduce ? 700 : 2400)
  }

  useEffect(() => { if (stage === 'open') startSmoothScroll() }, [stage])

  const replay = () => {
    scrollToTop()
    setTimeout(() => { setRevealKey((k) => k + 1); burst() }, 1200)
  }

  return (
    <>
      <div aria-hidden className="grain" />
      <Ambient />
      <Cursor />
      <AnimatePresence>{stage === 'loading' && <Loader onDone={loaded} />}</AnimatePresence>
      <AnimatePresence>{stage === 'gate' && <CountdownGate onOpen={open} />}</AnimatePresence>
      {curtain && <Curtain reduce={reduce} />}
      {stage === 'open' && (
        <>
          <ScrollProgress />
          <main>
            <Reveal key={revealKey} start={revealKey === 0 ? (reduce ? 0.2 : 1.45) : 0.1} />
            <Timeline />
            <Gallery />
            <Reasons />
            <Quiz />
            <Messages />
            <Finale />
          </main>
          <Footer onReplay={replay} />
          <MusicToggle />
        </>
      )}
    </>
  )
}

/** Soft colour washes behind everything, fixed so they don't repaint on scroll. */
function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[20%] -top-[15%] h-[70vh] w-[70vh] rounded-full bg-blush/40 blur-[90px]" />
      <div className="absolute -right-[25%] top-[30%] h-[60vh] w-[60vh] rounded-full bg-gold-300/25 blur-[100px]" />
      <div className="absolute -bottom-[20%] left-[10%] h-[50vh] w-[50vh] rounded-full bg-plum-400/10 blur-[90px]" />
    </div>
  )
}
