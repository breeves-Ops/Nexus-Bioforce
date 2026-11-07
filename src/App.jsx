import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import Lenis from 'lenis'
import './App.css'
import './styles/theme.css'
import { initScrollAnimations } from './animations/scrollAnimations'
import { initScrollProgressBridge } from './animations/scrollProgressBridge'
import ContactOverlay from './components/ContactOverlay'
import ErrorBoundary from './components/ErrorBoundary'
import MenuDrawer from './components/MenuDrawer'
import StickyLogo from './components/StickyLogo'
import StudioMount from './components/StudioMount'
import ParticleScene from './components/particles/ParticleScene'
import HomePage from './pages/HomePage'
import { createDefaultParticleParams } from './studio/ParticleWorkshop'
import { logger } from './utils/logger'

const MethaneTrackerPage = lazy(() => import('./pages/MethaneTrackerPage.jsx'))

const APP_TAG = 'App'

const STUDIO_HOTKEYS_ENABLED =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('studio')

const canvasLayerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
}

const canvasStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'block',
}

const domLayerStyle = {
  position: 'relative',
  minHeight: '100vh',
  background: 'transparent',
}

export default function App() {
  const [n, e] = useState(false)
  const [t, i] = useState(256)
  const [r, s] = useState('/default-feather.jpg')
  const [a, o] = useState(null)
  const [c, f] = useState(false)
  const [, d] = useState(0)
  const p = useRef(createDefaultParticleParams())
  const h = useRef(null)
  const m = useCallback((T) => i(T), [])
  const y = useCallback((T) => s(T), [])
  const S = useCallback((T) => o(T), [])
  const _ = useCallback((T) => f(T), [])
  const v = useCallback(() => d((T) => T + 1), [])
  useEffect(() => {
    logger.info(APP_TAG, 'Initializing Lenis smooth scroll')
    const T = new Lenis({
      duration: 1.15,
      easing: (D) => Math.min(1, 1.001 - Math.pow(2, D * -10)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8,
    })
    let C
    const R = (D) => {
      T.raf(D)
      C = requestAnimationFrame(R)
    }
    C = requestAnimationFrame(R)
    const N = initScrollProgressBridge(T)
    let w = () => {}
    try {
      w = initScrollAnimations(T)
    } catch (D) {
      logger.warn(APP_TAG, `GSAP ScrollAnimations init failed: ${D.message}`)
    }
    logger.info(APP_TAG, 'Lenis + GSAP + scroll bridge ready')
    return () => {
      cancelAnimationFrame(C)
      N()
      try {
        w()
      } catch {}
      T.destroy()
      logger.info(APP_TAG, 'Lenis destroyed')
    }
  }, [])
  useEffect(() => {
    document.body.style.overflow = n ? 'hidden' : ''
  }, [n])
  const x = () => e(true)
  const M = () => e(false)
  return (
    <div
      style={{
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <div style={canvasLayerStyle} aria-hidden="true">
        <ErrorBoundary
          name="WebGLCanvas"
          fallback={
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 30%, #001a2e 0%, #040c0a 70%)',
              }}
            />
          }
        >
          <Canvas
            style={canvasStyle}
            gl={{
              antialias: false,
              powerPreference: 'high-performance',
              alpha: false,
              stencil: false,
              depth: true,
            }}
            camera={{
              position: [0, 0, 5],
              fov: 75,
            }}
            dpr={[1, Math.min(1.5, window.devicePixelRatio || 1)]}
            performance={{
              min: 0.5,
            }}
            onContextMenu={(T) => T.preventDefault()}
            onCreated={({ gl }) => {
              gl.setClearColor(0x040c0a, 1)
              logger.info(APP_TAG, 'WebGL context ready')
            }}
          >
            <ErrorBoundary name="ParticleScene" silent={true}>
              <ParticleScene
                key={`${t}-${a ?? 'none'}`}
                particleParamsRef={p}
                featherUrl={r}
                gltfUrl={a}
                gridSize={t}
                showStats={c}
              />
            </ErrorBoundary>
          </Canvas>
        </ErrorBoundary>
      </div>
      <div id="nexus-glass-pane" aria-hidden="true" />
      <div style={domLayerStyle} className="nexus-dom-layer">
        <StickyLogo />
        <MenuDrawer onContactOpen={x} />
        <ContactOverlay isOpen={n} onClose={M} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage onContactOpen={x} />} />
            <Route
              path="/methane-tracker"
              element={
                <Suspense fallback={null}>
                  <MethaneTrackerPage />
                </Suspense>
              }
            />
          </Routes>
        </main>
      </div>
      <StudioMount
        uniformsRef={h}
        particleParamsRef={p}
        hotkeysEnabled={STUDIO_HOTKEYS_ENABLED}
        onGridSizeChange={m}
        onFeatherUpload={y}
        onGltfUpload={S}
        onShowStatsChange={_}
        onTick={v}
      />
    </div>
  )
}
