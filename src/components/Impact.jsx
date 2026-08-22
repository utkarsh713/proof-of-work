import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp.js'

const STATS = [
  { value: 18, decimals: 0, suffix: 'K+', label: 'Verified Submissions' },
  { value: 2.8, decimals: 1, suffix: 'K', label: 'Active Projects' },
  { value: 94, decimals: 0, suffix: '%', label: 'Transparency Score' },
  { value: 12, decimals: 0, suffix: '', label: 'Infrastructure Categories' },
]

function StatBlock({ stat, i, start }) {
  const value = useCountUp(stat.value, start, { duration: 1800 + i * 150, decimals: stat.decimals })
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      className="border-l border-border pl-6"
    >
      <div className="font-display font-semibold text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-text-primary tabular-nums">
        {value.toLocaleString('en-US', {
          minimumFractionDigits: stat.decimals,
          maximumFractionDigits: stat.decimals,
        })}
        <span className="text-accent">{stat.suffix}</span>
      </div>
      <div className="font-mono-label text-[10px] tracking-widest2 uppercase text-text-secondary mt-4">
        {stat.label}
      </div>
    </motion.div>
  )
}

export default function Impact() {
  const [inView, setInView] = useState(false)

  return (
    <section id="impact" className="relative bg-bg py-28 md:py-36 border-t border-border overflow-hidden">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F2F3EF 1px, transparent 1px), linear-gradient(to bottom, #F2F3EF 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, amount: 0.4 }}
        className="relative max-w-[1400px] mx-auto px-6 md:px-10"
      >
        <div className="mb-16 max-w-xl">
          <span className="font-mono-label text-[11px] tracking-widest2 text-accent uppercase block mb-5">
            Measured Impact
          </span>
          <h2 className="font-display font-semibold text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] tracking-tightest text-text-primary">
            A network built on measurable trust.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {STATS.map((stat, i) => (
            <StatBlock key={stat.label} stat={stat} i={i} start={inView} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
