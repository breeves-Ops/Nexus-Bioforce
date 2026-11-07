import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../utils/logger'

const PLUMES_TAG = 'useMethanePlumes'

const POLL_INTERVAL_MS = 300000

export default function useMethanePlumes() {
  const [n, e] = useState([])
  const [t, i] = useState(null)
  const [r, s] = useState(true)
  const [a, o] = useState(null)
  const [c, f] = useState(null)
  const d = useRef(null)
  const p = useCallback(async () => {
    try {
      const h = await fetch('/api/methane-plumes')
      const m = await h.json()
      if (!h.ok) {
        throw new Error(m.error || `HTTP ${h.status}`)
      }
      e(m.plumes ?? [])
      i(m.bboxCount ?? null)
      f(new Date())
      o(null)
    } catch (h) {
      logger.warn(PLUMES_TAG, `fetch failed: ${h.message}`)
      o(h.message)
    } finally {
      s(false)
    }
  }, [])
  useEffect(() => {
    p()
    d.current = setInterval(p, POLL_INTERVAL_MS)
    return () => clearInterval(d.current)
  }, [p])
  return {
    plumes: n,
    totalCount: t,
    loading: r,
    error: a,
    lastUpdated: c,
    refresh: p,
  }
}
