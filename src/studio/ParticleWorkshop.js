import GUI from 'lil-gui'
import { AdditiveBlending, NormalBlending, SubtractiveBlending } from 'three'
import { logger } from '../utils/logger'

const WORKSHOP_TAG = 'ParticleWorkshop'

const BUILTIN_PRESETS = {
  'Ivory Pearl HD': {
    backgroundStyle: 'Solid Color',
    background: '#040405',
    flow: {
      speed: 0,
      curlIntensity: 0,
      windDirection: 'None',
      windStrength: 0,
    },
    interaction: {
      magneticsEnabled: false,
      radius: 0.2,
      force: 0.5,
      parallax: 0.01,
      invertMouse: false,
    },
    transform: {
      shape: 'Plane',
      fitMode: 'Maintain Aspect',
      morphHD: 1,
      displacement: 0,
      pullForce: 0.5,
    },
    ambientCloud: {
      enabled: false,
    },
    lighting: {
      ambient: 0.5,
      intensity: 1.8,
      dirX: 1,
      dirY: 1,
      dirZ: 1.5,
      depthShadow: 0.4,
    },
    rendering: {
      particleSize: 2,
      brightness: 1.4,
      opacity: 1,
      respawnRate: 0,
    },
    post: {
      bloomEnabled: false,
      enableDof: false,
      enableChromatic: false,
      enableHueSat: false,
    },
  },
  'Emerald Garden': {
    backgroundStyle: 'Radial Gradient',
    backgroundColor1: '#000c05',
    backgroundColor2: '#000201',
    flow: {
      speed: 0.8,
      curlIntensity: 0.5,
      windDirection: 'Right',
      windStrength: 0.5,
    },
    interaction: {
      magneticsEnabled: false,
      radius: 0.3,
      force: 1.2,
      parallax: 0.03,
      invertMouse: false,
    },
    transform: {
      shape: 'Cylinder',
      fitMode: 'Maintain Aspect',
      morphHD: 0.25,
      displacement: 0.4,
      pullForce: 0.04,
    },
    ambientCloud: {
      enabled: false,
    },
    lighting: {
      ambient: 0.8,
      intensity: 1.5,
      dirX: 0.5,
      dirY: -0.5,
      dirZ: 1,
      depthShadow: 1.5,
    },
    rendering: {
      particleSize: 5,
      brightness: 1.2,
      opacity: 0.7,
      respawnRate: 0.001,
    },
    post: {
      bloomEnabled: false,
      enableDof: false,
      enableChromatic: false,
      enableHueSat: false,
    },
  },
  'Kinetic Storm': {
    backgroundStyle: 'Solid Color',
    background: '#010103',
    flow: {
      speed: 4.5,
      curlIntensity: 4.5,
      windDirection: 'None',
      windStrength: 0,
    },
    interaction: {
      magneticsEnabled: false,
      radius: 0.8,
      force: 5,
      parallax: 0.05,
      invertMouse: false,
    },
    transform: {
      shape: 'Explode',
      fitMode: 'Maintain Aspect',
      morphHD: 0,
      displacement: 2.5,
      pullForce: 0.01,
    },
    ambientCloud: {
      enabled: false,
    },
    lighting: {
      ambient: 0.2,
      intensity: 3,
      dirX: 0,
      dirY: 0,
      dirZ: 1,
      depthShadow: 2,
    },
    rendering: {
      particleSize: 6,
      brightness: 2.5,
      opacity: 0.9,
      respawnRate: 0.01,
    },
    post: {
      bloomEnabled: false,
      enableDof: false,
      enableChromatic: false,
      enableHueSat: false,
    },
  },
}

function loadUserPresets() {
  var e
  const n = {}
  try {
    const t = import.meta.glob('../presets/*.json', {
      eager: true,
    })
    for (const [i, r] of Object.entries(t)) {
      const s = r.default ?? r
      const a = i.replace(/^.*[\\/]/, '').replace(/\.json$/, '')
      const o = (e = s._name) != null && e.trim() ? s._name.trim() : a
      n[o] = s
    }
    logger.info(WORKSHOP_TAG, `Loaded ${Object.keys(n).length} user presets from src/presets/`)
  } catch (t) {
    logger.warn(
      WORKSHOP_TAG,
      `Could not load presets from src/presets/: ${t == null ? undefined : t.message}`,
    )
  }
  return n
}

