/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */
const THEME_PALETTES = {
  peacock: {
    accent: '#00e5c8',
    secondary: '#1a3fff',
    gold: '#c8a84b',
  },
  solar: {
    accent: '#f59e0b',
    secondary: '#dc4a1a',
    gold: '#c8a84b',
  },
  crystal: {
    accent: '#b57bee',
    secondary: '#1a3fff',
    gold: '#f0f4ff',
  },
  macaw: {
    accent: '#ff6b35',
    secondary: '#00e5c8',
    gold: '#ffd700',
  },
  water: {
    accent: '#00b4d8',
    secondary: '#0077b6',
    gold: '#90e0ef',
  },
  mycelium: {
    accent: '#80b918',
    secondary: '#55a630',
    gold: '#aacc00',
  },
}

const EFFECT_STYLES = {
  glassCard: (n) => `
    background: rgba(4,12,10,0.68);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border: 1px solid ${n.accent}22;
    border-radius: 4px;`,
  frostedRow: (n) => `
    background: linear-gradient(90deg, rgba(4,12,10,0.82) 0%, rgba(4,12,10,0.55) 100%);
    backdrop-filter: blur(12px);
    border-left: 2px solid ${n.accent};
    border-radius: 2px;`,
  fullBleed: (n) => `
    background: transparent;
    border-bottom: 1px solid ${n.accent}18;`,
  splitFeature: (n) => `
    background: linear-gradient(135deg, rgba(4,12,10,0.90) 0%, rgba(4,12,10,0.45) 100%);
    backdrop-filter: blur(20px) saturate(1.6);
    border: 1px solid ${n.gold}15;
    border-radius: 6px;`,
}

