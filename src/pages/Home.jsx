import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import TrustBar from '../components/TrustBar.jsx'
import InfrastructureShowcase from '../components/InfrastructureShowcase.jsx'
import BeforeAfter from '../components/BeforeAfter.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Gallery from '../components/Gallery.jsx'
import LiveProjects from '../components/LiveProjects.jsx'
import Impact from '../components/Impact.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import CursorDot from '../components/CursorDot.jsx'

export default function Home() {
  return (
    <div className="bg-bg text-text-primary font-body">
      <ScrollProgress />
      <CursorDot />
      <Navbar />
      <Hero />
      <TrustBar />
      <InfrastructureShowcase />
      <BeforeAfter />
      <HowItWorks />
      <Gallery />
      <LiveProjects />
      <Impact />
      <FinalCTA />
      <Footer />
    </div>
  )
}