const ALL_PRESETS = {
  ...BUILTIN_PRESETS,
  ...loadUserPresets(),
}

function deepMerge(n, e) {
  for (const t in e) {
    if (e[t] && typeof e[t] == 'object' && !Array.isArray(e[t])) {
      n[t] ||= {}
      deepMerge(n[t], e[t])
    } else {
      n[t] = e[t]
    }
  }
}

function injectWorkshopStyles() {
  if (document.getElementById('nexus-workshop-css')) {
    return
  }
  const n = document.createElement('style')
  n.id = 'nexus-workshop-css'
  n.textContent = `
    #particle-workshop-wrapper {
      position: fixed;
      top: 16px;
      right: 320px;
      z-index: 51;
      user-select: none;
      transition: opacity 0.25s ease;
    }
    #particle-workshop-wrapper.workshop-closed {
      opacity: 0;
      pointer-events: none;
    }
    #particle-workshop-wrapper .lil-gui {
      --background-color: rgba(0, 0, 0, 0.8);
      --title-background-color: rgba(0, 0, 0, 0.85);
      min-width: 260px;
    }
    #particle-workshop-wrapper .lil-gui .title {
      cursor: grab;
    }
    #particle-workshop-wrapper .lil-gui .title:active {
      cursor: grabbing;
    }
    .workshop-hint {
      position: fixed;
      bottom: 8px;
      right: 8px;
      z-index: 52;
      font-family: var(--gui-font, 'DM Sans', sans-serif);
      font-size: 9px;
      letter-spacing: 0.1em;
      color: rgba(200,168,75,0.45);
      pointer-events: none;
    }
  `
  document.head.appendChild(n)
}

export function createDefaultParticleParams() {
  return {
    backgroundStyle: 'Solid Color',
    background: '#000000',
    backgroundColor1: '#000000',
    backgroundColor2: '#000000',
    backgroundAngle: 135,
    flow: {
      speed: 0.6,
      curlIntensity: 0.5,
      windDirection: 'None',
      windStrength: 0,
    },
    interaction: {
      magneticsEnabled: false,
      radius: 0.35,
      force: 1.5,
      parallax: 0.02,
      invertMouse: false,
    },
    transform: {
      shape: 'Plane',
      fitMode: 'Maintain Aspect',
      morphHD: 0.88,
      displacement: 0.15,
      pullForce: 0.5,
      forceResetParticles: false,
    },
    ambientCloud: {
      enabled: false,
      particleCount: 500,
      size: 50,
      opacity: 0.48,
      colorSource: 'Image Palette',
      direction: 'Orbit',
      speed: 0.1,
      bokehHardness: 0,
    },
    lighting: {
      ambient: 0.9,
      intensity: 1,
      dirX: 1,
      dirY: 1.2,
      dirZ: 0.8,
      depthShadow: 0.4,
    },
    rendering: {
      particleCountPreset: '65K (256x256)',
      particleSize: 4.5,
      blending: NormalBlending,
      opacity: 0.85,
      brightness: 1.3,
      respawnRate: 0,
    },
    post: {
      bloomEnabled: false,
      bloomIntensity: 0.5,
      bloomThreshold: 0.35,
      bloomRadius: 0.4,
      enableDof: false,
      dofFocus: 5,
      dofFocalLength: 50,
      dofBokehScale: 1.5,
      dofAutoFocus: true,
      dofFocusBias: 1.5,
      enableChromatic: false,
      chromaticOffset: 0,
      enableHueSat: false,
      saturation: 0.9,
    },
    camera: {
      fov: 75,
      posX: 0,
      posY: 0,
      posZ: 3,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      enableOrbit: true,
      autoDrift: false,
      driftSpeed: 0.5,
    },
    showFPS: false,
    showSpecs: false,
  }
}

