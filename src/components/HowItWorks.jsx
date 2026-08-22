import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Camera, ShieldCheck, Activity, BadgeCheck } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    title: 'REPORT',
    desc: 'Citizen or project teams upload photos, videos, location, and project updates.',
    Icon: Camera,
  },
  {
    num: '02',
    title: 'VERIFY',
    desc: 'AI and verification systems analyze submitted evidence.',
    Icon: ShieldCheck,
  },
  {
    num: '03',
    title: 'TRACK',
    desc: 'Progress is organized into visible milestones.',
    Icon: Activity,
  },
  {
    num: '04',
    title: 'PROVE',
    desc: 'Citizens and authorities can access transparent project evidence.',
    Icon: BadgeCheck,
  },
]

function Step({ step, i }) {
  const ref = useRef(null)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-6 pt-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-4xl md:text-5xl font-semibold text-text-primary/15 tabular-nums">
          {step.num}
        </span>
        <div className="w-11 h-11 border border-border flex items-center justify-center">
          <step.Icon size={18} className="text-accent" />
        </div>
      </div>
      <div>
        <h3 className="font-mono-label text-sm tracking-widest2 uppercase text-text-primary mb-3">
          {step.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 60%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="how-it-works" ref={sectionRef} className="relative bg-bg-secondary py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-[11px] tracking-widest2 text-accent uppercase block mb-5"
        >
          The Process
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-text-primary mb-20"
        >
          HOW PROOF-OF-WORK WORKS
        </motion.h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-[4.6rem] left-0 right-0 h-[1px] bg-border hidden md:block" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute top-[4.6rem] left-0 right-0 h-[1px] bg-accent origin-left hidden md:block"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {STEPS.map((step, i) => (
              <Step key={step.num} step={step} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
