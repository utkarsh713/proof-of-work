import { Github, Linkedin, Twitter } from 'lucide-react'

const LINKS = ['Platform', 'Projects', 'Evidence', 'How It Works', 'About']

export default function Footer() {
  return (
    <footer className="relative bg-bg border-t border-border pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 pb-12">
          <a href="#home" className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold text-bg bg-accent w-9 h-9 flex items-center justify-center">
              P/W
            </span>
            <span className="font-mono-label text-[11px] tracking-widest2 text-text-secondary">
              PROOF-OF-WORK
            </span>
          </a>

          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#home"
                  className="font-mono-label text-[11px] tracking-widest2 uppercase text-text-secondary hover:text-accent transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a href="#" aria-label="Github" className="text-text-secondary hover:text-accent transition-colors">
              <Github size={17} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-text-secondary hover:text-accent transition-colors">
              <Linkedin size={17} />
            </a>
            <a href="#" aria-label="Twitter / X" className="text-text-secondary hover:text-accent transition-colors">
              <Twitter size={17} />
            </a>
          </div>
        </div>

        <div className="hairline mb-8" />

        <div className="flex flex-col sm:flex-row justify-between gap-3 text-text-secondary text-xs font-mono-label tracking-wide">
          <span>© 2026 Proof-of-Work.</span>
          <span>Transparency through verifiable evidence.</span>
        </div>
      </div>
    </footer>
  )
}