export const COMPONENT_TEMPLATES = {
  statBlock: {
    label: 'Stat Block',
    description: '2–3 column KPI grid with animated number counters',
    generate({ theme = 'peacock', effect = 'glassCard', content = '' }) {
      var a
      const i = THEME_PALETTES[theme] || THEME_PALETTES.peacock
      const r =
        ((a = EFFECT_STYLES[effect]) == null ? undefined : a.call(EFFECT_STYLES, i)) ||
        EFFECT_STYLES.glassCard(i)
      const s = `stat-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${s} — Stat Block (${theme}/${effect}) ──
// Content brief: ${content || 'Add KPI stats here'}

const STATS = [
{ value: '93.3%', label: 'Projected EBITDA Margin' },
{ value: '$1.9B', label: 'Annual Gross Revenue' },
{ value: '<9 mo', label: 'Capital Return Timeline' },
]

export default function ${s.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${s}"
style={{ padding: '80px 5vw', background: 'transparent', position: 'relative' }} >
<motion.div
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
viewport={{ once: true, margin: '-10%' }}
style={{ maxWidth: 960, margin: '0 auto' }} >
<span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: '${i.accent}',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 16,
        }}>
— SECTION LABEL
</span>

        <h2 style={{
          fontFamily: 'Barlow Condensed, Impact, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#f0f4ff',
          letterSpacing: '0.04em',
          margin: '0 0 48px',
          textShadow: '0 2px 20px rgba(0,0,0,0.6)',
        }}>
          NUMBERS THAT DON'T NEED SPIN.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                padding: '28px 24px',${r.replace(
                  /\n/g,
                  `
                `,
                )}
              }}
            >
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                color: '${i.accent}',
                marginBottom: 8,
                letterSpacing: '0.02em',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.05em',
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>

)
}
`
    },
  },
  featureRow: {
    label: 'Feature Row',
    description: 'Icon + title + body text, alternating layout',
    generate({ theme = 'solar', effect = 'frostedRow', content = '' }) {
      var a
      const i = THEME_PALETTES[theme] || THEME_PALETTES.solar
      const r =
        ((a = EFFECT_STYLES[effect]) == null ? undefined : a.call(EFFECT_STYLES, i)) ||
        EFFECT_STYLES.frostedRow(i)
      const s = `feature-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${s} — Feature Row (${theme}/${effect}) ──
// Content brief: ${content || 'Add feature items here'}

const FEATURES = [
{ icon: '01', title: 'First Feature', body: 'Describe the key value proposition here.' },
{ icon: '02', title: 'Second Feature', body: 'What makes this unique and compelling?' },
{ icon: '03', title: 'Third Feature', body: 'The measurable outcome or benefit.' },
]

export default function ${s.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${s}"
style={{ padding: '80px 5vw', background: 'transparent' }} >
<div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
{FEATURES.map((f, i) => (
<motion.div
key={i}
initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
viewport={{ once: true, margin: '-8%' }}
style={{
              display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px',${r.replace(
                /\n/g,
                `
              `,
              )}
            }} >
<span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              color: '${i.accent}',
              letterSpacing: '0.15em',
              minWidth: 28,
            }}>{f.icon}</span>
<div>
<h3 style={{
                fontFamily: 'Barlow Condensed, Impact, sans-serif',
                fontSize: '1.15rem',
                color: '#f0f4ff',
                letterSpacing: '0.08em',
                margin: '0 0 4px',
              }}>{f.title}</h3>
<p style={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.52)',
                margin: 0,
                lineHeight: 1.6,
              }}>{f.body}</p>
</div>
</motion.div>
))}
</div>
</section>
)
}
`
    },
  },
  heroSplit: {
    label: 'Hero Split',
    description: 'Large heading left, stats or media right',
    generate({ theme = 'peacock', effect = 'glassCard', content = '' }) {
      var a
      const i = THEME_PALETTES[theme] || THEME_PALETTES.peacock
      const r =
        ((a = EFFECT_STYLES[effect]) == null ? undefined : a.call(EFFECT_STYLES, i)) ||
        EFFECT_STYLES.glassCard(i)
      const s = `hero-split-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${s} — Hero Split (${theme}/${effect}) ──
// Content brief: ${content || 'Main hero heading + supporting stats'}

export default function ${s.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${s}"
style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '80px 5vw',
        background: 'transparent',
      }} >
<div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 320px',
        gap: 48, alignItems: 'center',
      }}>
<motion.div
initial={{ opacity: 0, y: 32 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} >
<span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
            letterSpacing: '0.2em', color: '${i.accent}',
            textTransform: 'uppercase', display: 'block', marginBottom: 20,
          }}>
— SECTION EYEBROW
</span>
<h1 style={{
            fontFamily: 'Barlow Condensed, Impact, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#f0f4ff', lineHeight: 0.92,
            letterSpacing: '0.02em', margin: '0 0 24px',
            textShadow: '0 2px 30px rgba(0,0,0,0.7)',
          }}>
MAIN HEADING<br />
<span style={{ color: '${i.accent}' }}>SECOND LINE</span>
</h1>
<p style={{
            fontFamily: 'DM Sans, Arial, sans-serif',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'rgba(255,255,255,0.55)', maxWidth: 520,
            lineHeight: 1.65, margin: '0 0 36px',
          }}>
Supporting paragraph text. Describe the value proposition concisely.
Two to three sentences maximum.
</p>
<div style={{ display: 'flex', gap: 12 }}>
<button style={{
              padding: '14px 32px',
              background: '${i.accent}',
              color: '#040c0a', border: 'none',
              fontFamily: 'Barlow Condensed, Impact, sans-serif',
              fontSize: '0.9rem', letterSpacing: '0.12em',
              cursor: 'pointer', borderRadius: 2,
            }}>
PRIMARY CTA
</button>
<button style={{
              padding: '14px 32px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'Barlow Condensed, Impact, sans-serif',
              fontSize: '0.9rem', letterSpacing: '0.12em',
              cursor: 'pointer', borderRadius: 2,
            }}>
SECONDARY CTA
</button>
</div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {['93.3%', '$1.9B', '<9 mo'].map((v, i) => (
            <div key={i} style={{
              padding: '20px 22px',${r.replace(
                /\n/g,
                `
              `,
              )}
            }}>
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                color: '${i.accent}', marginBottom: 6,
              }}>{v}</div>
              <div style={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.42)',
                letterSpacing: '0.04em',
              }}>Metric label here</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

)
}
`
    },
  },
  comparisonTable: {
    label: 'Comparison Table',
    description: 'Two-column epoch / before-after comparison',
    generate({ theme = 'crystal', effect = 'glassCard', content = '' }) {
      const i = THEME_PALETTES[theme] || THEME_PALETTES.crystal
      const r = `comparison-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${r} — Comparison Table (${theme}/${effect}) ──
// Content brief: ${content || 'Before/after or competing approaches'}

const ROWS = [
{ label: 'Category', before: 'Old approach value', after: 'New approach value' },
{ label: 'Cost', before: 'High per unit', after: 'Dramatically lower' },
{ label: 'Speed', before: '12–18 months', after: 'Under 9 months' },
{ label: 'Quality', before: 'Variable output', after: 'Aerospace grade' },
]

export default function ${r.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${r}"
style={{ padding: '80px 5vw', background: 'transparent' }} >
<div style={{ maxWidth: 1000, margin: '0 auto' }}>
<motion.h2
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
viewport={{ once: true }}
style={{
            fontFamily: 'Barlow Condensed, Impact, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#f0f4ff', letterSpacing: '0.04em',
            margin: '0 0 40px',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }} >
EPOCH A VS. EPOCH B
</motion.h2>

        <div style={{
          background: 'rgba(4,12,10,0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(200,168,75,0.12)',
          borderRadius: 6, overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(4,12,10,0.9)',
            borderBottom: '1px solid rgba(200,168,75,0.15)',
          }}>
            {['CATEGORY', 'EPOCH A — OLD', 'EPOCH B — NEW'].map((h, i) => (
              <div key={i} style={{
                padding: '12px 20px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.68rem', letterSpacing: '0.14em',
                color: i === 0 ? 'rgba(200,168,75,0.5)' : i === 1 ? 'rgba(255,255,255,0.35)' : '${i.accent}',
              }}>{h}</div>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: i < ROWS.length - 1 ? '1px solid rgba(200,168,75,0.06)' : 'none',
              }}
            >
              {[row.label, row.before, row.after].map((val, j) => (
                <div key={j} style={{
                  padding: '14px 20px',
                  fontFamily: j === 0 ? 'DM Mono, monospace' : 'DM Sans, Arial, sans-serif',
                  fontSize: j === 0 ? '0.7rem' : '0.88rem',
                  letterSpacing: j === 0 ? '0.1em' : '0.02em',
                  color: j === 0
                    ? 'rgba(200,168,75,0.55)'
                    : j === 1
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.82)',
                }}>{val}</div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

)
}
`
    },
  },
  processSteps: {
    label: 'Process Steps',
    description: 'Numbered vertical timeline / process list',
    generate({ theme = 'mycelium', effect = 'frostedRow', content = '' }) {
      var a
      const i = THEME_PALETTES[theme] || THEME_PALETTES.mycelium
      const r =
        ((a = EFFECT_STYLES[effect]) == null ? undefined : a.call(EFFECT_STYLES, i)) ||
        EFFECT_STYLES.frostedRow(i)
      const s = `process-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${s} — Process Steps (${theme}/${effect}) ──
// Content brief: ${content || 'Step-by-step process description'}

const STEPS = [
{ num: '01', title: 'Collection', body: 'Municipal solid waste collected at city curbs.' },
{ num: '02', title: 'Processing', body: 'Feedstock sorted, dried, and prepared.' },
{ num: '03', title: 'Conversion', body: 'Flash Joule heating converts carbon to graphene.' },
{ num: '04', title: 'Certification', body: 'Aerospace-grade purity verification.' },
{ num: '05', title: 'Distribution', body: 'Direct to manufacturer or bulk commodity sale.' },
]

export default function ${s.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${s}"
style={{ padding: '80px 5vw', background: 'transparent' }} >
<div style={{ maxWidth: 780, margin: '0 auto' }}>
<motion.h2
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
viewport={{ once: true }}
style={{
            fontFamily: 'Barlow Condensed, Impact, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: '#f0f4ff', letterSpacing: '0.04em',
            margin: '0 0 48px',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }} >
FROM CURB TO AEROSPACE MATERIAL.
</motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', left: 23, top: 48, bottom: 20,
            width: 1, background: 'linear-gradient(to bottom, ${i.accent}40, ${i.accent}08)',
          }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: '-5%' }}
              style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '18px 20px 18px 0',${r.replace(
                  /\n/g,
                  `
                `,
                )}
                position: 'relative',
              }}
            >
              <div style={{
                minWidth: 46, height: 46, borderRadius: '50%',
                background: 'rgba(4,12,10,0.9)',
                border: '1px solid ${i.accent}55',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                color: '${i.accent}', letterSpacing: '0.1em', flexShrink: 0,
              }}>
                {step.num}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Barlow Condensed, Impact, sans-serif',
                  fontSize: '1.1rem', letterSpacing: '0.1em',
                  color: '#f0f4ff', margin: '0 0 5px', textTransform: 'uppercase',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)',
                  margin: 0, lineHeight: 1.6,
                }}>
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

)
}
`
    },
  },
  cardGrid: {
    label: 'Card Grid',
    description: '3–4 column feature or partner cards',
    generate({ theme = 'water', effect = 'glassCard', content = '' }) {
      var a
      const i = THEME_PALETTES[theme] || THEME_PALETTES.water
      const r =
        ((a = EFFECT_STYLES[effect]) == null ? undefined : a.call(EFFECT_STYLES, i)) ||
        EFFECT_STYLES.glassCard(i)
      const s = `cards-${Date.now()}`
      return `import { motion } from 'motion/react'

// ── ${s} — Card Grid (${theme}/${effect}) ──
// Content brief: ${content || 'Cards with title, subtitle, body'}

const CARDS = [
{ eyebrow: '01', title: 'Card Title One', body: 'Descriptive text that explains the card content and value.' },
{ eyebrow: '02', title: 'Card Title Two', body: 'Descriptive text that explains the card content and value.' },
{ eyebrow: '03', title: 'Card Title Three', body: 'Descriptive text that explains the card content and value.' },
{ eyebrow: '04', title: 'Card Title Four', body: 'Descriptive text that explains the card content and value.' },
]

export default function ${s.replace(/-/g, '_')}() {
  return (
    <section
      data-section="${s}"
style={{ padding: '80px 5vw', background: 'transparent' }} >
<div style={{ maxWidth: 1200, margin: '0 auto' }}>
<motion.h2
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
viewport={{ once: true }}
style={{
            fontFamily: 'Barlow Condensed, Impact, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#f0f4ff', letterSpacing: '0.04em',
            margin: '0 0 48px',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }} >
FIVE ENGINES. ONE CLOSED LOOP.
</motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              style={{
                padding: '28px 24px',${r.replace(
                  /\n/g,
                  `
                `,
                )}
              }}
            >
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.65rem', color: '${i.accent}',
                letterSpacing: '0.15em', marginBottom: 14,
              }}>
                {card.eyebrow}
              </div>
              <h3 style={{
                fontFamily: 'Barlow Condensed, Impact, sans-serif',
                fontSize: '1.1rem', letterSpacing: '0.1em',
                color: '#f0f4ff', margin: '0 0 10px',
                textTransform: 'uppercase',
              }}>
                {card.title}
              </h3>
              <p style={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)',
                margin: 0, lineHeight: 1.65,
              }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

)
}
`
    },
  },
}
