# Proof-of-Work — Homepage

A cinematic, dark, editorial homepage for a public-infrastructure transparency
platform. Built with React + Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Adding your media

No video/image assets were provided with the brief, so every media slot
currently renders a dark placeholder (subtle grain + hatch pattern) instead
of a broken element. Drop your real files into `public/assets/` using the
exact filenames listed in `public/assets/README.md` — the components already
reference those paths, so nothing else needs to change.

## Structure

```
src/
├── assets/                 (unused — see public/assets instead)
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── TrustBar.jsx
│   ├── InfrastructureShowcase.jsx
│   ├── BeforeAfter.jsx
│   ├── HowItWorks.jsx
│   ├── Gallery.jsx
│   ├── LiveProjects.jsx
│   ├── Impact.jsx
│   ├── FinalCTA.jsx
│   ├── Footer.jsx
│   ├── MagneticButton.jsx
│   ├── CursorDot.jsx
│   └── ScrollProgress.jsx
├── hooks/
│   └── useCountUp.js
├── pages/
│   └── Home.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Design tokens

| Token | Value |
|---|---|
| Background | `#080A09` |
| Secondary Background | `#101311` |
| Surface | `#151916` |
| Border | `rgba(255,255,255,0.10)` |
| Primary Text | `#F2F3EF` |
| Secondary Text | `#A7ADA5` |
| Accent Green | `#B7D36B` |
| Dark Green | `#52613A` |
| Muted Orange | `#D88A4A` |

Typography: **Space Grotesk** (display/headings), **Inter** (body),
**IBM Plex Mono** (labels, eyebrows, data/numbers) — loaded via Google Fonts
in `index.html`.

## Notes

- Every scroll animation uses `whileInView`/`viewport={{ once: true }}` so
  nothing re-triggers awkwardly if the user scrolls back up.
- `prefers-reduced-motion` is respected globally in `index.css`.
- The before/after slider and count-up stats are hand-rolled (no extra
  dependencies) so the bundle stays lean for a hackathon demo.
