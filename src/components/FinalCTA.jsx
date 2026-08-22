import { motion } from 'framer-motion'
import { ArrowRight, UploadCloud } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative bg-bg-secondary py-32 md:py-44 overflow-hidden border-t border-border">
      {/* Ambient animated background */}
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(183,211,107,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="grain" />

      <div className="relative max-w-[1000px] mx-auto px-6 md:px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-semibold text-[clamp(2rem,6vw,4.2rem)] leading-[1.05] tracking-tightest text-text-primary"
        >
          IF THE WORK IS REAL,
          <br />
          <span className="text-accent">THE PROOF SHOULD BE TOO.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-text-secondary mt-7 max-w-md mx-auto leading-relaxed"
        >
          Join a new standard of transparency for public infrastructure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-11 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 bg-accent text-bg px-8 py-4 font-mono-label text-[11px] tracking-widest2 uppercase font-medium hover:bg-text-primary transition-colors"
          >
            Explore the Platform
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#submit"
            className="group inline-flex items-center gap-2.5 border border-border px-8 py-4 font-mono-label text-[11px] tracking-widest2 uppercase text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            <UploadCloud size={15} />
            Submit Evidence
          </a>
        </motion.div>
      </div>
    </section>
  )
}
