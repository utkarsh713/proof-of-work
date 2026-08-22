import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Calendar, ShieldCheck, GripVertical } from 'lucide-react'

export default function BeforeAfter() {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e) => {
    dragging.current = true
    updatePos(e.clientX ?? e.touches?.[0]?.clientX)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    updatePos(e.clientX ?? e.touches?.[0]?.clientX)
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <section className="relative bg-bg py-28 md:py-36 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-text-primary"
          >
            FROM CLAIM
            <br />
            TO PROOF.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-text-secondary leading-relaxed max-w-md"
          >
            Infrastructure progress should not rely only on reports. Compare what existed before with what has been completed.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          ref={containerRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden select-none cursor-ew-resize border border-border"
        >
          {/* AFTER (base layer, full) */}
          <img
            src="/assets/afterRoad.jpg"
            alt="Road development after completion"
            className="media-cover media-fallback"
            draggable={false}
          />
          <span className="absolute top-5 right-5 font-mono-label text-[10px] tracking-widest2 uppercase bg-bg/60 backdrop-blur-sm px-3 py-1.5 text-accent border border-white/10">
            After
          </span>

          {/* BEFORE (clipped layer) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <img
              src="/assets/beforeRoad.jpg"
              alt="Road development before construction"
              className="media-cover media-fallback"
              draggable={false}
            />
            <span className="absolute top-5 left-5 font-mono-label text-[10px] tracking-widest2 uppercase bg-bg/60 backdrop-blur-sm px-3 py-1.5 text-text-secondary border border-white/10">
              Before
            </span>
          </div>

          <div className="grain" />

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-accent"
            style={{ left: `${pos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <GripVertical size={16} className="text-bg" />
            </div>
          </div>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 border-t border-border pt-8 flex flex-wrap gap-y-6 gap-x-12 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-accent" />
            <span className="font-mono-label text-xs tracking-widest2 uppercase text-text-primary">
              Sector 18 Road Development
            </span>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-accent" />
              <div>
                <div className="font-mono-label text-[9px] tracking-widest2 text-text-secondary uppercase">Status</div>
                <div className="text-sm text-text-primary">Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" />
              <div>
                <div className="font-mono-label text-[9px] tracking-widest2 text-text-secondary uppercase">Verification</div>
                <div className="text-sm text-text-primary">AI + Citizen Evidence</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-accent" />
              <div>
                <div className="font-mono-label text-[9px] tracking-widest2 text-text-secondary uppercase">Last Updated</div>
                <div className="text-sm text-text-primary">Recently Verified</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
