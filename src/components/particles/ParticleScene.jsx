import { Suspense, useEffect, useRef } from 'react'
import { OrbitControls, Stats } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  HueSaturation,
} from '@react-three/postprocessing'
import { CanvasTexture, Color, MOUSE, SRGBColorSpace, Vector2, Vector3 } from 'three'
import ErrorBoundary from '../ErrorBoundary'
import ParticleSystem from './ParticleSystem'
import { logger } from '../../utils/logger'

const PARTICLE_SCENE_TAG = 'ParticleScene'

function SceneBackground({ particleParamsRef }) {
  const { scene, gl } = useThree()
  const i = useRef({})
  const r = useRef(null)
  useFrame(() => {
    const s = particleParamsRef.current
    const a = i.current
    const o = s.backgroundStyle ?? 'Solid Color'
    if (
      a.style !== o ||
      a.bg !== s.background ||
      a.c1 !== s.backgroundColor1 ||
      a.c2 !== s.backgroundColor2 ||
      a.angle !== s.backgroundAngle
    ) {
      Object.assign(a, {
        style: o,
        bg: s.background,
        c1: s.backgroundColor1,
        c2: s.backgroundColor2,
        angle: s.backgroundAngle,
      })
      if (r.current) {
        r.current.dispose()
        r.current = null
      }
      try {
        if (o === 'Solid Color') {
          gl.setClearColor(new Color(s.background ?? '#000000'), 1)
          scene.background = null
          return
        }
        const c = document.createElement('canvas')
        c.width = c.height = 512
        const f = c.getContext('2d')
        let d
        if (o === 'Radial Gradient' || o === 'Linear Gradient') {
          const h = s.backgroundColor1 ?? '#000000'
          const m = s.backgroundColor2 ?? '#000000'
          if (o === 'Radial Gradient') {
            d = f.createRadialGradient(256, 256, 0, 256, 256, 256)
          } else {
            const y = ((s.backgroundAngle ?? 135) * Math.PI) / 180
            const S = Math.cos(y)
            const _ = Math.sin(y)
            d = f.createLinearGradient(256 - S * 256, 256 - _ * 256, 256 + S * 256, 256 + _ * 256)
          }
          d.addColorStop(0, h)
          d.addColorStop(1, m)
        } else {
          d = f.createRadialGradient(256, 256, 0, 256, 256, 256)
          d.addColorStop(0, 'rgba(25, 30, 35, 0.85)')
          d.addColorStop(0.45, 'rgba(8, 10, 13, 0.95)')
          d.addColorStop(1, 'rgba(0, 0, 0, 1.0)')
        }
        f.fillStyle = d
        f.fillRect(0, 0, 512, 512)
        const p = new CanvasTexture(c)
        p.colorSpace = SRGBColorSpace
        r.current = p
        scene.background = p
      } catch (c) {
        logger.warn(PARTICLE_SCENE_TAG, `Background update error: ${c.message}`)
      }
    }
  })
  useEffect(
    () => () => {
      if (r.current) {
        r.current.dispose()
        r.current = null
      }
      scene.background = null
    },
    [scene],
  )
  return null
}

function CameraController({ guiParams, dofRef, orbitRef }) {
  const { camera } = useThree()
  useFrame((r) => {
    const s = guiParams.camera
    if (Math.abs(camera.fov - s.fov) > 0.01) {
      camera.fov = s.fov
      camera.updateProjectionMatrix()
    }
    if (orbitRef.current) {
      orbitRef.current.target.set(s.targetX ?? 0, s.targetY ?? 0, s.targetZ ?? 0)
    }
    if (s.enableOrbit) {
      s.posX = +camera.position.x.toFixed(3)
      s.posY = +camera.position.y.toFixed(3)
      s.posZ = +camera.position.z.toFixed(3)
      if (orbitRef.current) {
        orbitRef.current.autoRotate = !!s.autoDrift
        orbitRef.current.autoRotateSpeed = (s.driftSpeed ?? 0.5) * 2
      }
    } else {
      if (orbitRef.current) {
        orbitRef.current.autoRotate = false
      }
      camera.position.set(s.posX, s.posY, s.posZ)
      camera.lookAt(s.targetX ?? 0, s.targetY ?? 0, s.targetZ ?? 0)
      if (s.autoDrift) {
        const a = r.clock.elapsedTime * (s.driftSpeed ?? 0.5) * 0.25
        camera.position.x += Math.sin(a) * 0.004
        camera.position.y += Math.cos(a * 0.73) * 0.003
      }
    }
    if (dofRef.current && guiParams.post.enableDof && guiParams.post.dofAutoFocus) {
      const o =
        camera.position.distanceTo(new Vector3(s.targetX ?? 0, s.targetY ?? 0, s.targetZ ?? 0)) *
        0.1 *
        (guiParams.post.dofFocusBias ?? 1)
      const c = dofRef.current
      if (c.bokehEffect) {
        c.bokehEffect.focusDistance = o
      } else {
        c.focusDistance = o
      }
    }
  })
  return null
}

export default function ParticleScene({
  particleParamsRef,
  featherUrl,
  gltfUrl,
  gridSize,
  showStats = false,
}) {
  const s = useRef(null)
  const a = useRef(null)
  const { gl } = useThree()
  useEffect(() => {
    gl.setClearColor(new Color(0), 1)
    logger.info(PARTICLE_SCENE_TAG, `ParticleScene mounted — grid ${gridSize}x${gridSize}`)
    return () => logger.info(PARTICLE_SCENE_TAG, 'ParticleScene unmounted')
  }, [gl, gridSize])
  const c = particleParamsRef.current
  const f = c.post.bloomEnabled || c.post.enableDof || c.post.enableChromatic || c.post.enableHueSat
  return (
    <>
      <SceneBackground particleParamsRef={particleParamsRef} />
      <CameraController guiParams={c} dofRef={s} orbitRef={a} />
      <OrbitControls
        ref={a}
        makeDefault={true}
        enabled={c.camera.enableOrbit}
        enableDamping={true}
        dampingFactor={0.08}
        enablePan={true}
        enableZoom={true}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
      />
      <Suspense fallback={null}>
        <ErrorBoundary name="ParticleSystem" silent={true}>
          <ParticleSystem
            key={`${gridSize}-${gltfUrl ?? 'none'}`}
            gridSize={gridSize}
            featherUrl={featherUrl}
            gltfUrl={gltfUrl}
            guiParams={c}
          />
        </ErrorBoundary>
        {f && (
          <EffectComposer multisampling={0}>
            {c.post.bloomEnabled && (
              <Bloom
                luminanceThreshold={c.post.bloomThreshold ?? 0.35}
                luminanceSmoothing={0.9}
                intensity={c.post.bloomIntensity ?? 0.5}
                radius={c.post.bloomRadius ?? 0.4}
                mipmapBlur={true}
              />
            )}
            {c.post.enableDof && (
              <DepthOfField
                ref={s}
                focusDistance={c.post.dofFocus ?? 5}
                focalLength={c.post.dofFocalLength ? c.post.dofFocalLength / 1000 : 0.05}
                bokehScale={c.post.dofBokehScale ?? 3}
                height={480}
              />
            )}
            {c.post.enableChromatic && (
              <ChromaticAberration offset={new Vector2(c.post.chromaticOffset ?? 0.005, 0)} />
            )}
            {c.post.enableHueSat && <HueSaturation saturation={c.post.saturation ?? 0.9} />}
          </EffectComposer>
        )}
      </Suspense>
      {showStats && <Stats />}
    </>
  )
}
