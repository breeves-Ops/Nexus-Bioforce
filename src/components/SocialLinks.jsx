/**
 * Row of links to the Nexus Bioforce social accounts. Each opens in a new tab.
 * `className` lets each placement (contact, panel, menu, footer) adjust spacing.
 */
import { SOCIAL_LINKS } from '../utils/contact'

export default function SocialLinks({ className = '', onNavigate }) {
  return (
    <ul className={`social-links ${className}`.trim()}>
      {SOCIAL_LINKS.map(({ id, label, handle, href }) => (
        <li key={id}>
          <a
            className="social-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${label} — ${handle}`}
            aria-label={`Nexus Bioforce on ${label} (opens in a new tab)`}
            onClick={onNavigate}
          >
            {label}
            <span className="social-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
