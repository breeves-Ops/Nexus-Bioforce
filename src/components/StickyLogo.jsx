import { Link, useLocation } from 'react-router-dom'

export default function StickyLogo() {
  const { pathname } = useLocation()
  const e = () => {
    var t
    if (pathname === '/') {
      if ((t = document.getElementById('nexus-hero')) != null) {
        t.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }
  return (
    <Link to="/" className="sticky-logo" aria-label="Nexus Bioforce — home" onClick={e}>
      <img
        className="logo-emblem"
        src="/brand/emblem-96.webp"
        srcSet="/brand/emblem-96.webp 1x, /brand/emblem-192.webp 2x"
        width="48"
        height="48"
        alt=""
        decoding="async"
      />
      <div className="logo-wordmark">
        <span className="logo-nexus">NEXUS</span>
        <span className="logo-bio">BIOFORCE</span>
      </div>
    </Link>
  )
}
