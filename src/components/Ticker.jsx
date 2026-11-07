const TICKER_ITEMS = [
  {
    label: 'EBITDA MARGIN',
    value: '93.3%',
  },
  {
    label: 'ANNUAL REVENUE',
    value: '$1.9B',
  },
  {
    label: 'CAPITAL PAYBACK',
    value: '<9 MONTHS',
  },
  {
    label: 'GRAPHENE PRODUCED',
    value: '22,000+ T/YR',
  },
  {
    label: 'MSW FEEDSTOCK',
    value: '2,500 TPD',
  },
  {
    label: 'WATER CONSERVED',
    value: '2.4B GAL/YR',
  },
  {
    label: 'GRID STATUS',
    value: 'OFF-GRID CAPABLE',
  },
  {
    label: 'CARBON IMPACT',
    value: 'CARBON NEGATIVE',
  },
  {
    label: 'MATTER ENGINE UPTIME',
    value: '97%',
  },
  {
    label: 'RARE EARTH RECOVERY',
    value: '90%',
  },
]

const TICKER_LOOP = [...TICKER_ITEMS, ...TICKER_ITEMS]

export default function Ticker() {
  return (
    <div className="ticker-band" aria-hidden="true">
      <div className="ticker-track">
        {TICKER_LOOP.map((n, e) => (
          <div key={e} className="ticker-item">
            <span>{n.label}</span>
            <strong>{n.value}</strong>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </div>
  )
}
