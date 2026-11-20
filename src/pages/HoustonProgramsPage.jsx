import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HOUSTON_PROGRAMS,
  PROGRAM_LOOPS,
  PROGRAMS_INTRO,
  PROGRAMS_JOIN,
} from '../data/houstonPrograms'
import { CONTACT_INFO } from '../utils/contact'
import './HoustonPrograms.css'

function ProgramCard({ program, index }) {
  const { id, name, subtitle, tag, description, focus } = program
  return (
    <article id={id} className={`hp-card${tag ? ' hp-card--flagship' : ''}`}>
      <div className="hp-card-top">
        <span className="hp-card-index">{String(index + 1).padStart(2, '0')}</span>
        {tag && <span className="hp-card-tag">{tag}</span>}
      </div>
      <h2 className="hp-card-name">{name}</h2>
      {subtitle && <div className="hp-card-subtitle">{subtitle}</div>}
      <p className="hp-card-desc">{description}</p>
      <div className="hp-card-focus">
        <div className="hp-card-focus-label">Program focus</div>
        <p>{focus.charAt(0).toUpperCase() + focus.slice(1)}</p>
      </div>
    </article>
  )
}

export default function HoustonProgramsPage({ onContactOpen }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="houston-programs-page">
      <section className="section section--dark hp-hero">
        <div className="container">
          <div className="section-label">Nexus Bioforce · Houston Circular City</div>
          <h1 className="h2">
            Houston
            <br />
            Programs
          </h1>
          <p className="hp-hero-copy">{PROGRAMS_INTRO}</p>
          <ul className="hp-loops" aria-label="The six loops">
            {PROGRAM_LOOPS.map((loop) => (
              <li key={loop}>{loop}</li>
            ))}
          </ul>
          <Link to="/" className="hp-back-link">
            ← Back to Nexus Bioforce
          </Link>
        </div>
      </section>

      <section className="section section--card hp-body">
        <div className="container">
          <div className="hp-grid">
            {HOUSTON_PROGRAMS.map((program, index) => (
              <ProgramCard key={program.id} program={program} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark hp-join">
        <div className="container hp-join-inner">
          <div className="section-label">Join the Ecosystem</div>
          <h2 className="h2 hp-join-heading">Build Houston’s circular future with us</h2>
          <p className="hp-join-copy">{PROGRAMS_JOIN}</p>
          <div className="hp-join-actions">
            <button type="button" className="cta-primary" onClick={onContactOpen}>
              Partner With Us
            </button>
            <a className="hp-join-contact" href={`mailto:${CONTACT_INFO.email}`}>
              {CONTACT_INFO.email}
            </a>
            <a className="hp-join-contact" href={CONTACT_INFO.phoneHref}>
              {CONTACT_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
