import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_INFO, buildInquiryMailto } from '../utils/contact'
import SocialLinks from './SocialLinks'

function useReveal(n = 0.1) {
  const e = useRef(null)
  useEffect(() => {
    const t = e.current
    if (!t) {
      return
    }
    const i = new IntersectionObserver(
      ([r]) => {
        if (r.isIntersecting) {
          t.classList.add('is-visible')
          i.unobserve(t)
        }
      },
      {
        threshold: n,
      },
    )
    i.observe(t)
    return () => i.disconnect()
  }, [n])
  return e
}

const FOOTER_LINKS = [
  {
    id: 'nexus-hero',
    label: 'Home',
  },
  {
    id: 'the-declaration',
    label: 'Declaration',
  },
  {
    id: 'the-technology',
    label: 'Technology',
  },
  {
    id: 'the-economy',
    label: 'Economy',
  },
  {
    id: 'the-financials',
    label: 'Financials',
  },
  {
    id: 'contact',
    label: 'Contact',
  },
]

const INQUIRY_TYPES = [
  'City / Municipality',
  'Tech / Data Center',
  'Federal / Defense',
  'Investor / Capital',
  'Media / Press',
  'Other',
]

export default function ContactSection() {
  const [n, e] = useState({
    name: '',
    org: '',
    email: '',
    type: '',
    message: '',
  })
  const [t, i] = useState(null)
  const r = useReveal(0.1)
  const s = useReveal(0.1)
  const a = (c) =>
    e((f) => ({
      ...f,
      [c.target.name]: c.target.value,
    }))
  const o = (c) => {
    c.preventDefault()
    const f = buildInquiryMailto(n)
    i(f)
    window.location.href = f
  }
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-info reveal-block" ref={r}>
            <div className="section-label">Contact</div>
            <div className="contact-heading">
              Ready for
              <br />
              <span className="gold">Epoch B?</span>
            </div>
            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-detail-label">Email</div>
                <a href={`mailto:${CONTACT_INFO.email}`} className="contact-detail-value">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-label">Phone</div>
                <a href={CONTACT_INFO.phoneHref} className="contact-detail-value">
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-label">Follow</div>
                <SocialLinks />
              </div>
              <div className="contact-detail">
                <div className="contact-detail-label">Facility</div>
                <div
                  className="contact-detail-value"
                  style={{
                    color: 'var(--text-sub)',
                    cursor: 'default',
                  }}
                >
                  {CONTACT_INFO.addressLines[0]}
                  <br />
                  {CONTACT_INFO.addressLines[1]}
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-label">Project</div>
                <div
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    lineHeight: 1.7,
                  }}
                >
                  PROJECT AETHELRED
                  <br />
                  NEXUSBIOFORCE.COM
                </div>
              </div>
            </div>
          </div>
          <div className="reveal-block" ref={s}>
            {t ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  padding: '3rem 2.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  background: 'var(--gold-04)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--f-head)',
                    fontSize: '2rem',
                    letterSpacing: '0.1em',
                    color: 'var(--gold)',
                  }}
                >
                  ALMOST THERE
                </div>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-sub)',
                    lineHeight: 1.7,
                  }}
                >
                  {
                    'Your email app should have opened with your message ready to go — press send to reach us. If nothing opened, '
                  }
                  <a
                    href={t}
                    style={{
                      color: 'var(--gold)',
                    }}
                  >
                    click here
                  </a>
                  {' or write to '}
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    style={{
                      color: 'var(--gold)',
                    }}
                  >
                    {CONTACT_INFO.email}
                  </a>
                  .
                </p>
                <button
                  className="cta-secondary"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.7em 1.8em',
                  }}
                  onClick={() => i(null)}
                >
                  Back to Form
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={o}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-input"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={n.name}
                      onChange={a}
                      required={true}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="org">
                      Organization
                    </label>
                    <input
                      className="form-input"
                      id="org"
                      name="org"
                      type="text"
                      placeholder="Company / Agency"
                      value={n.org}
                      onChange={a}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@organization.com"
                    value={n.email}
                    onChange={a}
                    required={true}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="type">
                    Stakeholder Type
                  </label>
                  <select className="form-select" id="type" name="type" value={n.type} onChange={a}>
                    <option value="">Select type…</option>
                    {INQUIRY_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="form-textarea"
                    id="message"
                    name="message"
                    placeholder="Tell us about your waste challenge, energy needs, or partnership interest…"
                    value={n.message}
                    onChange={a}
                    required={true}
                  />
                </div>
                <button type="submit" className="form-submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-links">
            {FOOTER_LINKS.map(({ id, label }) => (
              <a
                key={id}
                className="footer-link"
                onClick={() => {
                  var d
                  if ((d = document.getElementById(id)) == null) {
                    return undefined
                  } else {
                    return d.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                }}
              >
                {label}
              </a>
            ))}
            <Link className="footer-link" to="/methane-tracker">
              Methane Tracker
            </Link>
          </div>
          <div className="footer-end">
            <SocialLinks className="social-links--footer" />
            <div className="footer-copy">
              {'© '}
              {new Date().getFullYear()}
              {' Nexus Bioforce — Project Aethelred — Houston, Texas'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
