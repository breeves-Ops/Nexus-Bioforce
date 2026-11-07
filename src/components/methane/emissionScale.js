export const EMISSION_TIERS = [{
  max: 200,
  color: '#C8A84B',
  label: 'Low (<200 kg/hr)'
}, {
  max: 1000,
  color: '#E08A2C',
  label: 'Moderate (200–1,000 kg/hr)'
}, {
  max: 3000,
  color: '#DC4A1A',
  label: 'High (1,000–3,000 kg/hr)'
}, {
  max: Infinity,
  color: '#B0181A',
  label: 'Severe (>3,000 kg/hr)'
}];

const NO_DATA_COLOR = '#7A7A7A';

export function emissionColor(d) {
  var c;
  if (d == null || Number.isNaN(d)) {
    return NO_DATA_COLOR;
  } else {
    return ((c = EMISSION_TIERS.find(a => d < a.max)) == null ? undefined : c.color) ?? EMISSION_TIERS.at(-1).color;
  }
}

export function emissionRadius(d) {
  if (d == null || Number.isNaN(d)) {
    return 5;
  } else {
    return Math.max(5, Math.min(22, 5 + Math.sqrt(d) * 0.5));
  }
}

function haversineKm(d, c, a, _) {
  const T = (a - d) * Math.PI / 180;
  const f = (_ - c) * Math.PI / 180;
  const O = Math.sin(T / 2) ** 2 + Math.cos(d * Math.PI / 180) * Math.cos(a * Math.PI / 180) * Math.sin(f / 2) ** 2;
  return Math.asin(Math.sqrt(O)) * 12742;
}

export function nearestSite(d, c, a) {
  let _ = null;
  let m = Infinity;
  for (const T of a) {
    const f = haversineKm(d, c, T.lat, T.lng);
    if (f < m) {
      m = f;
      _ = T;
    }
  }
  if (_) {
    return {
      site: _,
      distanceKm: m
    };
  } else {
    return null;
  }
}
