export const priorityStyle = (n) => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.68rem',
  color: n.startsWith('P1')
    ? '#dc4a1a'
    : n.startsWith('P2')
      ? 'rgba(0,229,200,0.7)'
      : 'rgba(200,220,228,0.55)',
  whiteSpace: 'nowrap',
})

export const rootStyle = {
  position: 'relative',
  zIndex: 2,
  color: '#d0dce0',
  fontFamily: "'DM Sans', 'Inter', sans-serif",
}

export const sectionStyle = {
  padding: '7rem 2rem',
  borderTop: '1px solid rgba(0,229,200,0.06)',
}

export const innerStyle = {
  maxWidth: '1160px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
}

export const eyebrowStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.62rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: '#00e5c8',
  opacity: 0.7,
  marginBottom: '1rem',
}

export const headingStyle = {
  fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 800,
  lineHeight: 1.06,
  letterSpacing: '-0.025em',
  color: '#ffffff',
  margin: '0 0 1.5rem',
}

export const dividerStyle = {
  height: '1px',
  background: 'linear-gradient(90deg, rgba(0,229,200,0.4) 0%, transparent 70%)',
  border: 'none',
  margin: '0 0 2.5rem',
  width: '100%',
}

export const quoteStyle = {
  fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
  fontStyle: 'italic',
  fontWeight: 500,
  lineHeight: 1.6,
  color: 'rgba(200,220,230,0.85)',
  borderLeft: '3px solid #00e5c8',
  paddingLeft: '1.5rem',
  margin: '0',
}

export const bodyStyle = {
  fontSize: 'clamp(0.9rem, 1.3vw, 1rem)',
  lineHeight: 1.78,
  color: 'rgba(200,220,228,0.78)',
  margin: 0,
}

export const gridStyle = {
  display: 'grid',
  gap: '1.2rem',
}

export const principleCardStyle = {
  background: 'rgba(6,12,16,0.75)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

export const principleNumberStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '2.5rem',
  fontWeight: 900,
  color: 'rgba(0,229,200,0.12)',
  lineHeight: 1,
}

export const historyCardStyle = {
  background: 'rgba(4,10,14,0.8)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
}

export const cardTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '1rem',
  fontWeight: 700,
  color: '#fff',
  margin: '0 0 0.5rem',
  lineHeight: 1.2,
}

export const cardTextStyle = {
  fontSize: '0.82rem',
  lineHeight: 1.65,
  color: 'rgba(200,220,228,0.65)',
  margin: 0,
}

export const statCardStyle = {
  background: 'rgba(0,229,200,0.04)',
  border: '1px solid rgba(0,229,200,0.1)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'flex-start',
}

export const statValueStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
  fontWeight: 800,
  color: '#00e5c8',
  letterSpacing: '-0.02em',
  lineHeight: 1,
}

export const statLabelStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  color: 'rgba(180,200,210,0.55)',
  textTransform: 'uppercase',
  lineHeight: 1.4,
}

export const siteCardStyle = {
  background: 'rgba(6,12,16,0.75)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

export const siteIconStyle = {
  fontSize: '1.6rem',
  lineHeight: 1,
}

export const systemCardStyle = {
  background: 'rgba(6,12,16,0.8)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderTop: '2px solid rgba(0,229,200,0.3)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
}

export const systemLabelStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.58rem',
  letterSpacing: '0.2em',
  color: 'rgba(0,229,200,0.5)',
  textTransform: 'uppercase',
  marginBottom: '0.2rem',
}

export const statListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  marginTop: '0.5rem',
  paddingTop: '0.8rem',
  borderTop: '1px solid rgba(0,229,200,0.08)',
  listStyle: 'none',
  padding: '0.8rem 0 0',
}

export const statItemStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.68rem',
  color: 'rgba(0,229,200,0.7)',
  letterSpacing: '0.04em',
}

export const zoneCardStyle = {
  background: 'rgba(0,229,200,0.03)',
  border: '1px solid rgba(0,229,200,0.06)',
  borderRadius: '6px',
  padding: '1.2rem',
}

export const tokenCardStyle = {
  background: 'rgba(0,229,200,0.03)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderRadius: '10px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
}

export const tokenSymbolStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '2.5rem',
  fontWeight: 900,
  color: 'rgba(0,229,200,0.10)',
  lineHeight: 1,
}

export const tokenDetailStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.65rem',
  color: 'rgba(0,229,200,0.55)',
  lineHeight: 1.5,
  marginTop: '0.5rem',
  paddingTop: '0.8rem',
  borderTop: '1px solid rgba(0,229,200,0.08)',
}

export const allianceCardStyle = {
  background: 'rgba(0,229,200,0.03)',
  border: '1px solid rgba(0,229,200,0.1)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

export const visionCardStyle = {
  background: 'rgba(6,12,16,0.75)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

export const visionIconStyle = {
  fontSize: '2rem',
  lineHeight: 1,
}

export const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.85rem',
}

export const tableHeadStyle = {
  padding: '0.7rem 1rem',
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(155,180,200,0.55)',
  textAlign: 'left',
  borderBottom: '1px solid rgba(0,229,200,0.12)',
}

export const tableCellStyle = {
  padding: '0.7rem 1rem',
  color: 'rgba(200,220,228,0.72)',
  fontSize: '0.85rem',
  lineHeight: 1.5,
  verticalAlign: 'top',
}

export const capexCardStyle = {
  background: 'rgba(0,229,200,0.03)',
  border: '1px solid rgba(0,229,200,0.08)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}
