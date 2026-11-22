import { content } from '../data/content'

export default function Footer({ onReplay }: { onReplay: () => void }) {
  return (
    <footer className="border-t border-plum/10 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-12 text-center">
      <button onClick={onReplay} className="btn-gold">🎉 {content.footer.replay}</button>
      <p className="mt-6 text-sm text-plum-400">
        {content.footer.madeWith} <span className="font-hand text-xl text-plum">{content.yourName}</span>
      </p>
    </footer>
  )
}
