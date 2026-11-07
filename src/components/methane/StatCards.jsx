function formatTimeAgo(n) {
  if (!n) {
    return '—'
  }
  const e = Math.round((Date.now() - n.getTime()) / 1000)
  if (e < 60) {
    return `${e}s ago`
  } else if (e < 3600) {
    return `${Math.round(e / 60)}m ago`
  } else {
    return `${Math.round(e / 3600)}h ago`
  }
}

export default function StatCards({ plumes, totalCount, lastUpdated, loading, error }) {
  const s = plumes.filter((d) => d.sector === '6A')
  const o = plumes
    .filter((d) => d.emissionKgH != null)
    .reduce(
      (d, p) => (p.emissionKgH > ((d == null ? undefined : d.emissionKgH) ?? -Infinity) ? p : d),
      null,
    )
  const c = plumes.reduce((d, p) => (!d || p.dateObserved > d.dateObserved ? p : d), null)
  const f = [
    {
      label: 'Detections in view',
      value: loading ? '—' : String(totalCount ?? plumes.length),
      sub: 'Carbon Mapper CH₄ plumes, Houston bbox',
    },
    {
      label: 'Landfill-sector plumes',
      value: loading ? '—' : String(s.length),
      sub: 'IPCC sector 6A — solid waste disposal',
    },
    {
      label: 'Peak emission rate',
      value: loading || !o ? '—' : `${Math.round(o.emissionKgH).toLocaleString()} kg/hr`,
      sub: o ? new Date(o.dateObserved).toLocaleDateString() : 'No quantified reading',
    },
    {
      label: 'Most recent overpass',
      value:
        loading || !c
          ? '—'
          : new Date(c.dateObserved).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
      sub: (c == null ? undefined : c.platform) ?? '',
    },
  ]
  return (
    <div className="mt-stats">
      {f.map((d) => (
        <div key={d.label} className="mt-stat-card">
          <div className="mt-stat-value">{d.value}</div>
          <div className="mt-stat-label">{d.label}</div>
          <div className="mt-stat-sub">{d.sub}</div>
        </div>
      ))}
      <div className="mt-live-indicator">
        <span className={`mt-live-dot${error ? ' mt-live-dot--error' : ''}`} />
        {error ? `Live feed error: ${error}` : `Live · updated ${formatTimeAgo(lastUpdated)}`}
      </div>
    </div>
  )
}
