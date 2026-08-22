import { motion } from 'framer-motion'
import { Navigation, TrainFront, Droplets } from 'lucide-react'

const PANELS = [
  {
    index: '01',
    category: 'Road Infrastructure',
    video: '/assets/road.mp4',
    title: 'REAL-TIME PROGRESS',
    desc: 'Ground evidence. Verified milestones.',
    Icon: Navigation,
  },
  {
    index: '02',
    category: 'Urban Mobility',
    video: '/assets/metro.mp4',
    title: 'TRACKING WHAT MOVES CITIES',
    desc: 'Monitor construction progress and public impact.',
    Icon: TrainFront,
  },
  {
    index: '03',
    category: 'Water Infrastructure',
    video: '/assets/water.mp4',
    title: 'EVERY CONNECTION COUNTS',
    desc: 'Documenting progress from the ground up.',
    Icon: Droplets,
  },
]

function Panel({ panel, reverse }) {
  const { index, category, video, title, desc, Icon } = panel
  return (
    <div
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-stretch gap-8 md:gap-14`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:w-3/5 aspect-[16/10] overflow-hidden group"
      >
        <video
          className="media-cover media-fallback transition-transform duration-700 ease-out group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
        <div className="grain" />
        <div className="absolute top-5 left-5 flex items-center gap-2 border border-white/15 bg-bg/50 backdrop-blur-sm px-3 py-1.5">
          <Icon size={13} className="text-accent" />
          <span className="font-mono-label text-[10px] tracking-widest2 text-text-primary uppercase">
            {category}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-2/5 flex flex-col justify-center"
      >
        <span className="font-mono-label text-xs tracking-widest2 text-accent uppercase mb-4">
          {index} / {category}
        </span>
        <h3 className="font-display font-semibold text-2xl md:text-3xl leading-tight mb-4 text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-sm">
          {desc}
        </p>
      </motion.div>
    </div>
  )
}

export default function InfrastructureShowcase() {
  return (
    <section id="evidence" className="relative bg-bg-secondary py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-20 md:mb-28 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono-label text-[11px] tracking-widest2 text-accent uppercase block mb-5"
          >
            Infrastructure in Motion
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-text-primary"
          >
            THE WORK SHOULD
            <br />
            SPEAK FOR ITSELF.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary mt-6 max-w-lg leading-relaxed"
          >
            From roads and metros to water infrastructure, every project deserves transparent proof of progress.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {PANELS.map((panel, i) => (
            <Panel key={panel.index} panel={panel} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
