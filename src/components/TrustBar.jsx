import { motion } from 'framer-motion'

const WORDS = ['EVIDENCE.', 'ACCOUNTABILITY.', 'TRANSPARENCY.']

export default function TrustBar() {
  return (
    <section className="relative bg-bg py-20 md:py-28 border-t border-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="hairline origin-left mb-14"
        />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <h2 className="font-display font-semibold text-[clamp(2rem,6vw,4.2rem)] leading-[0.95] tracking-tightest">
            {WORDS.map((word, i) => (
              <span key={word} className="flex items-center gap-4">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="text-text-primary"
                >
                  {word}
                </motion.span>
                {i < WORDS.length - 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mb-3 shrink-0" />
                )}
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-text-secondary max-w-xs text-sm md:text-base leading-relaxed shrink-0"
          >
            A digital layer connecting public infrastructure with verifiable ground-level reality.
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hairline origin-right mt-14"
        />
      </div>
    </section>
  )
}
