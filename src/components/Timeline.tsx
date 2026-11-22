import { content } from '../data/content'
import { FadeIn, Photo, SectionHeader, tilt } from './ui'

export default function Timeline() {
  const { title, subtitle, memories } = content.timeline
  return (
    <section id="story" className="section">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="relative">
        {/* the line: left on mobile, centred on desktop */}
        <div aria-hidden className="absolute bottom-0 left-4 top-0 w-[2px] bg-gradient-to-b from-gold/0 via-gold to-gold/0 md:left-1/2 md:-translate-x-1/2" />
        <ol className="space-y-14">
          {memories.map((m, i) => {
            const right = i % 2 === 1
            return (
              <li key={i} className="relative md:grid md:grid-cols-2 md:gap-14">
                <span aria-hidden className="absolute left-4 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-cream bg-gold shadow md:left-1/2" />
                <FadeIn
                  x={right ? 60 : -60}
                  y={0}
                  className={`pl-12 md:pl-0 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}
                >
                  <article
                    className="polaroid tape relative inline-block w-full max-w-sm !pb-6 text-left"
                    style={{ rotate: `${tilt(i, 2.5)}deg` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <Photo src={m.photo} alt={m.title} index={i} />
                    </div>
                    <div className="px-1 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{m.date}</p>
                      <h3 className="mt-1 font-hand text-3xl leading-tight text-plum">{m.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-plum-400">{m.caption}</p>
                    </div>
                  </article>
                </FadeIn>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
