import { content } from '../data/content'
import { FadeIn, SectionHeader, tilt } from './ui'

const notes = ['bg-[#FFF3B8]', 'bg-blush', 'bg-[#E8DCF2]', 'bg-gold-300', 'bg-[#FDE2C8]', 'bg-cream-200']

export default function Messages() {
  const { title, subtitle, list } = content.messages
  return (
    <section id="messages" className="section">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m, i) => (
          <FadeIn key={i} delay={(i % 3) * 0.1}>
            <figure
              className={`relative min-h-[11rem] p-6 pt-8 shadow-paper ${notes[i % notes.length]}`}
              style={{ rotate: `${tilt(i + 11, 3)}deg` }}
            >
              <span aria-hidden className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-plum-400 shadow-[inset_-2px_-2px_0_rgba(0,0,0,.2)]" />
              <blockquote className="font-hand text-[26px] leading-snug text-plum-700">{m.message}</blockquote>
              <figcaption className="mt-4 text-right text-sm font-semibold text-plum-500">— {m.name}</figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
