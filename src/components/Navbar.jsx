import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Evidence', href: '#evidence' },
  { label: 'Impact', href: '#impact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'bg-bg/85 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-[76px] flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <span className="font-display text-sm font-semibold tracking-tight text-bg bg-accent w-9 h-9 flex items-center justify-center">
            P/W
          </span>
          <span className="font-mono-label text-[11px] tracking-widest2 text-text-secondary group-hover:text-text-primary transition-colors hidden sm:inline">
            PROOF-OF-WORK
          </span>
        </a>

        {/* Center nav — desktop */}
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setActive(item.href)}
                className={`nav-underline font-mono-label text-[11px] tracking-widest2 uppercase transition-colors ${
                  active === item.href ? 'text-text-primary active' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions — desktop */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="#sign-in" className="font-mono-label text-[11px] tracking-widest2 uppercase text-text-secondary hover:text-text-primary transition-colors">
            Sign In
          </a>
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono-label text-[11px] tracking-widest2 uppercase text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            View Platform
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden text-text-primary"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-bg border-b border-border"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => {
                      setActive(item.href)
                      setMobileOpen(false)
                    }}
                    className="font-mono-label text-xs tracking-widest2 uppercase text-text-secondary hover:text-text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="hairline" />
              <li>
                <a href="#sign-in" className="font-mono-label text-xs tracking-widest2 uppercase text-text-secondary">
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono-label text-xs tracking-widest2 uppercase text-accent w-fit"
                >
                  View Platform <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
