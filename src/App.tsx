import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import CountdownGate from './components/CountdownGate'
import Finale from './components/Finale'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Messages from './components/Messages'
import MusicToggle from './components/MusicToggle'
import Quiz from './components/Quiz'
import Reasons from './components/Reasons'
import Reveal from './components/Reveal'
import Timeline from './components/Timeline'
import { burst } from './hooks/confetti'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [revealKey, setRevealKey] = useState(0)

  const open = () => {
    setOpened(true)
    window.scrollTo(0, 0)
    setTimeout(burst, 250)
  }
  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { setRevealKey((k) => k + 1); burst() }, 600)
  }

  return (
    <>
      <AnimatePresence>{!opened && <CountdownGate onOpen={open} />}</AnimatePresence>
      {opened && (
        <main>
          <Reveal key={revealKey} />
          <Timeline />
          <Gallery />
          <Reasons />
          <Quiz />
          <Messages />
          <Finale />
          <Footer onReplay={replay} />
          <MusicToggle />
        </main>
      )}
    </>
  )
}
