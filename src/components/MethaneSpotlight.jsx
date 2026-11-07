import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  bodyStyle,
  dividerStyle,
  eyebrowStyle,
  headingStyle,
  innerStyle,
  sectionStyle,
} from './declaration/declarationStyles'
import StatCards from './methane/StatCards'
import { HOUSTON_LANDFILLS } from '../data/houstonLandfills'
import useMethanePlumes from '../hooks/useMethanePlumes'
import '../pages/MethaneTracker.css'

const MethaneMap = lazy(() => import('./methane/MethaneMap.jsx'))

function useNearViewport(n = '400px') {
  const e = useRef(null)
  const [t, i] = useState(false)
  useEffect(() => {
    const r = e.current
    if (!r || t) {
      return
    }
    const s = new IntersectionObserver(
      ([a]) => {
        if (a.isIntersecting) {
          i(true)
          s.disconnect()
        }
      },
      {
        rootMargin: n,
      },
    )
    s.observe(r)
    return () => s.disconnect()
  }, [n, t])
  return [e, t]
}

export default function MethaneSpotlight() {
  const { plumes, totalCount, loading, error, lastUpdated } = useMethanePlumes()
  const [s, a] = useState(null)
  const [o, c] = useNearViewport()
  return (
    <section
      id="methane-tracker"
      data-nexus-section="methane"
      style={sectionStyle}
      className="mt-spotlight"
    >
      <div style={innerStyle}>
        <div className="nd2-eyebrow" style={eyebrowStyle}>
          LIVE DATA · SATELLITE METHANE MONITORING
        </div>
        <h2 className="nd2-heading" style={headingStyle}>
          Houston Landfill
          <br />
          Methane Tracker
        </h2>
        <div className="nd2-divider" style={dividerStyle} />
        <p style={bodyStyle}>
          Real-time satellite surveillance of methane plumes across Greater Houston's municipal
          landfills — the exact liability class Nexus Bioforce converts into feedstock. Detections
          are pulled live from{' '}
          <a
            href="https://carbonmapper.org"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#00e5c8',
            }}
          >
            Carbon Mapper
          </a>
          's public catalog and refresh every five minutes.
        </p>
        <div
          style={{
            marginTop: '2.5rem',
          }}
        >
          <StatCards
            plumes={plumes}
            totalCount={totalCount}
            lastUpdated={lastUpdated}
            loading={loading}
            error={error}
          />
        </div>
        <div ref={o} className="mt-map-panel mt-spotlight-map">
          {c ? (
            <Suspense fallback={<div className="mt-spotlight-map-placeholder">Loading map…</div>}>
              <MethaneMap
                landfills={HOUSTON_LANDFILLS}
                plumes={plumes}
                selectedPlumeId={s}
                onSelectPlume={a}
                scrollWheelZoom={false}
              />
            </Suspense>
          ) : (
            <div className="mt-spotlight-map-placeholder">Loading map…</div>
          )}
        </div>
        <div
          style={{
            marginTop: '2rem',
          }}
        >
          <Link to="/methane-tracker" className="cta-primary">
            Open the full live tracker →
          </Link>
        </div>
      </div>
    </section>
  )
}