export default class ParticleWorkshop {
  constructor(e, t = {}) {
    this._paramsRef = e
    this._callbacks = t
    this._hotkeysEnabled = t.hotkeysEnabled !== false
    this._gui = null
    this._wrapper = null
    this._isOpen = false
    this._onKeyDown = this._onKeyDown.bind(this)
    logger.info(WORKSHOP_TAG, 'ParticleWorkshop constructed')
  }
  get params() {
    return this._paramsRef.current
  }
  mount() {
    injectWorkshopStyles()
    this._createWrapper()
    this._buildGUI()
    if (this._hotkeysEnabled) {
      this._createHint()
    }
    document.addEventListener('keydown', this._onKeyDown)
    logger.info(WORKSHOP_TAG, 'ParticleWorkshop mounted (P key to toggle)')
  }
  destroy() {
    document.removeEventListener('keydown', this._onKeyDown)
    if (this._gui) {
      if (typeof this._gui.destroy == 'function') {
        this._gui.destroy()
      }
      this._gui = null
    }
    if (this._wrapper) {
      this._wrapper.remove()
      this._wrapper = null
    }
    const e = document.getElementById('workshop-hint')
    if (e) {
      e.remove()
    }
    logger.info(WORKSHOP_TAG, 'ParticleWorkshop destroyed')
  }
  toggle() {
    this._isOpen = !this._isOpen
    if (this._wrapper) {
      this._wrapper.classList.toggle('workshop-closed', !this._isOpen)
    }
  }
  open() {
    var e
    this._isOpen = true
    if ((e = this._wrapper) != null) {
      e.classList.remove('workshop-closed')
    }
  }
  close() {
    var e
    this._isOpen = false
    if ((e = this._wrapper) != null) {
      e.classList.add('workshop-closed')
    }
  }
  _onKeyDown(e) {
    if (this._hotkeysEnabled) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === 'p' || e.key === 'P') {
          this.toggle()
        }
      }
    }
  }
  _createWrapper() {
    const e = document.createElement('div')
    e.id = 'particle-workshop-wrapper'
    e.classList.add('workshop-closed')
    document.body.appendChild(e)
    this._wrapper = e
  }
  _createHint() {
    if (document.getElementById('workshop-hint')) {
      return
    }
    const e = document.createElement('div')
    e.id = 'workshop-hint'
    e.className = 'workshop-hint'
    e.textContent = 'G = Studio  |  P = Particle Workshop'
    document.body.appendChild(e)
  }
  _makeDraggable(e, t) {
    t.style.cursor = 'grab'
    let i = false
    t.addEventListener('mousedown', (r) => {
      if (
        r.button !== 0 ||
        (r.target !== t && ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].includes(r.target.tagName))
      ) {
        return
      }
      if (!i) {
        i = true
        const h = e.getBoundingClientRect()
        e.style.position = 'fixed'
        e.style.right = 'auto'
        e.style.bottom = 'auto'
        e.style.left = h.left + 'px'
        e.style.top = h.top + 'px'
        e.style.transform = 'none'
        e.style.margin = '0'
      }
      const s = r.clientX
      const a = r.clientY
      const o = parseFloat(e.style.left) || 0
      const c = parseFloat(e.style.top) || 0
      let f = false
      const d = (h) => {
        const m = h.clientX - s
        const y = h.clientY - a
        if (!f && (Math.abs(m) > 4 || Math.abs(y) > 4)) {
          f = true
          t.style.cursor = 'grabbing'
        }
        if (f) {
          e.style.left = o + m + 'px'
          e.style.top = c + y + 'px'
        }
      }
      const p = () => {
        t.style.cursor = 'grab'
        document.removeEventListener('mousemove', d)
        document.removeEventListener('mouseup', p)
        if (f) {
          const h = (m) => {
            m.stopImmediatePropagation()
            t.removeEventListener('click', h, true)
          }
          t.addEventListener('click', h, true)
        }
      }
      document.addEventListener('mousemove', d)
      document.addEventListener('mouseup', p)
    })
  }
  _buildGUI() {
    var S
    var _
    var v
    const e = this.params
    const t = new GUI({
      title: '🔥 Particle Workshop',
      container: this._wrapper,
    })
    this._gui = t
    if ((S = t.domElement) != null && S.style) {
      t.domElement.style.maxHeight = 'calc(100vh - 32px)'
      t.domElement.style.overflowY = 'auto'
    }
    const i =
      (v = (_ = t.domElement) == null ? undefined : _.querySelector) == null
        ? undefined
        : v.call(_, '.title')
    if (i) {
      this._makeDraggable(this._wrapper, i)
    }
    const r = () => {
      var x
      var M
      if ((M = (x = this._callbacks).onTick) != null) {
        M.call(x)
      }
    }
    const s = {
      selectedPreset: 'None',
      applyPreset: (x) => {
        var T
        var C
        var R
        var N
        var w
        if (!ALL_PRESETS[x]) {
          return
        }
        deepMerge(e, ALL_PRESETS[x])
        const M = (T = e.rendering) == null ? undefined : T.particleCountPreset
        if (M) {
          const D = M.includes('128x128')
            ? 128
            : M.includes('256x256')
              ? 256
              : M.includes('512x512')
                ? 512
                : 1024
          if ((R = (C = this._callbacks).onGridSizeChange) != null) {
            R.call(C, D)
          }
        }
        if ((w = (N = this._callbacks).onShowStatsChange) != null) {
          w.call(N, !!e.showFPS)
        }
        t.controllersRecursive().forEach((D) => D.updateDisplay())
        r()
        logger.info(WORKSHOP_TAG, `Preset applied: ${x}`)
      },
    }
    const a = t.addFolder('Assets & Canvas Settings')
    a.add(s, 'selectedPreset', ['None', ...Object.keys(ALL_PRESETS)])
      .name('🎭 Choose Preset')
      .onChange((x) => s.applyPreset(x))
    a.add(
      {
        upload: () => {
          var x
          if ((x = document.getElementById('pw-feat-input')) == null) {
            return undefined
          } else {
            return x.click()
          }
        },
      },
      'upload',
    ).name('📷 Upload Image / Video')
    a.add(
      {
        upload: () => {
          var x
          if ((x = document.getElementById('pw-gltf-input')) == null) {
            return undefined
          } else {
            return x.click()
          }
        },
      },
      'upload',
    ).name('📐 Upload GLTF/GLB Mesh')
    a.add(e, 'backgroundStyle', [
      'Solid Color',
      'Radial Gradient',
      'Linear Gradient',
      'Ambient Mirror',
    ])
      .name('Bg Backplane')
      .onChange(r)
    a.addColor(e, 'background').name('Solid Color').onChange(r)
    a.addColor(e, 'backgroundColor1').name('Gradient Tint 1').onChange(r)
    a.addColor(e, 'backgroundColor2').name('Gradient Tint 2').onChange(r)
    a.add(e, 'backgroundAngle', 0, 360).name('Grad Angle').onChange(r)
    a.add(
      {
        v: e.showFPS,
      },
      'v',
    )
      .name('Show FPS Monitor')
      .onChange((x) => {
        var M
        var T
        e.showFPS = x
        if ((T = (M = this._callbacks).onShowStatsChange) != null) {
          T.call(M, x)
        }
      })
    a.add(
      {
        export: () => {
          try {
            const x = new Blob([JSON.stringify(e, null, 2)], {
              type: 'application/json',
            })
            const M = URL.createObjectURL(x)
            const T = Object.assign(document.createElement('a'), {
              href: M,
              download: `particle-preset-${Date.now()}.json`,
            })
            document.body.appendChild(T)
            T.click()
            document.body.removeChild(T)
            URL.revokeObjectURL(M)
            logger.info(WORKSHOP_TAG, 'Preset exported')
          } catch {
            prompt('Copy your preset:', JSON.stringify(e, null, 2))
          }
        },
      },
      'export',
    ).name('📤 Export Custom Preset')
    a.add(
      {
        imp: () => {
          var x
          if ((x = document.getElementById('pw-preset-input')) == null) {
            return undefined
          } else {
            return x.click()
          }
        },
      },
      'imp',
    ).name('📥 Import Saved Preset')
    a.close()
    const o = t.addFolder('Forms & Morphing')
    o.add(e.transform, 'shape', ['Plane', 'Sphere', 'Cylinder', 'Torus', 'Explode', 'Custom GLTF'])
      .name('Shape Target')
      .onChange(r)
    o.add(e.transform, 'fitMode', ['Maintain Aspect', 'Stretch', 'Cover'])
      .name('Aspect Correction')
      .onChange(r)
    o.add(e.transform, 'morphHD', 0, 1, 0.01).name('🔐 Lock To HD View')
    o.add(e.transform, 'displacement', 0, 5, 0.01).name('Displacement Height')
    o.add(e.transform, 'pullForce', 0, 0.5, 0.01).name('Shape Gravity')
    o.add(
      {
        reset: () => {
          e.transform.forceResetParticles = true
        },
      },
      'reset',
    ).name('💥 Snap & Pack Particles')
    const c = t.addFolder('Flow Dynamics & Wind')
    c.add(e.flow, 'speed', 0, 10, 0.1).name('Turbulence Speed')
    c.add(e.flow, 'curlIntensity', 0, 5, 0.1).name('Micro-Swirls')
    c.add(e.flow, 'windDirection', ['None', 'Up', 'Down', 'Left', 'Right', 'Forward', 'Reverse'])
      .name('Constant Wind Force')
      .onChange(r)
    c.add(e.flow, 'windStrength', 0, 15, 0.1).name('Wind Strength')
    const f = t.addFolder('Mouse Magnetics')
    f.add(e.interaction, 'parallax', 0, 0.3, 0.01).name('Gyro Parallax Shift')
    f.add(e.interaction, 'radius', 0.01, 3, 0.01).name('Impact Radius')
    f.add(e.interaction, 'force', 0, 10, 0.1).name('Impact Power')
    f.add(e.interaction, 'invertMouse').name('Attract Instead').onChange(r)
    const d = t.addFolder('Scene Lighting & Depths')
    d.add(e.lighting, 'ambient', 0, 3, 0.1).name('Ambient Glow')
    d.add(e.lighting, 'intensity', 0, 5, 0.1).name('Directional Sun')
    d.add(e.lighting, 'dirX', -2, 2, 0.1).name('Sun Dir X')
    d.add(e.lighting, 'dirY', -2, 2, 0.1).name('Sun Dir Y')
    d.add(e.lighting, 'dirZ', -2, 2, 0.1).name('Sun Dir Z')
    d.add(e.lighting, 'depthShadow', 0, 3, 0.1).name('Depth Darkening')
    d.close()
    const p = t.addFolder('Resolution & Particles')
    p.add(e.rendering, 'particleCountPreset', [
      '16K (128x128)',
      '65K (256x256)',
      '262K (512x512)',
      '1M (1024x1024)',
    ])
      .name('Grid Size')
      .onChange((x) => {
        var T
        var C
        const M = x.includes('128') ? 128 : x.includes('256') ? 256 : x.includes('512') ? 512 : 1024
        if ((C = (T = this._callbacks).onGridSizeChange) != null) {
          C.call(T, M)
        }
        r()
      })
    p.add(e.rendering, 'particleSize', 0.1, 15, 0.1).name('Particle Scale')
    p.add(e.rendering, 'brightness', 0, 10, 0.1).name('Core Intensity')
    p.add(e.rendering, 'opacity', 0, 1, 0.01).name('Opacity')
    p.add(e.rendering, 'respawnRate', 0, 0.1, 0.001).name('Erosion Factor')
    p.add(
      {
        bl: 'Additive',
      },
      'bl',
      ['Additive', 'Normal', 'Subtractive'],
    )
      .name('Composite Mode')
      .onChange((x) => {
        e.rendering.blending =
          x === 'Additive'
            ? AdditiveBlending
            : x === 'Subtractive'
              ? SubtractiveBlending
              : NormalBlending
        r()
      })
    p.close()
    const h = t.addFolder('Camera Rig & Motion')
    h.add(
      {
        recenter: () => {
          Object.assign(e.camera, {
            posX: 0,
            posY: 0,
            posZ: 5,
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            enableOrbit: true,
          })
          t.controllersRecursive().forEach((x) => x.updateDisplay())
          r()
        },
      },
      'recenter',
    ).name('🎯 Focus / Recenter Camera')
    h.add(e.camera, 'enableOrbit').name('Enable Rotation Controls').onChange(r)
    h.add(e.camera, 'autoDrift').name('Cinematic Wandering').onChange(r)
    h.add(e.camera, 'driftSpeed', 0, 2, 0.1).name('Wander Speed')
    h.add(e.camera, 'fov', 20, 120, 1).name('FOV Angle')
    h.add(e.camera, 'posX', -10, 10, 0.1).name('Camera Offset X')
    h.add(e.camera, 'posY', -10, 10, 0.1).name('Camera Offset Y')
    h.add(e.camera, 'posZ', 0.5, 10, 0.1).name('Camera Offset Z')
    h.add(e.camera, 'targetX', -5, 5, 0.1).name('Focus Target X')
    h.add(e.camera, 'targetY', -5, 5, 0.1).name('Focus Target Y')
    h.add(e.camera, 'targetZ', -5, 5, 0.1).name('Focus Target Z')
    h.close()
    const m = t.addFolder('Cinematic Post Filtering')
    m.add(e.post, 'bloomEnabled').name('🌟 Enable Bloom Glow').onChange(r)
    m.add(e.post, 'bloomIntensity', 0, 10, 0.1).name('Glow Multiplier').onChange(r)
    m.add(e.post, 'bloomThreshold', 0, 1, 0.01).name('Glow Threshold').onChange(r)
    m.add(e.post, 'bloomRadius', 0, 3, 0.01).name('Glow Spread').onChange(r)
    m.add(e.post, 'enableDof').name('Enable Depth of Field').onChange(r)
    m.add(e.post, 'dofAutoFocus').name('Autonomous Focus (AF)').onChange(r)
    m.add(e.post, 'dofFocusBias', 0.1, 5, 0.05).name('AF Focal Bias').onChange(r)
    m.add(e.post, 'dofFocus', 0.1, 10, 0.1).name('Manual Focus Point').onChange(r)
    m.add(e.post, 'dofFocalLength', 1, 300, 1).name('DoF Focal Length').onChange(r)
    m.add(e.post, 'dofBokehScale', 0.1, 15, 0.1).name('Bokeh Intensity').onChange(r)
    m.add(e.post, 'enableChromatic').name('Enable Chromatic Split').onChange(r)
    m.add(e.post, 'chromaticOffset', 0, 0.05, 0.001).name('Split Displacement').onChange(r)
    m.add(e.post, 'enableHueSat').name('Enable Calibration').onChange(r)
    m.add(e.post, 'saturation', -1, 3, 0.1).name('Color Saturation').onChange(r)
    m.close()
    const y = t.addFolder('Floating Bokeh Cloud')
    y.add(e.ambientCloud, 'enabled').name('Enable Field').onChange(r)
    y.add(e.ambientCloud, 'particleCount', [500, 1000, 1500, 2000, 4000])
      .name('Bokeh Density')
      .onChange(r)
    y.add(e.ambientCloud, 'size', 1, 50, 0.1).name('Bokeh Diameter')
    y.add(e.ambientCloud, 'bokehHardness', 0, 0.45, 0.01).name('Edge Hardness')
    y.add(e.ambientCloud, 'opacity', 0, 1, 0.01).name('Overall Opacity')
    y.add(e.ambientCloud, 'colorSource', [
      'Image Palette',
      'Golden Essence',
      'Cyber Neon',
      'Soft Emerald',
      'Ivory Pearl',
    ])
      .name('Palette Source')
      .onChange(r)
    y.add(e.ambientCloud, 'direction', [
      'Up',
      'Down',
      'Left',
      'Right',
      'Forward',
      'Reverse',
      'Orbit',
    ])
      .name('Cloud Wind Flow')
      .onChange(r)
    y.add(e.ambientCloud, 'speed', 0, 5, 0.1).name('Drift Turbulence')
    y.close()
    logger.info(WORKSHOP_TAG, 'GUI built with all 9 folders')
  }
  handleFileUpload(e, t) {
    var r
    var s
    var a
    var o
    var c
    var f
    if (!t) {
      return
    }
    if (e === 'preset') {
      const d = new FileReader()
      d.onload = (p) => {
        var h
        var m
        var y
        var S
        var _
        var v
        var x
        var M
        try {
          const T = JSON.parse(p.target.result)
          deepMerge(this.params, T)
          const C = (h = this.params.rendering) == null ? undefined : h.particleCountPreset
          if (C) {
            const R = C.includes('128')
              ? 128
              : C.includes('256')
                ? 256
                : C.includes('512')
                  ? 512
                  : 1024
            if ((y = (m = this._callbacks).onGridSizeChange) != null) {
              y.call(m, R)
            }
          }
          if ((_ = (S = this._callbacks).onShowStatsChange) != null) {
            _.call(S, !!this.params.showFPS)
          }
          if ((v = this._gui) != null) {
            v.controllersRecursive().forEach((R) => R.updateDisplay())
          }
          if ((M = (x = this._callbacks).onTick) != null) {
            M.call(x)
          }
          logger.info(WORKSHOP_TAG, 'Preset JSON imported')
        } catch (T) {
          logger.error(WORKSHOP_TAG, `Preset parse error: ${T.message}`)
          alert('Failed to parse preset JSON file.')
        }
      }
      d.readAsText(t)
      return
    }
    const i = URL.createObjectURL(t)
    if (e === 'image') {
      const d = t.type.startsWith('video/')
      if ((s = (r = this._callbacks).onFeatherUpload) != null) {
        s.call(r, `nexus-media:${d ? 'video' : 'image'}:${i}`)
      }
      logger.info(WORKSHOP_TAG, `${d ? 'Video' : 'Image'} uploaded: ${t.name}`)
    } else if (e === 'gltf') {
      if ((o = (a = this._callbacks).onGltfUpload) != null) {
        o.call(a, i)
      }
      this.params.transform.shape = 'Custom GLTF'
      if ((f = (c = this._callbacks).onTick) != null) {
        f.call(c)
      }
      logger.info(WORKSHOP_TAG, `GLTF/GLB uploaded: ${t.name}`)
    }
  }
  applyScrollPreset(e) {
    var d
    var p
    var h
    var m
    var y
    var S
    var _
    var v
    if (!ALL_PRESETS[e]) {
      return
    }
    const t = this.params
    if (t._lastScrollPreset === e) {
      return
    }
    t._lastScrollPreset = e
    const i = ALL_PRESETS[e]
    const r = {
      ...t.camera,
    }
    const s = (d = t.transform) == null ? undefined : d.shape
    const a = (p = t.transform) == null ? undefined : p.morphHD
    const o = (h = t.transform) == null ? undefined : h.pullForce
    const c = ((m = t.ambientCloud) == null ? undefined : m.enabled) ?? false
    const f = ((y = t.interaction) == null ? undefined : y.magneticsEnabled) ?? false
    if (i.flow) {
      deepMerge(t.flow, i.flow)
    }
    if (i.lighting) {
      deepMerge(t.lighting, i.lighting)
    }
    if (i.post) {
      const {
        enableDof,
        dofFocus,
        dofFocalLength,
        dofBokehScale,
        dofAutoFocus,
        dofFocusBias,
        ...w
      } = i.post
      deepMerge(t.post, w)
    }
    if (i.ambientCloud) {
      deepMerge(t.ambientCloud, i.ambientCloud)
      t.ambientCloud.enabled = c
    }
    Object.assign(t.camera, r)
    if (t.transform) {
      t.transform.shape = s
      t.transform.morphHD = a
      t.transform.pullForce = o
    }
    if (t.interaction) {
      t.interaction.magneticsEnabled = f
    }
    if ((S = this._gui) != null) {
      S.controllersRecursive().forEach((x) => x.updateDisplay())
    }
    if ((v = (_ = this._callbacks).onTick) != null) {
      v.call(_)
    }
    logger.info(WORKSHOP_TAG, `Scroll preset (conservative): ${e}`)
  }
}
