import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const ITEMS = [
  {
    src: '/assets/project-site.jpg',
    label: 'SITE VERIFICATION',
    sub: 'Verified project activity',
    size: 'large', // spans 2 cols, tall
  },
  {
    src: '/assets/citizen.jpg',
    label: 'CITIZEN EVIDENCE',
    sub: 'Ground-level reporting',
    size: 'medium',
  },
  {
    src: '/assets/infra.jpg',
    label: 'INFRASTRUCTURE MONITORING',
    sub: 'Project progress tracking',
    size: 'medium',
  },
  {
    src: '/assets/pipeline.jpg',
    label: 'UTILITY DEVELOPMENT',
    sub: 'Water and pipeline infrastructure',
    size: 'wide', // spans full width, short
  },
]

function Tile({ item, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden cursor-pointer ${className}`}
    >
      <img
        src={item.src}
        alt={item.label}
        className="media-cover media-fallback transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="grain" />
      <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between overflow-hidden">
        <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="font-mono-label text-[10px] tracking-widest2 text-accent uppercase mb-1">
            {item.label}
          </div>
          <div className="text-text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
            {item.sub}
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-text-primary shrink-0 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
        />
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [siteItem, citizenItem, infraItem, pipelineItem] = ITEMS

  return (
    <section className="relative bg-bg py-28 md:py-36 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono-label text-[11px] tracking-widest2 text-accent uppercase block mb-5">
            The Evidence Layer
          </span>
          <h2 className="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-text-primary">
            REALITY,
            <br />
            DOCUMENTED.
          </h2>
          <p className="text-text-secondary mt-6 leading-relaxed max-w-lg">
            From construction sites to public streets, every piece of evidence contributes to a clearer picture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[180px]">
          <Tile item={siteItem} className="md:col-span-2 md:row-span-2" />
          <Tile item={citizenItem} className="md:col-span-1 md:row-span-1" />
          <Tile item={infraItem} className="md:col-span-1 md:row-span-1" />
          <Tile item={pipelineItem} className="md:col-span-3 md:row-span-1" />
        </div>
      </div>
    </section>
  )
}
