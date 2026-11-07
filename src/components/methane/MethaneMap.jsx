import { useMemo } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { HOUSTON_CENTER, HOUSTON_ZOOM } from '../../data/houstonLandfills'
import { emissionColor, emissionRadius, nearestSite } from './emissionScale'
import 'leaflet/dist/leaflet.css'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function landfillIcon(d) {
  const c = d === 'active' ? '#C8A84B' : 'rgba(200,168,75,0.45)';
  return L.divIcon({
    className: 'nexus-landfill-marker',
    html: `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11,1 20,7 20,15 11,21 2,15 2,7" fill="${c}" stroke="#080808" stroke-width="1.5"/>
    </svg>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function formatObservedDate(d) {
  if (d) {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } else {
    return 'Unknown';
  }
}

export default function MethaneMap({
  landfills,
  plumes,
  selectedPlumeId,
  onSelectPlume,
  scrollWheelZoom = true
}) {
  const T = useMemo(() => {
    const f = new Map();
    for (const O of landfills) {
      f.set(O.status, f.get(O.status) ?? landfillIcon(O.status));
    }
    return f;
  }, [landfills]);
  return <MapContainer center={[HOUSTON_CENTER.lat, HOUSTON_CENTER.lng]} zoom={HOUSTON_ZOOM} scrollWheelZoom={scrollWheelZoom} className="methane-map">
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} className="nexus-dark-tiles" />
      {landfills.map(f => <Marker key={f.id} position={[f.lat, f.lng]} icon={T.get(f.status)}>
          <Tooltip direction="top" offset={[0, -10]}>
            {f.name}
          </Tooltip>
          <Popup>
            <div className="mm-popup">
              <strong>{f.name}</strong>
              <div className="mm-popup-row">{f.operator}</div>
              <div className="mm-popup-row">{f.address}</div>
              <div className="mm-popup-row">
                {'TCEQ Permit '}
                {f.permitNo}
                {' · '}
                <span className={`mm-status mm-status--${f.status}`}>{f.status}</span>
              </div>
            </div>
          </Popup>
        </Marker>)}
      {plumes.map(f => {
      const O = nearestSite(f.lat, f.lng, landfills);
      const y = f.id === selectedPlumeId;
      return <CircleMarker key={f.id} center={[f.lat, f.lng]} radius={emissionRadius(f.emissionKgH)} pathOptions={{
        color: y ? '#FFFFFF' : emissionColor(f.emissionKgH),
        weight: y ? 3 : 1.5,
        fillColor: emissionColor(f.emissionKgH),
        fillOpacity: 0.55
      }} eventHandlers={{
        click: () => onSelectPlume == null ? undefined : onSelectPlume(f.id)
      }}>
            <Popup>
              <div className="mm-popup">
                <strong>
                  {f.gas}
                  {' plume · '}
                  {f.sectorLabel}
                </strong>
                <div className="mm-popup-row">
                  {'Detected '}
                  {formatObservedDate(f.dateObserved)}
                </div>
                <div className="mm-popup-row">
                  {'Emission: '}
                  {f.emissionKgH != null ? `${Math.round(f.emissionKgH).toLocaleString()} kg/hr` : 'estimate withheld'}
                </div>
                <div className="mm-popup-row">
                  {'Instrument: '}
                  {f.platform || f.instrument}
                </div>
                {O && <div className="mm-popup-row">
                    {'Nearest landfill: '}
                    {O.site.name}
                    {' ('}
                    {O.distanceKm.toFixed(1)}
                    {' km)'}
                  </div>}
                <a href={f.plumeRgbPngUrl ?? f.plumePngUrl} target="_blank" rel="noreferrer" className="mm-popup-link">
                  View plume image ↗
                </a>
              </div>
            </Popup>
          </CircleMarker>;
    })}
    </MapContainer>;
}
