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
