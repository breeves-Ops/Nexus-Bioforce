import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_TAGS = [
  'Project Aethelred',
  'Amazon Alliance',
  'State of Texas',
  'Bio-Token Economy',
  'SILVIA AI',
]

const HERO_STATS = [
  {
    num: '$1.93B',
    label: 'Annual Revenue (Base)',
  },
  {
    num: '22,000 MT',
    label: 'Graphene / Year',
  },
  {
    num: '6,000 MT',
    label: 'Green Hydrogen / Year',
  },
  {
    num: '3,000 K',
    label: 'FJH Operating Temp',
  },
]

export default function HeroSection({ onContactOpen }) {
  const e = useRef(null)
  useEffect(() => {
    const t = gsap.context(() => {
      gsap
        .timeline({
          defaults: {
            ease: 'power3.out',
          },
        })
        .fromTo(
          '.hero-eyebrow',
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          0.3,
        )
        .fromTo(
          '.hero-title-1',
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          0.6,
        )
        .fromTo(
          '.hero-title-2',
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          0.8,
        )
        .fromTo(
          '.hero-sub',
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          1.1,
        )
        .fromTo(
          '.hero-tags',
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          1.3,
        )
        .fromTo(
          '.hero-ctas',
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          1.5,
        )
        .fromTo(
          '.hero-stats',
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          1.7,
        )
      gsap.to('.hero-content', {
        opacity: 0,
        y: -80,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: e.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: 1.2,
        },
      })
    }, e)
    return () => t.revert()
  }, [])
  return (
    <section ref={e} style={heroStyles.section} id="nexus-hero" data-nexus-section="hero">
      <div className="hero-content" style={heroStyles.content}>
        <div className="hero-eyebrow" style={heroStyles.eyebrow}>
          Houston, Texas · 2026 · Founded by Brandon Reeves
        </div>
        <h1 style={heroStyles.h1wrap}>
          <span className="hero-title-1" style={heroStyles.titleLine1}>
            NEXUS BIOFORCE
          </span>
          <span className="hero-title-2" style={heroStyles.titleLine2}>
            RESOURCE REVOLUTION
          </span>
        </h1>
        <p className="hero-sub" style={heroStyles.sub}>
          The world's first Circular Sovereign Economy — converting Houston's municipal waste into
          graphene, green hydrogen, carbon-negative power, and the Digital Currency of Environmental
          Redemption.
        </p>
        <div className="hero-tags" style={heroStyles.tags}>
          {HERO_TAGS.map((t) => (
            <span key={t} style={heroStyles.tag}>
              {t}
            </span>
          ))}
        </div>
        <div className="hero-ctas" style={heroStyles.ctas}>
          <button onClick={onContactOpen} style={heroStyles.btnPrimary}>
            Get Involved
          </button>
          <a href="#nexus-declaration" style={heroStyles.btnOutline}>
            Read the Declaration ↓
          </a>
        </div>
        <div className="hero-stats" style={heroStyles.statsRow}>
          {HERO_STATS.map(({ num, label }) => (
            <div key={label} style={heroStyles.stat}>
              <span style={heroStyles.statNum}>{num}</span>
              <span style={heroStyles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={heroStyles.scrollHint}>
        <span style={heroStyles.scrollLine} />
        <span style={heroStyles.scrollText}>scroll</span>
      </div>
    </section>
  )
}

const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10vh 2rem 6vh',
    zIndex: 2,
    textAlign: 'center',
  },
  content: {
    maxWidth: '1000px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.6rem',
  },
  eyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#00e5c8',
    opacity: 0.75,
  },
  h1wrap: {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1em',
    alignItems: 'center',
  },
  titleLine1: {
    display: 'block',
    fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
    fontSize: 'clamp(3rem, 9vw, 8rem)',
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 0.95,
    color: '#ffffff',
    textShadow: '0 0 80px rgba(0,229,200,0.18)',
  },
  titleLine2: {
    display: 'block',
    fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
    fontSize: 'clamp(1.6rem, 4.5vw, 4rem)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    lineHeight: 1,
    color: 'rgba(195,210,225,0.85)',
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)',
    lineHeight: 1.7,
    color: 'rgba(200,220,228,0.78)',
    maxWidth: '62ch',
    margin: 0,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  tag: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(0,229,200,0.7)',
    border: '1px solid rgba(0,229,200,0.2)',
    borderRadius: '3px',
    padding: '3px 10px',
  },
  ctas: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #00e5c8 0%, #00b8a0 100%)',
    color: '#04100e',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnOutline: {
    padding: '12px 32px',
    background: 'transparent',
    color: 'rgba(0,229,200,0.8)',
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    borderRadius: '4px',
    border: '1px solid rgba(0,229,200,0.25)',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'border-color 0.2s, color 0.2s',
  },
  statsRow: {
    display: 'flex',
    gap: '0',
    flexWrap: 'wrap',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(0,229,200,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '800px',
    backdropFilter: 'blur(12px)',
  },
  stat: {
    flex: '1 1 160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    padding: '1.4rem 1.2rem',
    borderRight: '1px solid rgba(0,229,200,0.08)',
  },
  statNum: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
    fontWeight: 800,
    color: '#00e5c8',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(180,200,210,0.5)',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.4,
  },
  scrollLine: {
    display: 'block',
    width: '1px',
    height: '40px',
    background: 'linear-gradient(to bottom, transparent, #00e5c8)',
    animation: 'scrollPulse 2s ease-in-out infinite',
  },
  scrollText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#00e5c8',
  },
}
