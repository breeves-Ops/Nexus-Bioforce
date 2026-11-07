/**
 * Theatre.js integration for Nexus Studio (design tool only — never loaded for regular visitors).
 * @theatre/core and @theatre/studio are imported on demand, the first time the studio asks for them.
 */
import { logger } from '../utils/logger'

const TAG = 'Theatre'

let project = null
let studioInstance = null
let initialized = false

async function loadTheatre() {
  const [{ getProject, types }, studioModule] = await Promise.all([
    import('@theatre/core'),
    import('@theatre/studio'),
  ])
  return { getProject, types, studio: studioModule.default }
}

export async function initTheatre({ showStudio = true } = {}) {
  if (initialized) {
    logger.warn(TAG, 'Already initialized')
    if (showStudio && studioInstance) {
      studioInstance.initialize()
    }
    return () => {}
  }
  try {
    logger.info(TAG, 'Loading @theatre/core + @theatre/studio…')
    const { getProject, studio } = await loadTheatre()
    studioInstance = studio
    if (showStudio) {
      studio.initialize({ usePersistentStorage: true })
      logger.info(TAG, 'Studio UI initialized')
    }
    project = getProject('Nexus Bioforce', {})
    initialized = true
    logger.info(TAG, 'Project "Nexus Bioforce" ready')
    return () => {
      if (studioInstance) {
        try {
          studioInstance.ui.hide()
        } catch {}
      }
      initialized = false
      logger.info(TAG, 'Cleaned up')
    }
  } catch (err) {
    logger.warn(TAG, `Failed to initialize: ${err.message}`)
    logger.warn(TAG, 'Continuing without Theatre.js')
    return () => {}
  }
}

export function getSheet(name = 'Main') {
  if (!project) {
    logger.warn(TAG, 'Project not initialized — call initTheatre() first')
    return null
  }
  return project.sheet(name)
}

export function getProject() {
  return project
}

export function getStudio() {
  return studioInstance
}

export function isInitialized() {
  return initialized
}

export function toggleStudioUI() {
  if (!studioInstance) {
    logger.warn(TAG, 'Studio not initialized')
    return
  }
  try {
    const visible = studioInstance.ui.isVisible?.() ?? false
    if (visible) {
      studioInstance.ui.hide()
      logger.info(TAG, 'Studio UI hidden')
    } else {
      studioInstance.ui.show()
      logger.info(TAG, 'Studio UI shown')
    }
  } catch {
    try {
      studioInstance.ui.show()
    } catch {}
  }
}
