import { useEffect, useRef } from 'react'
import useNexusStore from '../store/useNexusStore'
import NexusStudio from '../studio/NexusStudio'
import ParticleWorkshop from '../studio/ParticleWorkshop'
import { logger } from '../utils/logger'

const STUDIO_MOUNT_TAG = 'StudioMount'

export default function StudioMount({
  uniformsRef,
  particleParamsRef,
  hotkeysEnabled = true,
  onGridSizeChange,
  onFeatherUpload,
  onGltfUpload,
  onShowStatsChange,
  onTick,
}) {
  const c = useRef(null)
  const f = useRef(null)
  const d = useRef(null)
  useNexusStore((_) => _.getSections)
  const p = useNexusStore((_) => _.setSections)
  const h = useNexusStore((_) => _.setGuiValue)
  const m = useNexusStore((_) => _.setImageParticles)
  const y = useNexusStore((_) => _.setImageTextureUrl)
  const S = useNexusStore((_) => _.setImagePlaneConfig)
  useEffect(() => {
    logger.info(STUDIO_MOUNT_TAG, 'Mounting NexusStudio...')
    const _ = (M, T) => {
      useNexusStore.getState()
      if (M === 'setGuiValue') {
        const [C, R] = Array.isArray(T) ? T : [T, null]
        h(C, R)
      } else if (M === 'setImageParticles') {
        m(T)
      } else if (M === 'setSections') {
        p(T)
      } else if (M === 'setImageTextureUrl') {
        y(T)
      } else if (M === 'setImagePlaneConfig') {
        S(T)
      } else {
        logger.warn(STUDIO_MOUNT_TAG, `Unknown setStore action: ${M}`)
      }
    }
    const v = new NexusStudio({
      getStore: () => useNexusStore.getState(),
      setStore: _,
      getUniforms: () => (uniformsRef == null ? undefined : uniformsRef.current) || null,
      getSections: () => useNexusStore.getState().sections,
      setSections: (M) => useNexusStore.getState().setSections(M),
      hotkeysEnabled: hotkeysEnabled,
    })
    v.mount()
    c.current = v
    logger.info(STUDIO_MOUNT_TAG, 'NexusStudio mounted — press G to toggle')
    let x = 0
    d.current = setInterval(() => {
      x++
      const M = uniformsRef == null ? undefined : uniformsRef.current
      if (M && M.uGlobalBrightness) {
        clearInterval(d.current)
        d.current = null
        v.connectUniforms(M)
        logger.info(STUDIO_MOUNT_TAG, `Uniforms connected after ${x * 100}ms`)
      } else if (x > 80) {
        clearInterval(d.current)
        d.current = null
        logger.warn(
          STUDIO_MOUNT_TAG,
          'Uniforms not ready after 8s — Scene sliders use Zustand bridge only',
        )
      }
    }, 100)
    return () => {
      var M
      if (d.current) {
        clearInterval(d.current)
        d.current = null
      }
      if ((M = c.current) != null) {
        M.destroy()
      }
      c.current = null
      logger.info(STUDIO_MOUNT_TAG, 'NexusStudio unmounted')
    }
  }, [])
  useEffect(() => {
    if (!particleParamsRef) {
      return
    }
    logger.info(STUDIO_MOUNT_TAG, 'Mounting ParticleWorkshop...')
    const _ = new ParticleWorkshop(particleParamsRef, {
      onGridSizeChange: onGridSizeChange,
      onFeatherUpload: onFeatherUpload,
      onGltfUpload: onGltfUpload,
      onShowStatsChange: onShowStatsChange,
      onTick: onTick,
      hotkeysEnabled: hotkeysEnabled,
    })
    _.mount()
    f.current = _
    window.__nexusWorkshop = _
    logger.info(STUDIO_MOUNT_TAG, 'ParticleWorkshop mounted — press P to toggle')
    return () => {
      var v
      if ((v = f.current) != null) {
        v.destroy()
      }
      f.current = null
      delete window.__nexusWorkshop
      logger.info(STUDIO_MOUNT_TAG, 'ParticleWorkshop unmounted')
    }
  }, [])
  return (
    <>
      <input
        type="file"
        id="pw-feat-input"
        accept="image/*,video/*"
        style={{
          display: 'none',
        }}
        onChange={(_) => {
          var x
          var M
          const v = (x = _.target.files) == null ? undefined : x[0]
          if (v) {
            if ((M = f.current) != null) {
              M.handleFileUpload('image', v)
            }
          }
          _.target.value = ''
        }}
      />
      <input
        type="file"
        id="pw-gltf-input"
        accept=".gltf,.glb"
        style={{
          display: 'none',
        }}
        onChange={(_) => {
          var x
          var M
          const v = (x = _.target.files) == null ? undefined : x[0]
          if (v) {
            if ((M = f.current) != null) {
              M.handleFileUpload('gltf', v)
            }
          }
          _.target.value = ''
        }}
      />
      <input
        type="file"
        id="pw-preset-input"
        accept=".json"
        style={{
          display: 'none',
        }}
        onChange={(_) => {
          var x
          var M
          const v = (x = _.target.files) == null ? undefined : x[0]
          if (v) {
            if ((M = f.current) != null) {
              M.handleFileUpload('preset', v)
            }
          }
          _.target.value = ''
        }}
      />
    </>
  )
}
