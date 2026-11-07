import { CONTACT_INFO } from '../utils/contact'

export default function ContactOverlay({ isOpen, onClose }) {
  if (isOpen) {
    return (
      <div className="contact-overlay">
        <div className="co-bg" onClick={onClose} />
        <div className="co-panel">
          <div className="co-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="rgba(200,168,75,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="section-label">Contact</div>
            <div className="co-heading">
              Get
              <br />
              <span>In Touch</span>
            </div>
          </div>
          <p className="co-desc">
            We're actively seeking municipal partners, technology collaborators, and institutional
            investors aligned with the circular economy transition. If you're building for Epoch B,
            let's talk.
          </p>
          <div className="co-divider" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.4rem',
            }}
          >
            <div className="co-field">
              <div className="co-field-label">Email</div>
              <a href={`mailto:${CONTACT_INFO.email}`} className="co-field-value">
                {CONTACT_INFO.email}
              </a>
            </div>
            <div className="co-field">
              <div className="co-field-label">Phone</div>
              <a href={CONTACT_INFO.phoneHref} className="co-field-value">
                {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
            <div className="co-field">
              <div className="co-field-label">Location</div>
              <div
                className="co-field-value"
                style={{
                  color: 'var(--text-sub)',
                  fontSize: '0.95rem',
                }}
              >
                {CONTACT_INFO.addressLines[0]}
                <br />
                {CONTACT_INFO.addressLines[1]}
              </div>
            </div>
          </div>
          <div className="co-divider" />
          <div className="co-field">
            <div className="co-field-label">Project</div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                lineHeight: 1.6,
              }}
            >
              PROJECT AETHELRED
              <br />
              NEXUSBIOFORCE.COM
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
