/**
 * GET /api/methane-plumes
 *
 * Vercel serverless function behind the Houston Landfill Methane Tracker.
 * Pulls methane (CH4) plume detections for Greater Houston from Carbon Mapper's
 * public catalog API and returns them in the shape the site expects.
 *
 * - No API key is needed: the Carbon Mapper catalog is public.
 * - Window: detections observed in the last three years.
 * - Responses are cached at the edge for two minutes.
 *
 * Response:
 *   {
 *     totalCount: number,  // CH4 plumes worldwide in the window
 *     bboxCount: number,   // CH4 plumes inside the Houston box
 *     fetchedAt: string,   // ISO timestamp
 *     plumes: Plume[]      // newest first
 *   }
 */

const CATALOG_URL = 'https://api.carbonmapper.org/api/v1/catalog/plumes/annotated'

// Greater Houston: [west, south, east, north]
const HOUSTON_BBOX = [-95.9, 29.3, -94.8, 30.2]

const LOOKBACK_YEARS = 3
const MAX_PLUMES = 1000
const CACHE_SECONDS = 120

// IPCC sector codes used by Carbon Mapper
const SECTOR_LABELS = {
  '1A1': 'Energy Industries',
  '1B1a': 'Coal Mining',
  '1B2': 'Oil & Natural Gas',
  '4B': 'Livestock (Manure Management)',
  '6A': 'Solid Waste Disposal (Landfill)',
  '6B': 'Wastewater Treatment',
  other: 'Other / Unclassified',
}

function buildCatalogUrl(now) {
  const since = new Date(now)
  since.setUTCFullYear(since.getUTCFullYear() - LOOKBACK_YEARS)

  const params = new URLSearchParams()
  params.set('plume_gas', 'CH4')
  params.set('datetime', `${since.toISOString().replace(/\.\d{3}Z$/, 'Z')}/..`)
  for (const v of HOUSTON_BBOX) params.append('bbox', String(v))
  params.set('limit', String(MAX_PLUMES))
  return `${CATALOG_URL}?${params}`
}

function toPlume(item) {
  const [lng, lat] = item.geometry_json?.coordinates ?? [null, null]
  const hidden = Boolean(item.hide_emission)
  return {
    id: item.id,
    plumeId: item.plume_id,
    gas: item.gas,
    lat,
    lng,
    sector: item.sector,
    sectorLabel: SECTOR_LABELS[item.sector] ?? SECTOR_LABELS.other,
    emissionKgH: hidden ? null : (item.emission_auto ?? null),
    emissionUncertaintyKgH: hidden ? null : (item.emission_uncertainty_auto ?? null),
    dateObserved: item.scene_timestamp,
    publishedAt: item.published_at,
    instrument: item.instrument,
    platform: item.platform,
    windSpeedAvg: item.wind_speed_avg_auto,
    windDirectionAvg: item.wind_direction_avg_auto,
    plumeBounds: item.plume_bounds,
    plumePngUrl: item.plume_png,
    plumeRgbPngUrl: item.plume_rgb_png,
    isOffshore: item.is_offshore,
    status: item.status,
  }
}

export default async function handler(req, res) {
  const now = new Date()
  try {
    const upstream = await fetch(buildCatalogUrl(now), {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    })
    if (!upstream.ok) {
      throw new Error(`Carbon Mapper responded ${upstream.status}`)
    }
    const data = await upstream.json()
    const plumes = (data.items ?? [])
      .filter((item) => item.geometry_json?.coordinates)
      .map(toPlume)

    res.setHeader('Cache-Control', `public, max-age=${CACHE_SECONDS}`)
    res.status(200).json({
      totalCount: data.total_count ?? plumes.length,
      bboxCount: data.bbox_count ?? plumes.length,
      fetchedAt: now.toISOString(),
      plumes,
    })
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).json({
      error: 'Could not reach the Carbon Mapper catalog',
      detail: err instanceof Error ? err.message : String(err),
    })
  }
}
