import ContactSection from '../components/ContactSection'
import HeroSection from '../components/HeroSection'
import MethaneSpotlight from '../components/MethaneSpotlight'
import Ticker from '../components/Ticker'
import VideoWalkthrough from '../components/VideoWalkthrough'
import Declaration from '../components/declaration/Declaration'

export default function HomePage({ onContactOpen }) {
  return (
    <>
      <HeroSection onContactOpen={onContactOpen} />
      <Ticker />
      <div className="nexus-story">
        <VideoWalkthrough />
        <Declaration />
        <MethaneSpotlight />
      </div>
      <ContactSection onContactOpen={onContactOpen} />
    </>
  )
}
