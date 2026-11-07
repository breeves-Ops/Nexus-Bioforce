import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SocialLinks from './SocialLinks'

const REVOLUTION_LINKS = [
  {
    id: 'nexus-hero',
    label: 'Home',
  },
  {
    id: 'the-declaration',
    label: 'The Declaration',
  },
  {
    id: 'the-problem',
    label: 'The Collapse',
  },
  {
    id: 'the-site',
    label: 'Project Aethelred',
  },
  {
    id: 'the-technology',
    label: 'The Technology',
  },
]

const ECONOMY_LINKS = [
  {
    id: 'the-economy',
    label: 'Bio-Token Economy',
  },
  {
    id: 'the-alliance',
    label: 'Amazon Alliance',
  },
  {
    id: 'the-state',
    label: 'State of Texas',
  },
  {
    id: 'the-factory',
    label: 'Sentient Factory',
  },
  {
    id: 'the-financials',
    label: 'Financials',
  },
]

export default function MenuDrawer({ onContactOpen }) {
  const [e, t] = useState(false)
  const i = useNavigate()
  const r = useLocation()
  const s = (a) => {
    t(false)
    const o = () => {
      var c
      if ((c = document.getElementById(a)) == null) {
        return undefined
      } else {
        return c.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
    if (r.pathname !== '/') {
      i('/')
      setTimeout(o, 150)
    } else {
      setTimeout(o, 50)
    }
  }
  return (
    <div className="menu-wrapper">
      <button
        className={`menu-btn${e ? ' open' : ''}`}
        onClick={() => t((a) => !a)}
        aria-label={e ? 'Close menu' : 'Open menu'}
      >
        <span className="menu-bar" />
        <span className="menu-bar" />
        <span className="menu-bar" />
      </button>
      <nav className={`nav-drawer${e ? ' open' : ''}`}>
        <div className="nav-backdrop" onClick={() => t(false)} />
        <div className="nav-panel">
          <div className="nav-cols">
            <div className="nav-col">
              <div className="nav-col-label">The Revolution</div>
              {REVOLUTION_LINKS.map(({ id, label }) => (
                <a key={id} className="nav-link" onClick={() => s(id)}>
                  {label}
                </a>
              ))}
            </div>
            <div className="nav-col">
              <div className="nav-col-label">The Economy</div>
              {ECONOMY_LINKS.map(({ id, label }) => (
                <a key={id} className="nav-link" onClick={() => s(id)}>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="nav-live">
            <div className="nav-col-label">Live Data</div>
            <Link
              className="nav-link nav-link--live"
              to="/methane-tracker"
              onClick={() => t(false)}
            >
              <span className="nav-live-dot" aria-hidden="true" />
              Houston Methane Tracker
            </Link>
          </div>
          <div className="nav-social">
            <div className="nav-col-label">Follow Nexus</div>
            <SocialLinks onNavigate={() => t(false)} />
          </div>
          <div className="nav-footer">
            <button
              className="nav-cta-primary"
              onClick={() => {
                t(false)
                onContactOpen()
              }}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
