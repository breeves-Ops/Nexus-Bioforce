const LEVEL_COLORS = {
  DEBUG: '#6b7280',
  INFO: '#8ab4b0',
  WARN: '#c8a84b',
  ERROR: '#dc4a1a',
  GUI: '#a78bfa',
}

const LOG_PREFIX = '[NEXUS]'

function emitLog(n, e, t, i) {
  if (n === 'DEBUG' || n === 'INFO') {
    return
  }
  const r = LEVEL_COLORS[n] || LEVEL_COLORS.INFO
  const s = `%c${LOG_PREFIX}[${e}]`
  const a = `color:${r};font-weight:bold;`
  const o = new Date().toISOString().slice(11, 23)
  if (i instanceof Error) {
    console.groupCollapsed(`${s} ${t}`, a)
    console.error(i)
    console.groupEnd()
  } else if (i !== undefined) {
    console.groupCollapsed(`${s} ${t} [${o}]`, a)
    console.log(i)
    console.groupEnd()
  } else {
    ;(n === 'ERROR' ? console.error : n === 'WARN' ? console.warn : console.log)(`${s} ${t}`, a)
  }
}

export const logger = {
  debug: (n, e, t) => emitLog('DEBUG', n, e, t),
  info: (n, e, t) => emitLog('INFO', n, e, t),
  warn: (n, e, t) => emitLog('WARN', n, e, t),
  error: (n, e, t) => emitLog('ERROR', n, e, t),
  gui: (n, e, t) => emitLog('GUI', n, e, t),
  assert(n, e, t, i = false) {
    if (!n && (this.error(e, `ASSERTION FAILED: ${t}`), i)) {
      throw new Error(`[NEXUS][${e}] ${t}`)
    }
  },
  time(n, e, t) {
    const i = performance.now()
    const r = t()
    const s = (performance.now() - i).toFixed(2)
    this.debug(n, `${e} took ${s}ms`)
    return r
  },
  async wrap(n, e, t) {
    try {
      return await t
    } catch (i) {
      this.error(n, `${e} rejected`, i)
      throw i
    }
  },
}
