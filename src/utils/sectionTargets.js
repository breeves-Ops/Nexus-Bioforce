const SECTION_SELECTORS = {
  hero: ['.hero-section', '[data-section="hero"]'],
  ticker: ['.ticker-section', '.ticker-band'],
  numbers: ['.numbers-section', '[data-section="numbers"]'],
  crisis: ['.crisis-section', '[data-section="crisis"]'],
  solution: ['.solution-section', '[data-section="solution"]'],
  process: ['.process-section', '[data-section="process"]'],
  stakeholders: ['.stakeholders-section', '[data-section="stakeholders"]'],
  media: ['.media-section', '[data-section="media"]'],
  comparison: ['.comparison-section', '[data-section="comparison"]'],
  partners: ['.partners-section', '[data-section="partners"]'],
  credentials: ['.credentials-section', '[data-section="credentials"]'],
  contact: ['.contact-section', '.contact-footer', 'footer'],
}

export function findSectionElement(n) {
  let e = document.getElementById(`nexus-sec-${n.id}`)
  if (e) {
    return e
  }
  const t = SECTION_SELECTORS[n.id] || []
  for (const i of t) {
    e = document.querySelector(i)
    if (e) {
      e.id = `nexus-sec-${n.id}`
      return e
    }
  }
  if (
    n.componentName &&
    ((e = document.querySelector(`[class*="${n.componentName.toLowerCase()}"]`)), e)
  ) {
    e.id = `nexus-sec-${n.id}`
    return e
  } else {
    return null
  }
}
