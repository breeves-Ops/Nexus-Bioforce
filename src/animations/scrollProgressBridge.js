import useNexusStore, { STORE_PREFIX } from '../store/useNexusStore'
import { logger } from '../utils/logger'

console.log(`${STORE_PREFIX} useNexusStore initialized — Phase 4 studio ready`)

const BRIDGE_TAG = 'scrollProgress'

const MOOD_STOPS = [
  {
    from: 0,
    to: 0.12,
    preset: 'Warm Golden Embers',
  },
  {
    from: 0.12,
    to: 0.28,
    preset: 'Ivory Pearl HD',
  },
  {
    from: 0.28,
    to: 0.45,
    preset: 'Emerald Garden Dream',
  },
  {
    from: 0.45,
    to: 0.62,
    preset: 'Cyberpunk Neon Vortex',
  },
  {
    from: 0.62,
    to: 0.8,
    preset: 'Supernova / Cosmic Blast',
  },
  {
    from: 0.8,
    to: 1,
    preset: 'Warm Golden Embers',
  },
]

function moodPresetForProgress(n) {
  for (const e of MOOD_STOPS) {
    if (n >= e.from && n < e.to) {
      return e.preset
    }
  }
  return MOOD_STOPS[MOOD_STOPS.length - 1].preset
}

function observeSectionShapes() {
  let n = null
  const t = setTimeout(() => {
    const r = (useNexusStore.getState().sections ?? []).filter(
      (a) => a.morphShape && a.morphShape.length > 0,
    )
    if (r.length === 0) {
      return
    }
    const s = []
    r.forEach((a) => {
      const o =
        document.getElementById(`nexus-sec-${a.id}`) ||
        document.querySelector(`[data-nexus-section="${a.id}"]`)
      if (o) {
        s.push({
          el: o,
          shape: a.morphShape,
        })
      }
    })
    if (s.length !== 0) {
      n = new IntersectionObserver(
        (a) => {
          a.forEach((o) => {
            var d
            var p
            var h
            if (!o.isIntersecting) {
              return
            }
            const c = s.find((m) => m.el === o.target)
            if (!c) {
              return
            }
            const f = window.__nexusWorkshop
            if (
              (d = f == null ? undefined : f.params) != null &&
              d.transform &&
              f.params.transform.shape !== c.shape
            ) {
              f.params.transform.shape = c.shape
              if ((h = (p = f._callbacks) == null ? undefined : p.onTick) != null) {
                h.call(p)
              }
              logger.info(BRIDGE_TAG, `Section in view -> shape: ${c.shape}`)
            }
          })
        },
        {
          threshold: 0.4,
        },
      )
      s.forEach((a) => n.observe(a.el))
      logger.info(BRIDGE_TAG, `Shape observer watching ${s.length} sections`)
    }
  }, 1200)
  return () => {
    clearTimeout(t)
    if (n != null) {
      n.disconnect()
    }
  }
}

export function initScrollProgressBridge(n) {
  let e = null
  let t = null
  let i = false
  const r = ({ progress }) => {
    useNexusStore.getState().setScrollProgress(progress)
    if (progress > 0.03) {
      i = true
    }
    if (!i) {
      return
    }
    const o = moodPresetForProgress(progress)
    if (o !== e) {
      e = o
      clearTimeout(t)
      t = setTimeout(() => {
        const c = window.__nexusWorkshop
        if (c != null && c.applyScrollPreset) {
          c.applyScrollPreset(o)
        }
      }, 200)
    }
  }
  n.on('scroll', r)
  const s = observeSectionShapes()
  logger.info(BRIDGE_TAG, 'Scroll progress + mood preset + section shape observer initialized')
  return () => {
    n.off('scroll', r)
    clearTimeout(t)
    s()
    logger.info(BRIDGE_TAG, 'Scroll progress bridge removed')
  }
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */
