import { useState } from 'react'
import { Link } from 'react-router-dom'
import MethaneMap from '../components/methane/MethaneMap'
import StatCards from '../components/methane/StatCards'
import { EMISSION_TIERS, emissionColor, nearestSite } from '../components/methane/emissionScale'
import { HOUSTON_LANDFILLS } from '../data/houstonLandfills'
import useMethanePlumes from '../hooks/useMethanePlumes'
import './MethaneTracker.css'

function DetectionList({
  plumes,
  landfills,
  selectedPlumeId,
  onSelectPlume,
  loading,
  error
}) {
  const n = [...plumes].sort((s, a) => (a.dateObserved || '').localeCompare(s.dateObserved || ''));
  if (loading) {
    return <div className="mt-list-empty">Fetching live satellite detections…</div>;
  } else if (error) {
    return <div className="mt-list-empty mt-list-empty--error">
        Couldn't reach the Carbon Mapper feed. Retrying automatically.
      </div>;
  } else if (n.length === 0) {
    return <div className="mt-list-empty">
        No CH₄ plumes detected in the Houston bounding box for the selected window.
      </div>;
  } else {
    return <div className="mt-list" role="list">
        {n.map(s => {
        const a = nearestSite(s.lat, s.lng, landfills);
        return <button key={s.id} className={`mt-list-row${s.id === selectedPlumeId ? ' mt-list-row--active' : ''}`} onClick={() => onSelectPlume == null ? undefined : onSelectPlume(s.id)}>
              <span className="mt-list-dot" style={{
            background: emissionColor(s.emissionKgH)
          }} />
              <span className="mt-list-body">
                <span className="mt-list-title">
                  {a ? a.site.name : s.sectorLabel}
                  {a && a.distanceKm > 3 && <em>{' (regional)'}</em>}
                </span>
                <span className="mt-list-meta">
                  {new Date(s.dateObserved).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
                  {' · '}
                  {s.emissionKgH != null ? `${Math.round(s.emissionKgH).toLocaleString()} kg/hr` : 'estimate withheld'}
                  {' · '}
                  {s.sectorLabel}
                </span>
              </span>
            </button>;
      })}
      </div>;
  }
}

export default function MethaneTrackerPage() {
  const {
    plumes,
    totalCount,
    loading,
    error,
    lastUpdated,
    refresh
  } = useMethanePlumes();
  const [n, s] = useState(null);
  return <div className="methane-tracker-page">
      <section className="section section--dark mt-hero">
        <div className="container">
          <div className="section-label">Nexus Bioforce · Live Monitoring</div>
          <h1 className="h2">
            Houston Landfill
            <br />
            Methane Tracker
          </h1>
          <p className="mt-hero-copy">
            Real-time satellite surveillance of methane emissions across Greater Houston's municipal
            landfills — the exact liability class Nexus Bioforce converts into structural feedstock.
            Plume detections are pulled directly from{' '}
            <a href="https://carbonmapper.org" target="_blank" rel="noreferrer">
              Carbon Mapper
            </a>
            's public catalog (Tanager satellite, EMIT, GHGSat, and airborne AVIRIS-NG instruments)
            and refresh automatically every 5 minutes.
          </p>
          <Link to="/" className="mt-back-link">
            ← Back to Nexus Bioforce
          </Link>
        </div>
      </section>
      <section className="section section--card mt-body">
        <div className="container">
          <StatCards plumes={plumes} totalCount={totalCount} lastUpdated={lastUpdated} loading={loading} error={error} />
          <div className="mt-grid">
            <div className="mt-map-panel">
              <MethaneMap landfills={HOUSTON_LANDFILLS} plumes={plumes} selectedPlumeId={n} onSelectPlume={s} />
              <div className="mt-legend">
                <div className="mt-legend-group">
                  <span className="mt-legend-swatch mt-legend-swatch--landfill" />
                  Active landfill
                  <span className="mt-legend-swatch mt-legend-swatch--landfill mt-legend-swatch--dim" />
                  Closed / post-closure
                </div>
                <div className="mt-legend-group">
                  {EMISSION_TIERS.map(a => <span key={a.label} className="mt-legend-item">
                      <span className="mt-legend-dot" style={{
                    background: a.color
                  }} />
                      {a.label}
                    </span>)}
                </div>
              </div>
            </div>
            <aside className="mt-sidebar">
              <div className="mt-sidebar-header">
                <h3>Recent detections</h3>
                <button className="mt-refresh-btn" onClick={refresh} disabled={loading}>
                  {loading ? 'Loading…' : 'Refresh'}
                </button>
              </div>
              <DetectionList plumes={plumes} landfills={HOUSTON_LANDFILLS} selectedPlumeId={n} onSelectPlume={s} loading={loading} error={error} />
            </aside>
          </div>
          <div className="mt-attribution">
            <p>
              {'Plume detections: '}
              <a href="https://carbonmapper.org" target="_blank" rel="noreferrer">
                Carbon Mapper
              </a>
              {', a nonprofit methane & CO₂ point-source monitoring program (public catalog API, updated as new satellite/airborne overpasses are processed). Landfill locations: TCEQ Municipal Solid Waste Sites & Landfills dataset via Houston-Galveston Area Council (H-GAC). Emission rates are automated estimates ('}
              <code>emission_auto</code>) with associated uncertainty and are not verified
              regulatory measurements.
            </p>
          </div>
        </div>
      </section>
    </div>;
}
