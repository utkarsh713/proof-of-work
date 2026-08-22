import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, PlayCircle, ChevronDown } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp.js'

const HEADLINE_LINES = [
  [{ text: 'PUBLIC ' }, { text: 'WORK.', accent: true }],
  [{ text: 'PUBLIC ' }, { text: 'PROOF.', accent: true }],
]

const lineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
}

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

function StatRow({ label, value, decimals = 0, suffix = '' }) {
  const display = useCountUp(value, true, { duration: 1800, decimals })
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl text-text-primary tabular-nums">
        {display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </div>
      <div className="font-mono-label text-[10px] tracking-widest2 text-text-secondary uppercase mt-1">
        {label}
      </div>
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.28])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-bg"
    >
      {/* Video background */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video
          className="media-cover media-fallback"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/hero-poster.jpg"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/50 to-bg"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-bg/60" />
      <div className="grain" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-center pt-20"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="font-mono-label text-[11px] tracking-widest2 text-accent uppercase">
              Public Infrastructure • Verified
            </span>
          </motion.div>

          <h1 className="font-display font-semibold leading-[0.95] text-[clamp(2.8rem,8vw,6rem)] tracking-tightest">
            {HEADLINE_LINES.map((line, i) => (
              <motion.div
                key={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="overflow-hidden flex"
              >
                {line.map((word, j) => (
                  <span key={j} className="overflow-hidden inline-block">
                    <motion.span
                      variants={wordVariants}
                      className={`inline-block ${word.accent ? 'text-accent' : 'text-text-primary'}`}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-7 text-text-secondary text-base md:text-lg max-w-md leading-relaxed"
          >
            Every public project leaves a trail. We make that evidence visible, verifiable, and accessible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2.5 bg-accent text-bg px-7 py-3.5 font-mono-label text-[11px] tracking-widest2 uppercase font-medium hover:bg-text-primary transition-colors"
            >
              Explore Projects
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 border border-border px-7 py-3.5 font-mono-label text-[11px] tracking-widest2 uppercase text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <PlayCircle size={15} />
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Floating status panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-24 md:bottom-16 right-0 md:right-6 w-[calc(100%-3rem)] sm:w-[320px] bg-surface/80 backdrop-blur-sm border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="font-mono-label text-[10px] tracking-widest2 text-text-secondary uppercase">
              Live Infrastructure Network
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <StatRow label="Active Projects" value={2847} />
            <StatRow label="Verified Evidence" value={18492} />
            <div className="col-span-2">
              <StatRow label="Transparency Score" value={94} suffix="%" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-6 md:left-10 z-10 flex items-center gap-2"
      >
        <span className="font-mono-label text-[10px] tracking-widest2 text-text-secondary uppercase">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} className="text-accent" />
        </motion.span>
      </motion.div>
    </section>
  )
}
