export const CONTACT_INFO = {
  email: 'info@nexusbioforce.com',
  phoneDisplay: '+1 (832) 647-1227',
  phoneHref: 'tel:+18326471227',
  addressLines: ['18511 Beaumont Hwy', 'Houston, TX 77049'],
}

export function buildInquiryMailto({
  name = '',
  org = '',
  email = '',
  type: i = '',
  message = '',
}) {
  const s = `Website inquiry${i ? ` — ${i}` : ''}${org ? ` — ${org}` : ''}`
  const a = [
    message.trim(),
    '',
    '—',
    `Name: ${name.trim()}`,
    org.trim() ? `Organization: ${org.trim()}` : null,
    `Email: ${email.trim()}`,
    i ? `Stakeholder type: ${i}` : null,
  ].filter((o) => o !== null).join(`
`)
  return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(a)}`
}

/** Nexus Bioforce social accounts — shown in the contact section, contact panel, menu and footer. */
export const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', handle: '@nexusbioforce', href: 'https://www.instagram.com/nexusbioforce/' },
  { id: 'youtube', label: 'YouTube', handle: '@BrandonReeves-x5i', href: 'https://www.youtube.com/@BrandonReeves-x5i' },
  { id: 'x', label: 'X', handle: '@Nexus_Bioforce1', href: 'https://x.com/Nexus_Bioforce1' },
  { id: 'spotify', label: 'Spotify', handle: 'Resources Revolution podcast', href: 'https://open.spotify.com/show/7DK9DbvSirKuHQeVRHheUy' },
]
