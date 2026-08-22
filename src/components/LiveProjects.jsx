import { motion } from 'framer-motion'
import { MapPin, ArrowRight, FileCheck2 } from 'lucide-react'

const PROJECTS = [
  {
    num: '01',
    title: 'SECTOR 18 ROAD DEVELOPMENT',
    location: 'Noida, Uttar Pradesh',
    progress: 82,
    evidence: 148,
    status: 'On Track',
  },
  {
    num: '02',
    title: 'METRO EXTENSION PROJECT',
    location: 'Delhi NCR',
    progress: 64,
    evidence: 96,
    status: 'In Progress',
  },
  {
    num: '03',
    title: 'WATER PIPELINE UPGRADE',
    location: 'Urban Infrastructure',
    progress: 91,
    evidence: 213,
    status: 'Near Completion',
  },
]

function ProjectCard({ project, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group border border-border p-7 hover:border-accent/50 transition-colors duration-300 bg-surface/40"
    >
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono-label text-xs text-text-secondary tabular-nums">
          {project.num}
        </span>
        <span className="font-mono-label text-[9px] tracking-widest2 uppercase text-accent border border-accent/30 px-2.5 py-1">
          {project.status}
        </span>
      </div>

      <h3 className="font-display font-semibold text-lg text-text-primary leading-snug mb-3">
        {project.title}
      </h3>

      <div className="flex items-center gap-1.5 mb-8">
        <MapPin size={12} className="text-text-secondary" />
        <span className="text-text-secondary text-xs">{project.location}</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono-label text-[9px] tracking-widest2 uppercase text-text-secondary">
            Progress
          </span>
          <span className="font-mono-label text-xs text-accent tabular-nums">{project.progress}%</span>
        </div>
        <div className="h-[3px] w-full bg-border">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-5 border-t border-border">
        <FileCheck2 size={12} className="text-accent" />
        <span className="text-text-secondary text-xs">
          Verified Evidence: <span className="text-text-primary">{project.evidence}</span>
        </span>
      </div>
    </motion.div>
  )
}

export default function LiveProjects() {
  return (
    <section id="projects" className="relative bg-bg-secondary py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <h2 className="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-text-primary">
            PUBLIC WORK,
            <br />
            MADE VISIBLE.
          </h2>
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 font-mono-label text-xs tracking-widest2 uppercase text-text-primary hover:text-accent transition-colors shrink-0"
          >
            View All Projects
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.num} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
