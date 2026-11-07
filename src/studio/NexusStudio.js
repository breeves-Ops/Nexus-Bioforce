import gsap from 'gsap'
import GUI from 'lil-gui'
import { COMPONENT_TEMPLATES } from './componentTemplates'
import { logger } from '../utils/logger'

const STUDIO_STORAGE_KEY = 'nexus_studio_state_v4'

const STUDIO_STATE_VERSION = 4

const DEFAULT_STUDIO_STATE = {
  version: STUDIO_STATE_VERSION,
  presetName: 'default',
  scene: {
    globalBrightness: 0.85,
    noiseSpeed: 0.3,
    noiseScale: 0.55,
    morphStrength: 0.5,
    bokehSize: 14,
    ambientIntensity: 0.25,
    lightX: 3,
    lightY: 6,
    lightZ: 6,
    lightIntensity: 1,
    lightColor: '#00e5c8',
    panelOpacity: 0.62,
    panelBlur: 16,
  },
  vibeCoder: {
    lastTemplate: 'statBlock',
    lastTheme: 'solar',
    lastEffect: 'glassCard',
  },
}

const studioStorage = {
  load() {
    try {
      const n = localStorage.getItem(STUDIO_STORAGE_KEY)
      if (!n) {
        return {
          ...DEFAULT_STUDIO_STATE,
        }
      }
      const e = JSON.parse(n)
      if (e.version !== STUDIO_STATE_VERSION) {
        console.warn('[NEXUS_BIOFORCE_STUDIO] StudioState version mismatch — resetting to defaults')
        return {
          ...DEFAULT_STUDIO_STATE,
        }
      } else {
        return {
          ...DEFAULT_STUDIO_STATE,
          ...e,
          scene: {
            ...DEFAULT_STUDIO_STATE.scene,
            ...(e.scene || {}),
          },
          vibeCoder: {
            ...DEFAULT_STUDIO_STATE.vibeCoder,
            ...(e.vibeCoder || {}),
          },
        }
      }
    } catch (n) {
      console.error('[NEXUS_BIOFORCE_STUDIO] StudioState.load failed:', n)
      return {
        ...DEFAULT_STUDIO_STATE,
      }
    }
  },
  save(n) {
    try {
      localStorage.setItem(
        STUDIO_STORAGE_KEY,
        JSON.stringify({
          ...n,
          version: STUDIO_STATE_VERSION,
        }),
      )
    } catch (e) {
      console.error('[NEXUS_BIOFORCE_STUDIO] StudioState.save failed:', e)
    }
  },
  clear() {
    try {
      localStorage.removeItem(STUDIO_STORAGE_KEY)
    } catch {}
  },
}

const PARTICLE_IMAGE_OPTIONS = [
  {
    value: '',
    label: 'Select a preset...',
  },
  {
    value: '360_F_1273006738_3hYWPgpVtC7tmAq0sTtUNUg3TevIaKeK.jpg',
    label: 'Feather Glitter',
  },
  {
    value: '360_F_137096991_QtkNXYYPZUexmZOYGaCydnKLkwhHaJYq.jpg',
    label: 'Teal Blue Feather',
  },
  {
    value:
      'HD-wallpaper-peacock-feather-bokeh-feather-glitter-paun-water-drop-peacock-pana-blue.jpg',
    label: 'Bokeh Peacock Drop',
  },
  {
    value:
      'beautiful-colorful-peacock-bird-feathers-seamless-abstract-pattern-texture-design-nature-background-wallpaper-backdrop-image-259834287.webp',
    label: 'Peacock Seamless',
  },
  {
    value:
      'beautiful-glitter-powder-on-peacock-bird-feathers-abstract-pattern-texture-background-glowing-soft-focus-bokeh-light-effect-colorful-image-2K99K8B.jpg',
    label: 'Glitter Powder Bokeh',
  },
  {
    value:
      'close-up-of-peacock-bird-feather-beautiful-peacock-feathers-seamless-abstract-background-soft-focus-warm-bokeh-light-effects-colorful-image-2KFK8EG.jpg',
    label: 'Feather Warm Bokeh',
  },
  {
    value: 'istockphoto-1152338619-612x612.jpg',
    label: 'Macro Blue Eye',
  },
  {
    value: 'istockphoto-155146030-612x612.jpg',
    label: 'Green Peacock Feathers',
  },
  {
    value: 'istockphoto-507866138-612x612.jpg',
    label: 'Peacock Eye Close',
  },
  {
    value: 'macro-feather-texturecolorful-macaw-feathers-260nw-2671859743.webp',
    label: 'Macaw Feathers Macro',
  },
  {
    value: 'macro-peacock-feather-photography.jpg',
    label: 'Peacock Macro Detail',
  },
  {
    value: 'macro-photography-of-peacock-feather.jpg',
    label: 'Peacock Macro Focus',
  },
  {
    value: 'peacock-peafowl-zoo-dark-5k-8k-1920x1200-1707.jpg',
    label: 'Peacock Dark Zoo',
  },
  {
    value: 'pexels-photo-4429879.jpg',
    label: 'Feather Macro Portrait',
  },
]

const STUDIO_PREFIX = '[NEXUS_BIOFORCE_STUDIO]'

const STUDIO_DEFAULT_PARAMS = {
  scene: {
    globalBrightness: 0.9,
    noiseSpeed: 0.3,
    noiseScale: 0.55,
    morphStrength: 0,
    bokehSize: 18,
    ambientIntensity: 0.25,
    lightX: 3,
    lightY: 6,
    lightZ: 6,
    lightIntensity: 1,
    lightColor: '#8ab4b0',
    panelOpacity: 0.45,
    panelBlur: 12,
    bloomEnabled: true,
    bloomIntensity: 0.18,
    bloomThreshold: 0.75,
    bloomRadius: 0.5,
    dofEnabled: false,
    dofFocusDistance: 0.012,
    dofFocalLength: 0.02,
    dofBokehScale: 1.5,
    guiBgOpacity: 0.82,
    guiBgBlur: 14,
    guiBgColor: '#1c212a',
    guiTextColor: '#dce1e6',
    guiTitleBgColor: '#242a34',
    guiTitleTextColor: '#c8a84b',
    guiWidgetColor: 'rgba(255,255,255,0.06)',
    guiBorderRadius: 20,
    guiBorderWidth: 0,
    guiBorderColor: '#c8a84b',
  },
}

const STUDIO_SECTION_SELECTORS = {
  hero: [
    '.hero-section',
    '[data-section="hero"]',
    'main > section:first-of-type',
    'main > *:first-child',
  ],
  ticker: ['.ticker-section', '.ticker-band', '[data-section="ticker"]'],
  numbers: ['.numbers-section', '[data-section="numbers"]'],
  crisis: ['.crisis-section', '[data-section="crisis"]'],
  solution: ['.solution-section', '[data-section="solution"]'],
  process: ['.process-section', '[data-section="process"]'],
  stakeholders: ['.stakeholders-section', '[data-section="stakeholders"]'],
  media: ['.media-section', '[data-section="media"]'],
  comparison: ['.comparison-section', '[data-section="comparison"]'],
  partners: ['.partners-section', '[data-section="partners"]'],
  credentials: ['.credentials-section', '[data-section="credentials"]'],
  contact: ['.contact-section', '.contact-footer', 'footer', '[data-section="contact"]'],
}

export default class NexusStudio {
  constructor({
    getStore,
    setStore,
    getUniforms,
    getSections,
    setSections,
    hotkeysEnabled = true,
  }) {
    this.hotkeysEnabled = hotkeysEnabled
    this.getStore = getStore
    this.setStore = setStore
    this.getUniforms = getUniforms
    this.getSections = getSections
    this.setSections = setSections
    this.gui = null
    this.isOpen = false
    this._lastFile = null
    this._uniforms = null
    this.state = studioStorage.load()
    if (this.state.scene) {
      this.state.scene = {
        ...STUDIO_DEFAULT_PARAMS.scene,
        ...this.state.scene,
      }
    } else {
      this.state.scene = {
        ...STUDIO_DEFAULT_PARAMS.scene,
      }
    }
    this._boundKey = this._onKeyDown.bind(this)
    logger.info('Studio', 'NexusStudio constructed', {
      stateLoaded: !!this.state,
    })
  }
  mount() {
    if (!this.gui) {
      this._injectGlassDistortionSVG()
      this._injectGlobalCSS()
      this._assignSectionIds()
      this._buildGUI()
      document.addEventListener('keydown', this._boundKey)
      logger.info('Studio', 'Mounted — G key to toggle')
    }
  }
  connectUniforms(e) {
    this._uniforms = e
    const t = this.state.scene
    const i = this._uniforms
    if (i) {
      if (i.uGlobalBrightness) {
        i.uGlobalBrightness.value = t.globalBrightness
      }
      if (i.uNoiseSpeed) {
        i.uNoiseSpeed.value = t.noiseSpeed
      }
      if (i.uNoiseScale) {
        i.uNoiseScale.value = t.noiseScale
      }
      if (i.uMorphStrength) {
        i.uMorphStrength.value = t.morphStrength
      }
      if (i.uBokehSize) {
        i.uBokehSize.value = t.bokehSize
      }
      logger.info('Studio', `connectUniforms — ${Object.keys(i).length} uniforms wired`)
    }
  }
  destroy() {
    if (this.gui) {
      this.gui.destroy()
      this.gui = null
    }
    document.removeEventListener('keydown', this._boundKey)
    logger.info('Studio', 'Destroyed')
  }
  toggle() {
    this.isOpen = !this.isOpen
    const e = document.getElementById('nexus-gui-wrapper')
    if (e) {
      e.classList.toggle('gui-closed', !this.isOpen)
    }
  }
  open() {
    this.isOpen = true
    const e = document.getElementById('nexus-gui-wrapper')
    if (e) {
      e.classList.remove('gui-closed')
    }
  }
  close() {
    this.isOpen = false
    const e = document.getElementById('nexus-gui-wrapper')
    if (e) {
      e.classList.add('gui-closed')
    }
  }
  _assignSectionIds() {
    this.getSections().forEach((t) => {
      const i = this._findSectionEl(t)
      if (i && !i.id) {
        i.id = `nexus-sec-${t.id}`
        logger.debug('Studio', `Assigned ID nexus-sec-${t.id} → .${i.className.split(' ')[0]}`)
      }
    })
  }
  _findSectionEl(e) {
    let t = document.getElementById(`nexus-sec-${e.id}`)
    if (t) {
      return t
    }
    const i = STUDIO_SECTION_SELECTORS[e.id] || []
    for (const o of i) {
      try {
        t = document.querySelector(o)
        if (t) {
          t.id = `nexus-sec-${e.id}`
          return t
        }
      } catch {}
    }
    if (e.componentName) {
      const o = e.componentName.toLowerCase()
      const c = [e.componentName, o, o.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()]
      for (const f of c) {
        t = document.querySelector(`[class*="${f}"]`)
        if (t) {
          t.id = `nexus-sec-${e.id}`
          return t
        }
      }
    }
    const r = document.querySelectorAll(
      'main > section, main > div[class*="section"], main > div[class*="Section"]',
    )
    const a = this.getSections().findIndex((o) => o.id === e.id)
    if (a >= 0 && r[a]) {
      t = r[a]
      t.id = `nexus-sec-${e.id}`
      return t
    } else {
      if (!e._domRetried) {
        e._domRetried = true
        setTimeout(() => {
          this._findSectionEl({
            ...e,
            _domRetried: false,
          })
        }, 500)
      }
      return null
    }
  }
  _buildGUI() {
    const e = document.getElementById('nexus-gui-wrapper')
    if (e) {
      e.remove()
    }
    this.gui = new GUI({
      title: 'NEXUS STUDIO',
      width: 340,
    })
    this._applyBrandStyles()
    const t = document.createElement('div')
    t.id = 'nexus-gui-wrapper'
    t.classList.add('gui-closed')
    t.appendChild(this.gui.domElement)
    document.body.appendChild(t)
    const i = this.gui.domElement.querySelector('.title')
    if (i) {
      this._makeDraggable(t, i)
    }
    this._buildScenePanel()
    this._buildDOMLayerPanel()
    this._buildSectionPanel()
    this._buildVibeCoderPanel()
    this._buildPresetsPanel()
    logger.info('Studio', 'GUI panels constructed')
  }
  _applyBrandStyles() {
    const e = this.gui.domElement
    e.style.setProperty('--background-color', 'rgba(0, 0, 0, 0.8)')
    e.style.setProperty('--title-background-color', 'rgba(0, 0, 0, 0.85)')
    e.style.maxHeight = '90vh'
    e.style.overflowY = 'auto'
    e.style.width = '320px'
    const t = e.querySelector('.title')
    if (t) {
      t.style.cursor = 'grab'
    }
    this._injectWrapperCSS()
  }
  _applyTheme() {}
  _injectGlobalCSS() {}
  _injectWrapperCSS() {
    if (document.getElementById('nexus-studio-gui-css')) {
      return
    }
    const e = document.createElement('style')
    e.id = 'nexus-studio-gui-css'
    e.textContent = `
      #nexus-gui-wrapper {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 50;
        width: 320px;
      }
      #nexus-gui-wrapper.gui-closed {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
      }
      #nexus-gui-wrapper .lil-gui {
        --background-color: rgba(0, 0, 0, 0.8);
        --title-background-color: rgba(0, 0, 0, 0.85);
        max-height: 90vh;
        overflow-y: auto;
        width: 320px !important;
      }
      #nexus-gui-wrapper .lil-gui .title {
        cursor: grab;
      }
      #nexus-gui-wrapper .lil-gui .title:active {
        cursor: grabbing;
      }
      .nexus-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .nexus-modal {
        background: rgba(0, 0, 0, 0.88);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 12px;
        color: #e0e0e0;
        padding: 20px;
        width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
      }
      .nexus-modal input, .nexus-modal select, .nexus-modal textarea {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        color: #e0e0e0;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 12px;
      }
      .nexus-btn {
        display: block;
        width: 100%;
        padding: 6px 12px;
        margin: 2px 0;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.06);
        color: #e0e0e0;
        border-radius: 6px;
        font-size: 11px;
        text-align: center;
        transition: background 0.15s;
      }
      .nexus-btn:hover { background: rgba(255,255,255,0.12); }
      .nexus-btn.danger { border-color: rgba(220,74,26,0.40); color: #e06040; }
      .nexus-btn.danger:hover { background: rgba(220,74,26,0.15); }
    `
    document.head.appendChild(e)
  }
  _injectGlassDistortionSVG() {
    if (document.getElementById('nexus-glass-svg')) {
      logger.debug('Studio', 'Glass distortion SVG already in DOM (from index.html)')
      return
    }
    const e = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    e.id = 'nexus-glass-svg'
    e.setAttribute('width', '0')
    e.setAttribute('height', '0')
    e.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden;'
    e.innerHTML = `
      <defs>
        <filter id="glass-distortion-strong" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.017 0.017" numOctaves="2" seed="92" result="noise"/>
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred"/>
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="66" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="glass-distortion" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.014" numOctaves="2" seed="92" result="noise"/>
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred"/>
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="32" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="glass-distortion-light" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="1" seed="42" result="noise"/>
          <feGaussianBlur in="noise" stdDeviation="1.5" result="blurred"/>
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="16" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    `
    document.body.insertBefore(e, document.body.firstChild)
  }
  _buildScenePanel() {
    const e = this.gui.addFolder('Scene')
    const t = this.state.scene
    const i = (p, h) => (m) => {
      var y
      t[p] = m
      this.setStore('setGuiValue', [p, m])
      if ((y = this._uniforms) != null && y[h]) {
        this._uniforms[h].value = m
      }
    }
    const r = (p) => (h) => {
      t[p] = h
      this.setStore('setGuiValue', [p, h])
    }
    e.add(t, 'globalBrightness', 0.1, 2, 0.01)
      .name('Brightness')
      .onChange(i('globalBrightness', 'uGlobalBrightness'))
    e.add(t, 'noiseSpeed', 0, 3, 0.01).name('Noise Speed').onChange(i('noiseSpeed', 'uNoiseSpeed'))
    e.add(t, 'noiseScale', 0.05, 5, 0.05)
      .name('Noise Scale')
      .onChange(i('noiseScale', 'uNoiseScale'))
    e.add(t, 'morphStrength', 0, 1, 0.01)
      .name('Morph Strength')
      .onChange(i('morphStrength', 'uMorphStrength'))
    e.add(t, 'bokehSize', 0.5, 80, 0.5).name('Bokeh Size').onChange(i('bokehSize', 'uBokehSize'))
    const s = e.addFolder('Lighting')
    s.add(t, 'ambientIntensity', 0, 2, 0.05).name('Ambient').onChange(r('ambientIntensity'))
    s.add(t, 'lightX', -15, 15, 0.1).name('Light X').onChange(r('lightX'))
    s.add(t, 'lightY', -15, 15, 0.1).name('Light Y').onChange(r('lightY'))
    s.add(t, 'lightZ', -15, 15, 0.1).name('Light Z').onChange(r('lightZ'))
    s.add(t, 'lightIntensity', 0, 4, 0.05).name('Light Intensity').onChange(r('lightIntensity'))
    s.addColor(t, 'lightColor').name('Light Color').onChange(r('lightColor'))
    s.close()
    e.addFolder('Glass Panels').close()
    const o = e.addFolder('Bloom')
    o.add(t, 'bloomEnabled').name('Enabled').onChange(r('bloomEnabled'))
    o.add(t, 'bloomIntensity', 0, 4, 0.01).name('Intensity').onChange(r('bloomIntensity'))
    o.add(t, 'bloomThreshold', 0, 1, 0.01).name('Threshold').onChange(r('bloomThreshold'))
    o.add(t, 'bloomRadius', 0, 4, 0.01).name('Radius').onChange(r('bloomRadius'))
    o.close()
    const c = e.addFolder('Depth of Field')
    c.add(t, 'dofEnabled').name('Enabled').onChange(r('dofEnabled'))
    c.add(t, 'dofFocusDistance', 0, 0.1, 0.0001)
      .name('Focus Distance')
      .onChange(r('dofFocusDistance'))
    c.add(t, 'dofFocalLength', 0.001, 1, 0.001).name('Focal Length').onChange(r('dofFocalLength'))
    c.add(t, 'dofBokehScale', 0, 10, 0.1).name('Bokeh Scale').onChange(r('dofBokehScale'))
    c.close()
    const f = this._makeContainer()
    const d = this._wideBtn('RESET SCENE TO DEFAULTS', () => {
      Object.assign(t, STUDIO_DEFAULT_PARAMS.scene)
      if (this._uniforms) {
        this.connectUniforms(this._uniforms)
      }
      const p = this.isOpen
      this.gui.destroy()
      this.gui = null
      this._buildGUI()
      if (p) {
        const h = document.getElementById('nexus-gui-wrapper')
        if (h) {
          h.classList.remove('gui-closed')
        }
      }
      d.textContent = 'DEFAULTS APPLIED'
      setTimeout(() => {
        d.textContent = 'RESET SCENE TO DEFAULTS'
      }, 2000)
    })
    f.appendChild(d)
    e.$children.appendChild(f)
    e.close()
  }
  _buildDOMLayerPanel() {
    const e = this.gui.addFolder('DOM Layer')
    const t = this._makeContainer()
    const i = document.documentElement.style
    const r = ['Slate', 'Midnight', 'Graphite', 'Warm']
    const s = this._labeledSelect('GUI THEME', r, (k) => {
      this._applyTheme(k.toLowerCase())
    })
    const a = s.querySelector('select')
    if (a) {
      const k = this._currentTheme || 'slate'
      a.value = k.charAt(0).toUpperCase() + k.slice(1)
    }
    const o = document.createElement('div')
    o.style.cssText = 'display:flex;align-items:center;gap:6px;padding:3px 0;'
    const c = document.createElement('input')
    c.type = 'range'
    c.min = '0'
    c.max = '3'
    c.step = '0.5'
    c.value = '0'
    c.style.cssText = 'flex:1;accent-color:#c8a84b;height:3px;'
    const f = document.createElement('input')
    f.type = 'color'
    f.value = '#c8a84b'
    f.style.cssText = 'width:38px;height:22px;border:none;cursor:pointer;border-radius:4px;'
    const d = () => {
      const k = f.value
      const we = parseInt(k.slice(1, 3), 16)
      const Re = parseInt(k.slice(3, 5), 16)
      const ze = parseInt(k.slice(5, 7), 16)
      const Me = document.getElementById('nexus-gui-wrapper')
      if (Me) {
        Me.style.boxShadow = `inset 0 0 15px -13px rgba(255,255,255,0.65),0 24px 60px rgba(0,0,0,0.50),0 0 0 ${c.value}px rgba(${we},${Re},${ze},0.55)`
      }
    }
    c.oninput = d
    f.oninput = d
    o.append(this._label('GUI BORDER'), c, f)
    const p = this.gui.addFolder('Typography')
    const h = [
      'Space Grotesk',
      'Inter',
      'Archivo Black',
      'Tenor Sans',
      'Syne',
      'Bebas Neue',
      'Barlow Condensed',
      'Oswald',
      'Rajdhani',
      'Anton',
      'Montserrat',
      'Outfit',
    ]
    const m = [
      'DM Sans',
      'Inter',
      'Questrial',
      'Work Sans',
      'Manrope',
      'Plus Jakarta Sans',
      'Sora',
      'Roboto',
      'Outfit',
    ]
    const y = [
      'DM Mono',
      'JetBrains Mono',
      'Fira Code',
      'Space Mono',
      'IBM Plex Mono',
      'Share Tech Mono',
    ]
    const S = [
      'DM Sans',
      'Inter',
      'Space Grotesk',
      'Work Sans',
      'Outfit',
      'DM Mono',
      'JetBrains Mono',
      'Space Mono',
      'IBM Plex Mono',
    ]
    const _ = {
      headFont: 'Space Grotesk',
      headScale: 1,
      headWeight: '700',
      headTracking: 0.01,
      bodyFont: 'DM Sans',
      bodyScale: 1,
      bodyWeight: '400',
      bodyTracking: 0.01,
      monoFont: 'DM Mono',
      guiFont: 'DM Sans',
      textShadow: false,
      textShadowBlur: 6,
      textShadowColor: '#000000',
      textShadowOpacity: 0.85,
    }
    const v = () => {
      if (!_.textShadow) {
        i.setProperty('--text-shadow-head', 'none')
        i.setProperty('--text-shadow-body', 'none')
        i.setProperty('--text-shadow-hero', 'none')
      } else {
        const k = _.textShadowColor
        const we = parseInt(k.slice(1, 3), 16)
        const Re = parseInt(k.slice(3, 5), 16)
        const ze = parseInt(k.slice(5, 7), 16)
        i.setProperty(
          '--text-shadow-head',
          `0 2px ${_.textShadowBlur}px rgba(${we},${Re},${ze},${_.textShadowOpacity})`,
        )
        i.setProperty(
          '--text-shadow-body',
          `0 1px ${Math.max(1, _.textShadowBlur / 2)}px rgba(${we},${Re},${ze},${_.textShadowOpacity * 0.7})`,
        )
        i.setProperty(
          '--text-shadow-hero',
          `0 2px ${_.textShadowBlur * 1.5}px rgba(${we},${Re},${ze},${_.textShadowOpacity})`,
        )
      }
    }
    const x = (k, we) => {
      switch (k) {
        case 'headFont':
          i.setProperty('--f-head', `'${we}','Inter',sans-serif`)
          break
        case 'headScale':
          i.setProperty('--type-scale-head', String(we))
          break
        case 'headWeight':
          i.setProperty('--fw-head', we)
          break
        case 'headTracking':
          i.setProperty('--ls-head', `${we}em`)
          break
        case 'bodyFont':
          i.setProperty('--f-body', `'${we}',sans-serif`)
          break
        case 'bodyScale':
          i.setProperty('--type-scale-body', String(we))
          break
        case 'bodyWeight':
          i.setProperty('--fw-body', we)
          break
        case 'bodyTracking':
          i.setProperty('--ls-body', `${we}em`)
          break
        case 'monoFont':
          i.setProperty('--f-mono', `'${we}',monospace`)
          break
        case 'guiFont': {
          const ze = [
            'DM Mono',
            'JetBrains Mono',
            'Space Mono',
            'IBM Plex Mono',
            'Share Tech Mono',
            'Fira Code',
          ].includes(we)
            ? `'${we}',monospace`
            : `'${we}',sans-serif`
          i.setProperty('--gui-font', ze)
          this._injectGlobalCSS()
          break
        }
      }
    }
    try {
      const k = document.createElement('div')
      k.textContent = '— SWISS TYPE PRESETS —'
      k.style.cssText =
        'font-size:9px;letter-spacing:0.14em;color:rgba(200,168,75,0.50);padding:6px 0 2px;text-transform:uppercase;text-align:center;'
      const we = p.domElement.querySelector('.children') || p.$children
      if (we) {
        we.prepend(k)
      }
    } catch (k) {
      logger.warn('Studio', 'Could not prepend presetLabel: ' + k.message)
    }
    p.add(_, 'headFont', h)
      .name('Heading Font')
      .onChange((k) => x('headFont', k))
    p.add(_, 'headScale', 0.6, 1.8, 0.05)
      .name('Head Scale')
      .onChange((k) => x('headScale', k))
    p.add(_, 'headWeight', ['300', '400', '500', '600', '700', '800', '900'])
      .name('Head Weight')
      .onChange((k) => x('headWeight', k))
    p.add(_, 'headTracking', 0, 0.2, 0.005)
      .name('Head Tracking')
      .onChange((k) => x('headTracking', k))
    p.add(_, 'bodyFont', m)
      .name('Body Font')
      .onChange((k) => x('bodyFont', k))
    p.add(_, 'bodyScale', 0.7, 1.4, 0.05)
      .name('Body Scale')
      .onChange((k) => x('bodyScale', k))
    p.add(_, 'bodyWeight', ['300', '400', '500', '600'])
      .name('Body Weight')
      .onChange((k) => x('bodyWeight', k))
    p.add(_, 'bodyTracking', 0, 0.1, 0.005)
      .name('Body Tracking')
      .onChange((k) => x('bodyTracking', k))
    p.add(_, 'monoFont', y)
      .name('Mono Font')
      .onChange((k) => x('monoFont', k))
    p.add(_, 'guiFont', S)
      .name('GUI Font')
      .onChange((k) => x('guiFont', k))
    const M = p.addFolder('Text Shadows')
    M.add(_, 'textShadow').name('Enable Shadows').onChange(v)
    M.add(_, 'textShadowBlur', 0, 20, 0.5).name('Shadow Blur').onChange(v)
    M.addColor(_, 'textShadowColor').name('Shadow Color').onChange(v)
    M.add(_, 'textShadowOpacity', 0, 1, 0.05).name('Shadow Opacity').onChange(v)
    M.close()
    v()
    p.close()
    const T = e.addFolder('GUI Theme Builder')
    const C = {
      bgOpacity: 0.82,
      bgBlur: 14,
      bgColor: '#1c212a',
      textColor: '#dce1e6',
      titleBgColor: '#242a34',
      titleTextColor: '#c8a84b',
      widgetColor: 'rgba(255,255,255,0.06)',
      borderRadius: 20,
      borderWidth: 0,
      borderColor: '#c8a84b',
    }
    const R = () => {
      const k = document.getElementById('nexus-gui-wrapper')
      if (k) {
        const Re = C.bgColor
        const ze = parseInt(Re.slice(1, 3), 16)
        const Me = parseInt(Re.slice(3, 5), 16)
        const gt = parseInt(Re.slice(5, 7), 16)
        k.style.background = `rgba(${ze},${Me},${gt},${C.bgOpacity})`
        k.style.backdropFilter = `blur(${C.bgBlur}px) saturate(1.6)`
        k.style.webkitBackdropFilter = `blur(${C.bgBlur}px) saturate(1.6)`
        k.style.borderRadius = `${C.borderRadius}px`
        const z = C.borderColor
        const O = parseInt(z.slice(1, 3), 16)
        const te = parseInt(z.slice(3, 5), 16)
        const fe = parseInt(z.slice(5, 7), 16)
        k.style.boxShadow = `inset 0 0 15px -13px rgba(255,255,255,0.65), 0 24px 60px rgba(0,0,0,0.50), 0 0 0 ${C.borderWidth}px rgba(${O},${te},${fe},0.55)`
        i.setProperty('--gui-modal-bg', `rgba(${ze},${Me},${gt},${C.bgOpacity})`)
        i.setProperty('--gui-modal-blur', `blur(${C.bgBlur}px) saturate(1.6)`)
        i.setProperty('--gui-modal-radius', `${C.borderRadius}px`)
        i.setProperty('--gui-modal-border', `${C.borderWidth}px solid rgba(${O},${te},${fe},0.55)`)
      }
      const we = this.gui.domElement
      we.style.setProperty('--text-color', C.textColor)
      we.style.setProperty('--title-background-color', C.titleBgColor)
      we.style.setProperty('--title-text-color', C.titleTextColor)
      we.style.setProperty('--widget-color', C.widgetColor)
    }
    T.add(C, 'bgOpacity', 0, 1, 0.01).name('Window Opacity').onChange(R)
    T.add(C, 'bgBlur', 0, 40, 1).name('Window Blur px').onChange(R)
    T.addColor(C, 'bgColor').name('Background Color').onChange(R)
    T.addColor(C, 'textColor').name('Text Color').onChange(R)
    T.addColor(C, 'titleBgColor').name('Title Background').onChange(R)
    T.addColor(C, 'titleTextColor').name('Title Text Color').onChange(R)
    T.add(C, 'borderRadius', 0, 40, 1).name('Border Radius').onChange(R)
    T.add(C, 'borderWidth', 0, 5, 0.5).name('Border Width').onChange(R)
    T.addColor(C, 'borderColor').name('Border Color').onChange(R)
    T.close()
    let N = false
    const w = this._wideBtn('HIDE DOM — CANVAS ONLY VIEW', () => {
      N = !N
      const k = document.querySelector('.nexus-dom-layer')
      if (k) {
        k.style.opacity = N ? '0' : ''
        k.style.pointerEvents = N ? 'none' : ''
      }
      w.textContent = N ? 'SHOW DOM LAYER' : 'HIDE DOM — CANVAS ONLY VIEW'
    })
    const D = this._labeledSelect(
      'SECTION BLEND',
      [
        'normal',
        'screen',
        'overlay',
        'multiply',
        'color-dodge',
        'lighten',
        'soft-light',
        'difference',
      ],
      (k) => {
        document
          .querySelectorAll(
            '.nexus-dom-layer section, .nexus-dom-layer [class*="section"], .nexus-dom-layer [class*="Section"]',
          )
          .forEach((we) => {
            we.style.mixBlendMode = k
          })
      },
    )
    const P = document.createElement('div')
    P.style.cssText =
      'display:flex;align-items:center;gap:8px;justify-content:space-between;padding:4px 0;'
    const L = document.createElement('input')
    L.type = 'color'
    L.value = '#040c0a'
    L.style.cssText =
      'width:70px;height:26px;border:1px solid rgba(255,255,255,0.12);cursor:pointer;border-radius:6px;'
    L.oninput = () => {
      this.setStore('setGuiValue', ['canvasBg', L.value])
      i.setProperty('--c-deep', L.value)
      document.body.style.background = L.value
    }
    P.append(this._label('CANVAS BG'), L)
    const H = document.createElement('div')
    H.textContent = '— GLASS PANE (z:1, between canvas & DOM) —'
    H.style.cssText =
      'font-size:9px;letter-spacing:0.14em;color:rgba(200,168,75,0.50);padding:6px 0 2px;text-transform:uppercase;text-align:center;'
    let j = false
    let Z = 0
    const $ = this._wideBtn('GLASS PANE: OFF', () => {
      j = !j
      i.setProperty('--glass-pane-opacity', j ? String(Z) : '0')
      $.textContent = j ? 'GLASS PANE: ON' : 'GLASS PANE: OFF'
      $.style.color = j ? 'rgba(200,168,75,0.9)' : 'rgba(200,168,75,0.45)'
    })
    const W = this._rangeRow('OPACITY', 0, 1, 0.01, 0, (k) => {
      Z = k
      i.setProperty('--glass-pane-opacity', String(k))
      if (k > 0 && !j) {
        j = true
        $.textContent = 'GLASS PANE: ON'
        $.style.color = 'rgba(200,168,75,0.9)'
      }
    })
    const X = this._rangeRow('BLUR px', 0, 40, 0.5, 0, (k) => {
      i.setProperty('--glass-pane-filter', k > 0 ? `blur(${k}px) saturate(1.2)` : 'none')
    })
    const ee = document.createElement('div')
    ee.style.cssText =
      'display:flex;align-items:center;gap:8px;justify-content:space-between;padding:3px 0;'
    const G = document.createElement('input')
    G.type = 'color'
    G.value = '#040c0a'
    G.style.cssText =
      'width:70px;height:26px;border:1px solid rgba(255,255,255,0.12);cursor:pointer;border-radius:6px;'
    G.oninput = () => {
      const k = G.value
      const we = parseInt(k.slice(1, 3), 16)
      const Re = parseInt(k.slice(3, 5), 16)
      const ze = parseInt(k.slice(5, 7), 16)
      i.setProperty('--glass-pane-color', `rgba(${we},${Re},${ze},0.6)`)
    }
    ee.append(this._label('TINT COLOR'), G)
    const B = this._labeledSelect(
      'BLEND MODE',
      [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'color-dodge',
        'soft-light',
        'hard-light',
        'difference',
        'exclusion',
      ],
      (k) => {
        i.setProperty('--glass-pane-blend', k)
      },
    )
    const ne = this._wideBtn('RESET GLASS PANE', () => {
      j = false
      Z = 0
      i.setProperty('--glass-pane-opacity', '0')
      i.setProperty('--glass-pane-filter', 'none')
      i.setProperty('--glass-pane-color', 'transparent')
      i.setProperty('--glass-pane-blend', 'normal')
      $.textContent = 'GLASS PANE: OFF'
      $.style.color = 'rgba(200,168,75,0.45)'
      G.value = '#040c0a'
      ne.textContent = 'RESET DONE'
      setTimeout(() => {
        ne.textContent = 'RESET GLASS PANE'
      }, 1500)
    })
    ne.style.color = 'rgba(220,74,26,0.65)'
    ne.style.borderColor = 'rgba(220,74,26,0.25)'
    const ve = document.createElement('div')
    ve.textContent = '— LIQUID GLASS CARDS —'
    ve.style.cssText =
      'font-size:9px;letter-spacing:0.14em;color:rgba(200,168,75,0.50);padding:6px 0 2px;text-transform:uppercase;text-align:center;'
    const Ue = this._rangeRow('CARD BLUR px', 0, 16, 0.5, 3, (k) => {
      i.setProperty('--glass-blur', `${k}px`)
    })
    const De = document.createElement('div')
    De.style.cssText = 'display:flex;align-items:center;gap:8px;padding:3px 0;'
    const Oe = document.createElement('input')
    Oe.type = 'color'
    Oe.value = '#6c6c6c'
    Oe.style.cssText =
      'width:50px;height:22px;cursor:pointer;border-radius:6px;border:1px solid rgba(255,255,255,0.12);'
    const ce = document.createElement('input')
    ce.type = 'range'
    ce.min = '0'
    ce.max = '0.5'
    ce.step = '0.01'
    ce.value = '0.08'
    ce.style.cssText = 'flex:1;'
    const Be = () => {
      const k = Oe.value
      const we = parseInt(k.slice(1, 3), 16)
      const Re = parseInt(k.slice(3, 5), 16)
      const ze = parseInt(k.slice(5, 7), 16)
      i.setProperty('--glass-tint', `rgba(${we},${Re},${ze},${ce.value})`)
    }
    Oe.oninput = Be
    ce.oninput = Be
    De.append(this._label('CARD TINT'), Oe, ce)
    const Ne = this._rangeRow('CARD RADIUS', 0, 40, 1, 20, (k) => {
      i.setProperty('--glass-radius', `${k}px`)
    })
    const Xe = this._labeledSelect(
      'DISTORTION',
      ['subtle (default)', 'strong', 'light', 'none'],
      (k) => {
        const we = {
          'subtle (default)': 'url(#glass-distortion)',
          strong: 'url(#glass-distortion-strong)',
          light: 'url(#glass-distortion-light)',
          none: 'none',
        }
        let Re = document.getElementById('nexus-glass-distort-override')
        if (!Re) {
          Re = document.createElement('style')
          Re.id = 'nexus-glass-distort-override'
          document.head.appendChild(Re)
        }
        const ze = we[k] || 'url(#glass-distortion)'
        Re.textContent =
          ze === 'none'
            ? '.nexus-glass::after,.stat-card::after,.number-card::after,.metric-card::after,.process-card::after,.engine-card::after,.feature-card::after,.solution-card::after,.partner-item::after,.credential-item::after{filter:none;-webkit-filter:none;}'
            : `.nexus-glass::after,.stat-card::after,.number-card::after,.metric-card::after,.process-card::after,.engine-card::after,.feature-card::after,.solution-card::after,.partner-item::after,.credential-item::after{filter:${ze};-webkit-filter:${ze};}`
      },
    )
    const ct = document.createElement('div')
    ct.textContent = '— SECTION BACKGROUNDS —'
    ct.style.cssText =
      'font-size:9px;letter-spacing:0.14em;color:rgba(200,168,75,0.50);padding:6px 0 2px;text-transform:uppercase;text-align:center;'
    const rt = this._rangeRow('EVEN SEC OPACITY', 0, 1, 0.02, 0.9, (k) => {
      const we = je.value
      const Re = parseInt(we.slice(1, 3), 16)
      const ze = parseInt(we.slice(3, 5), 16)
      const Me = parseInt(we.slice(5, 7), 16)
      i.setProperty('--bg-section-even', `rgba(${Re},${ze},${Me},${k})`)
    })
    const ht = document.createElement('div')
    ht.style.cssText = 'display:flex;align-items:center;gap:8px;padding:3px 0;'
    const je = document.createElement('input')
    je.type = 'color'
    je.value = '#141414'
    je.style.cssText =
      'width:60px;height:24px;cursor:pointer;border-radius:6px;border:1px solid rgba(255,255,255,0.12);'
    je.oninput = () => {
      const k = rt.querySelector('input[type=range]')
      const we = k ? k.value : 0.9
      const Re = je.value
      const ze = parseInt(Re.slice(1, 3), 16)
      const Me = parseInt(Re.slice(3, 5), 16)
      const gt = parseInt(Re.slice(5, 7), 16)
      i.setProperty('--bg-section-even', `rgba(${ze},${Me},${gt},${we})`)
    }
    ht.append(this._label('EVEN SEC COLOR'), je)
    const ge = document.createElement('div')
    ge.style.cssText = 'display:flex;align-items:center;gap:8px;padding:3px 0;'
    const Se = document.createElement('input')
    Se.type = 'color'
    Se.value = '#101010'
    Se.style.cssText =
      'width:60px;height:24px;cursor:pointer;border-radius:6px;border:1px solid rgba(255,255,255,0.12);'
    const ye = document.createElement('input')
    ye.type = 'range'
    ye.min = '0'
    ye.max = '1'
    ye.step = '0.02'
    ye.value = '0.96'
    ye.style.cssText = 'flex:1;'
    const J = () => {
      const k = Se.value
      const we = parseInt(k.slice(1, 3), 16)
      const Re = parseInt(k.slice(3, 5), 16)
      const ze = parseInt(k.slice(5, 7), 16)
      i.setProperty('--bg-footer', `rgba(${we},${Re},${ze},${ye.value})`)
    }
    Se.oninput = J
    ye.oninput = J
    ge.append(this._label('FOOTER COLOR'), Se, ye)
    const ke = document.createElement('div')
    ke.textContent = '— ANIMATION —'
    ke.style.cssText =
      'font-size:9px;letter-spacing:0.14em;color:rgba(200,168,75,0.50);padding:6px 0 2px;text-transform:uppercase;text-align:center;'
    const st = this._wideBtn('THEATRE.JS STUDIO: OFF', async () => {
      st.textContent = 'LOADING…'
      st.disabled = true
      try {
        const { initTheatre, toggleStudioUI, isInitialized } =
          await import('./theatreIntegration.js')
        if (isInitialized()) {
          toggleStudioUI()
          st.textContent = 'THEATRE.JS: TOGGLE'
        } else {
          await initTheatre({
            showStudio: true,
          })
          st.textContent = 'THEATRE.JS: ON'
          st.style.color = 'rgba(100,200,120,0.9)'
          st.style.borderColor = 'rgba(100,200,120,0.3)'
        }
      } catch (k) {
        logger.warn('Studio', `Theatre.js unavailable: ${k.message}`)
        st.textContent = 'THEATRE: NOT AVAILABLE'
      }
      st.disabled = false
    })
    t.append(
      s,
      o,
      this._makeDivider(),
      w,
      D,
      P,
      this._makeDivider(),
      H,
      $,
      W,
      X,
      ee,
      B,
      ne,
      this._makeDivider(),
      ve,
      Ue,
      De,
      Ne,
      Xe,
      this._makeDivider(),
      ct,
      rt,
      ht,
      ge,
      this._makeDivider(),
      ke,
      st,
    )
    e.$children.appendChild(t)
    e.close()
  }
  _makeDivider() {
    const e = document.createElement('div')
    e.style.cssText = 'height:1px;background:rgba(255,255,255,0.07);margin:5px 0;'
    return e
  }
  _buildSectionPanel() {
    const e = this.gui.addFolder('Sections')
    const t = this._makeContainer('380px')
    const i = () => {
      t.innerHTML = ''
      const r = this.getSections()
      r.forEach((a, o) => {
        const c = document.createElement('div')
        c.style.cssText = [
          'display:grid',
          'grid-template-columns:1fr 44px 44px 28px',
          'gap:4px',
          'align-items:center',
          'padding:5px 7px',
          'border:1px solid rgba(200,168,75,0.07)',
          'border-radius:3px',
          'background:rgba(4,12,10,0.55)',
          'font-family:DM Mono,monospace',
          'font-size:10px',
        ].join(';')
        const f = document.createElement('span')
        f.textContent = `${o + 1}. ${a.label}`
        f.style.cssText = `opacity:${a.visible ? 1 : 0.3};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(200,168,75,0.85);cursor:default;`
        const d = this._smallBtn(a.visible ? 'ON' : 'OFF', () => {
          a.visible = !a.visible
          const m = this._findSectionEl(a)
          if (m) {
            m.style.display = a.visible ? '' : 'none'
            console.log(`${STUDIO_PREFIX} ${a.label} → ${a.visible ? 'visible' : 'hidden'}`)
          } else {
            console.warn(`${STUDIO_PREFIX} Could not find DOM element for section: ${a.id}`)
          }
          f.style.opacity = a.visible ? 1 : 0.3
          d.textContent = a.visible ? 'ON' : 'OFF'
          d.style.color = a.visible ? '#8ab4b0' : 'rgba(200,168,75,0.3)'
          this.setSections([...r])
        })
        d.style.color = a.visible ? '#8ab4b0' : 'rgba(200,168,75,0.3)'
        const p = this._smallBtn('ED', () => this._openSectionEdit(a, i))
        p.title = `Edit ${a.label}`
        const h = this._smallBtn('X', () => {
          if (
            !confirm(`Remove "${a.label}" from studio list?
(Does not delete the component)`)
          ) {
            return
          }
          const m = this._findSectionEl(a)
          if (m) {
            m.style.display = 'none'
          }
          this.setSections(r.filter((y, S) => S !== o))
          i()
        })
        h.style.color = 'rgba(220,74,26,0.55)'
        c.append(f, d, p, h)
        t.appendChild(c)
      })
      const s = this._wideBtn('+ ADD SECTION (VIBE CODER)', () => {
        const a = this.gui.folders.find((o) => o._title === 'Vibe Coder')
        if (a) {
          a.open()
          a.domElement.scrollIntoView({
            behavior: 'smooth',
          })
        }
      })
      s.style.marginTop = '6px'
      t.appendChild(s)
    }
    i()
    e.$children.appendChild(t)
    e.close()
  }
  _openSectionEdit(e, t) {
    const i = document.createElement('div')
    i.className = 'nexus-modal-backdrop'
    const r = document.createElement('div')
    r.className = 'nexus-modal'
    r.style.position = 'absolute'
    r.style.left = '50%'
    r.style.top = '50%'
    r.style.transform = 'translate(-50%, -50%)'
    const s = document.createElement('div')
    s.textContent = `EDIT — ${e.label.toUpperCase()}`
    s.style.cssText =
      'font-size:12px;letter-spacing:0.18em;color:#c8a84b;padding-bottom:10px;border-bottom:1px solid rgba(200,168,75,0.14);user-select:none;'
    r.appendChild(s)
    const a = {
      ...e,
    }
    const o = this._findSectionEl(e)
    const c = (G) => {
      const B = document.createElement('div')
      B.textContent = G
      B.style.cssText =
        'font-size:8px;letter-spacing:0.18em;color:rgba(200,168,75,0.38);padding-top:8px;border-top:1px solid rgba(200,168,75,0.07);text-transform:uppercase;'
      return B
    }
    const f = (G, B) => {
      const ne = document.createElement('div')
      ne.style.cssText = 'display:flex;flex-direction:column;gap:3px;'
      const ve = document.createElement('label')
      ve.textContent = G.toUpperCase()
      ve.style.cssText = 'font-size:8px;letter-spacing:0.14em;color:rgba(200,168,75,0.42);'
      ne.append(ve, B)
      return ne
    }
    const d = (G, B, ne) => {
      const ve = document.createElement('select')
      ve.style.cssText =
        'background:rgba(4,10,8,0.9);color:#8ab4b0;border:1px solid rgba(255,255,255,0.10);padding:5px 7px;font-family:DM Mono,monospace;font-size:10px;border-radius:3px;width:100%;'
      G.forEach((Ue) => {
        const De = document.createElement('option')
        De.value = Ue
        De.textContent = Ue
        De.selected = Ue === B
        ve.appendChild(De)
      })
      ve.onchange = () => ne(ve.value)
      return ve
    }
    const p = (G, B, ne, ve, Ue) => {
      const De = document.createElement('div')
      De.style.cssText = 'display:flex;gap:8px;align-items:center;'
      const Oe = document.createElement('input')
      Oe.type = 'range'
      Oe.min = G
      Oe.max = B
      Oe.step = ne
      Oe.value = ve
      Oe.style.cssText = 'flex:1;accent-color:#8ab4b0;'
      const ce = document.createElement('span')
      ce.textContent = ve
      ce.style.cssText = 'color:#8ab4b0;min-width:40px;text-align:right;font-size:10px;'
      Oe.oninput = () => {
        ce.textContent = parseFloat(Oe.value).toFixed(ne < 1 ? 2 : 0)
        Ue(parseFloat(Oe.value))
      }
      De.append(Oe, ce)
      return De
    }
    const h = (G, B) => {
      const ne = document.createElement('input')
      ne.type = 'color'
      ne.value = G || '#040c0a'
      ne.style.cssText =
        'width:100%;height:28px;border:1px solid rgba(255,255,255,0.10);cursor:pointer;border-radius:3px;background:transparent;'
      ne.oninput = () => B(ne.value)
      return ne
    }
    const m = (G, B, ne) => {
      const ve = document.createElement('div')
      ve.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;'
      const Ue = h(B, ne)
      Ue.style.width = '72px'
      Ue.style.height = '26px'
      ve.append(this._label(G), Ue)
      return ve
    }
    const y = (...G) => {
      const B = document.createElement('div')
      B.style.cssText = `display:grid;grid-template-columns:repeat(${G.length},1fr);gap:8px;`
      G.forEach((ne) => B.appendChild(ne))
      return B
    }
    r.appendChild(c('■ Visibility & Layer'))
    const S = document.createElement('div')
    S.style.cssText = 'display:flex;align-items:center;justify-content:space-between;'
    const _ = this._smallBtn(a.visible ? 'VISIBLE' : 'HIDDEN', () => {
      a.visible = !a.visible
      if (o) {
        o.style.display = a.visible ? '' : 'none'
      }
      _.textContent = a.visible ? 'VISIBLE' : 'HIDDEN'
      _.style.color = a.visible ? '#8ab4b0' : 'rgba(220,74,26,0.7)'
    })
    _.style.color = a.visible ? '#8ab4b0' : 'rgba(220,74,26,0.7)'
    S.append(this._label('VISIBILITY'), _)
    r.appendChild(S)
    r.appendChild(
      f(
        'Section Opacity (entire section)',
        p(0, 1, 0.01, a.sectionOpacity ?? 1, (G) => {
          a.sectionOpacity = G
          if (o) {
            o.style.opacity = G
          }
        }),
      ),
    )
    r.appendChild(c('■ Blend & Background'))
    r.appendChild(
      f(
        'Mix Blend Mode',
        d(
          [
            'normal',
            'screen',
            'overlay',
            'multiply',
            'color-dodge',
            'color-burn',
            'darken',
            'lighten',
            'soft-light',
            'hard-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity',
          ],
          a.blendMode || 'normal',
          (G) => {
            a.blendMode = G
            if (o) {
              o.style.mixBlendMode = G
            }
          },
        ),
      ),
    )
    r.appendChild(
      m('SECTION BG TINT', a.bgTint || '#040c0a', (G) => {
        a.bgTint = G
        if (o) {
          o.style.setProperty('--sec-bg-color', G + 'dd')
        }
      }),
    )
    r.appendChild(
      f(
        'Section BG Opacity',
        p(0, 1, 0.02, a.bgOpacity ?? 1, (G) => {
          a.bgOpacity = G
          if (o) {
            o.style.setProperty('--sec-bg-opacity', G)
          }
        }),
      ),
    )
    r.appendChild(c('■ Background Image / Video'))
    const v = document.createElement('div')
    v.style.cssText = 'display:flex;flex-direction:column;gap:4px;'
    const x = document.createElement('label')
    x.textContent = 'IMAGE URL (paste or type)'
    x.style.cssText = 'font-size:8px;letter-spacing:0.14em;color:rgba(200,168,75,0.42);'
    const M = document.createElement('input')
    M.type = 'text'
    M.placeholder = 'https://… or /assets/image.jpg'
    M.value = a.bgImageUrl || ''
    M.style.cssText =
      'background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.12);color:#8ab4b0;padding:5px 8px;font-size:11px;border-radius:6px;width:100%;'
    M.oninput = () => {
      a.bgImageUrl = M.value.trim()
      if (o && a.bgImageUrl) {
        o.style.setProperty('--sec-bg-img', `url("${a.bgImageUrl}")`)
        o.style.setProperty('--sec-bg-size', 'cover')
        o.style.setProperty('--sec-bg-pos', 'center')
        const G = o.querySelector('.nexus-sec-video')
        if (G) {
          G.remove()
        }
      } else if (o) {
        o.style.setProperty('--sec-bg-img', 'none')
      }
    }
    v.append(x, M)
    r.appendChild(v)
    r.appendChild(
      y(
        f(
          'BG Size',
          d(['cover', 'contain', '100% auto', 'auto 100%'], a.bgSize || 'cover', (G) => {
            a.bgSize = G
            if (o) {
              o.style.setProperty('--sec-bg-size', G)
            }
          }),
        ),
        f(
          'BG Position',
          d(
            ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right'],
            a.bgPos || 'center',
            (G) => {
              a.bgPos = G
              if (o) {
                o.style.setProperty('--sec-bg-pos', G)
              }
            },
          ),
        ),
      ),
    )
    const T = document.createElement('div')
    T.style.cssText = 'display:flex;flex-direction:column;gap:4px;'
    const C = document.createElement('label')
    C.textContent = 'VIDEO URL (.mp4/.webm — replaces image)'
    C.style.cssText = 'font-size:8px;letter-spacing:0.14em;color:rgba(200,168,75,0.42);'
    const R = document.createElement('input')
    R.type = 'text'
    R.placeholder = 'https://… or /assets/video.mp4'
    R.value = a.bgVideoUrl || ''
    R.style.cssText =
      'background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.12);color:#8ab4b0;padding:5px 8px;font-size:11px;border-radius:6px;width:100%;'
    R.oninput = () => {
      a.bgVideoUrl = R.value.trim()
      if (!o) {
        return
      }
      const G = o.querySelector('.nexus-sec-video')
      if (G) {
        G.remove()
      }
      if (a.bgVideoUrl) {
        o.style.setProperty('--sec-bg-img', 'none')
        const B = document.createElement('video')
        B.className = 'nexus-sec-video'
        B.src = a.bgVideoUrl
        B.autoplay = true
        B.loop = true
        B.muted = true
        B.playsInline = true
        B.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;'
        o.style.position = 'relative'
        o.insertBefore(B, o.firstChild)
      }
    }
    T.append(C, R)
    r.appendChild(T)
    const N = this._wideBtn('✕ CLEAR BACKGROUND MEDIA', () => {
      a.bgImageUrl = ''
      a.bgVideoUrl = ''
      M.value = ''
      R.value = ''
      if (o) {
        o.style.setProperty('--sec-bg-img', 'none')
        const G = o.querySelector('.nexus-sec-video')
        if (G) {
          G.remove()
        }
      }
      N.textContent = 'CLEARED'
      setTimeout(() => {
        N.textContent = '✕ CLEAR BACKGROUND MEDIA'
      }, 1500)
    })
    N.style.marginTop = '4px'
    r.appendChild(N)
    r.appendChild(c('■ Cards within Section'))
    r.appendChild(
      y(
        f(
          'Card Opacity',
          p(0, 1, 0.01, a.glassOpacity ?? 0.45, (G) => {
            a.glassOpacity = G
            if (o) {
              o.querySelectorAll(
                '.nexus-glass,.stat-card,.process-card,.feature-card,.number-card,.engine-card,.partner-item,.comparison-table-wrap',
              ).forEach((B) => {
                B.style.background = `rgba(4,12,10,${G})`
              })
            }
          }),
        ),
        f(
          'Card Blur px',
          p(0, 16, 0.5, a.glassBlur ?? 3, (G) => {
            a.glassBlur = G
            if (o) {
              o.querySelectorAll(
                '.nexus-glass,.stat-card,.process-card,.feature-card,.number-card,.engine-card',
              ).forEach((B) => {
                B.style.setProperty('--glass-blur', `${G}px`)
              })
            }
          }),
        ),
      ),
    )
    r.appendChild(c('■ Layout & Spacing'))
    r.appendChild(
      y(
        f(
          'Padding Top px',
          p(0, 200, 4, a.paddingTop ?? 80, (G) => {
            a.paddingTop = G
            if (o) {
              o.style.paddingTop = `${G}px`
            }
          }),
        ),
        f(
          'Padding Bottom px',
          p(0, 200, 4, a.paddingBottom ?? 80, (G) => {
            a.paddingBottom = G
            if (o) {
              o.style.paddingBottom = `${G}px`
            }
          }),
        ),
      ),
    )
    r.appendChild(
      f(
        'Text Align',
        d(['left', 'center', 'right', 'justify'], a.textAlign || 'left', (G) => {
          a.textAlign = G
          if (o) {
            o.style.textAlign = G
          }
        }),
      ),
    )
    r.appendChild(c('■ Border'))
    r.appendChild(
      y(
        f(
          'Border Width px',
          p(0, 8, 1, a.borderWidth ?? 0, (G) => {
            a.borderWidth = G
            if (o) {
              o.style.borderWidth = `${G}px`
            }
            if (o && G > 0) {
              o.style.borderStyle = 'solid'
              o.style.borderColor = a.borderColor || 'rgba(200,168,75,0.2)'
            }
          }),
        ),
        f(
          'Border Radius px',
          p(0, 40, 1, a.borderRadius ?? 0, (G) => {
            a.borderRadius = G
            if (o) {
              o.style.borderRadius = `${G}px`
            }
          }),
        ),
      ),
    )
    r.appendChild(
      m('BORDER COLOR', a.borderColor || '#c8a84b', (G) => {
        a.borderColor = G
        if (o && (a.borderWidth ?? 0) > 0) {
          o.style.borderColor = G
        }
      }),
    )
    r.appendChild(c('■ Typography'))
    r.appendChild(
      y(
        f(
          'Heading Size rem',
          p(0.5, 8, 0.1, a.headingSize ?? 2.5, (G) => {
            a.headingSize = G
            if (o) {
              o.querySelectorAll('h1,h2,h3,.section-title,.section-heading').forEach((B) => {
                B.style.fontSize = `${G}rem`
              })
            }
          }),
        ),
        f(
          'Body Size rem',
          p(0.5, 2.5, 0.05, a.bodySize ?? 1, (G) => {
            a.bodySize = G
            if (o) {
              o.querySelectorAll('p,.body-text').forEach((B) => {
                B.style.fontSize = `${G}rem`
              })
            }
          }),
        ),
      ),
    )
    r.appendChild(
      y(
        f(
          'Font Weight',
          p(100, 900, 100, a.fontWeight ?? 400, (G) => {
            a.fontWeight = G
            if (o) {
              o.querySelectorAll('h1,h2,h3,h4,p').forEach((B) => {
                B.style.fontWeight = G
              })
            }
          }),
        ),
        f(
          'Letter Spacing em',
          p(-0.05, 0.5, 0.01, a.letterSpacing ?? 0.04, (G) => {
            a.letterSpacing = G
            if (o) {
              o.querySelectorAll('h1,h2,h3,.section-title').forEach((B) => {
                B.style.letterSpacing = `${G}em`
              })
            }
          }),
        ),
      ),
    )
    r.appendChild(
      y(
        m('HEADING COLOR', a.headingColor || '#ffffff', (G) => {
          a.headingColor = G
          if (o) {
            o.querySelectorAll('h1,h2,h3,h4,.section-title,.section-heading').forEach((B) => {
              B.style.color = G
            })
          }
        }),
        m('BODY COLOR', a.bodyColor || '#e0e0e0', (G) => {
          a.bodyColor = G
          if (o) {
            o.querySelectorAll('p,span:not(.eyebrow),.body-text').forEach((B) => {
              B.style.color = G
            })
          }
        }),
      ),
    )
    r.appendChild(
      m('ACCENT COLOR', a.accentColor || '#8ab4b0', (G) => {
        a.accentColor = G
        if (o) {
          o.querySelectorAll('.section-label,.eyebrow,.section-eyebrow,.cta-primary').forEach(
            (B) => {
              B.style.color = G
            },
          )
        }
      }),
    )
    r.appendChild(c('■ Entrance Animation (GSAP)'))
    r.appendChild(
      f(
        'Animation Type',
        d(
          [
            'none',
            'fadeUp',
            'fadeIn',
            'blurIn',
            'slideLeft',
            'slideRight',
            'scaleIn',
            'splitWord',
            'splitChar',
          ],
          a.animType || 'none',
          (G) => {
            a.animType = G
          },
        ),
      ),
    )
    r.appendChild(
      y(
        f(
          'Duration s',
          p(0.1, 3, 0.1, a.animDuration ?? 0.8, (G) => {
            a.animDuration = G
          }),
        ),
        f(
          'Delay s',
          p(0, 2, 0.1, a.animDelay ?? 0, (G) => {
            a.animDelay = G
          }),
        ),
      ),
    )
    r.appendChild(
      y(
        f(
          'Ease',
          d(
            ['power2.out', 'power3.out', 'expo.out', 'elastic.out', 'back.out(1.7)', 'sine.inOut'],
            a.animEase || 'power2.out',
            (G) => {
              a.animEase = G
            },
          ),
        ),
        f(
          'Trigger',
          d(['onScroll', 'onLoad', 'never'], a.animTrigger || 'onScroll', (G) => {
            a.animTrigger = G
          }),
        ),
      ),
    )
    const w = this._wideBtn('▷ PREVIEW ANIMATION', () => {
      if (a.animType === 'none' || !o) {
        return
      }
      const G = window.gsap || gsap
      if (!G) {
        w.textContent = 'GSAP NOT LOADED'
        return
      }
      G.fromTo(
        o,
        {
          opacity: 0,
          y: a.animType === 'fadeUp' ? 40 : 0,
          scale: a.animType === 'scaleIn' ? 0.85 : 1,
          filter: a.animType === 'blurIn' ? 'blur(20px)' : 'none',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'none',
          duration: a.animDuration ?? 0.8,
          ease: a.animEase || 'power2.out',
          delay: a.animDelay ?? 0,
        },
      )
    })
    r.appendChild(w)
    r.appendChild(c('■ Theme & Scroll Transition'))
    r.appendChild(
      y(
        f(
          'Theme Override',
          d(
            ['— none —', 'peacock', 'solar', 'crystal', 'macaw', 'water', 'mycelium'],
            a.theme || '— none —',
            (G) => {
              a.theme = G === '— none —' ? '' : G
            },
          ),
        ),
        f(
          'Scroll Transition',
          d(
            ['morph', 'dissolve', 'crystallize', 'burn', 'flow', 'shatter'],
            a.transitionEffect || 'morph',
            (G) => {
              a.transitionEffect = G
            },
          ),
        ),
      ),
    )
    r.appendChild(c('■ Custom CSS (injected scoped to this section)'))
    const D = document.createElement('textarea')
    D.value = a.customCSS || ''
    D.rows = 5
    D.placeholder = `/* Scoped to #nexus-sec-${e.id} */
h1 { font-size: 7rem; }
.stat-card { border-radius: 12px; }`
    D.style.cssText =
      'background:rgba(0,0,0,0.4);color:#8ab4b0;border:1px solid rgba(255,255,255,0.10);padding:8px;border-radius:3px;width:100%;font-family:DM Mono,monospace;font-size:10px;resize:vertical;box-sizing:border-box;line-height:1.5;'
    D.oninput = () => {
      a.customCSS = D.value
    }
    const P = this._wideBtn('APPLY CSS NOW', () => {
      if (!a.customCSS) {
        return
      }
      const G = `nexus-sec-css-${e.id}`
      let B = document.getElementById(G)
      if (!B) {
        B = document.createElement('style')
        B.id = G
        document.head.appendChild(B)
      }
      B.textContent = `#nexus-sec-${e.id} { ${a.customCSS} }`
      P.textContent = '✓ APPLIED'
      setTimeout(() => {
        P.textContent = 'APPLY CSS NOW'
      }, 1500)
    })
    P.style.color = '#c8a84b'
    const L = document.createElement('div')
    L.style.cssText = 'display:flex;flex-direction:column;gap:4px;'
    L.append(D, P)
    r.appendChild(L)
    r.appendChild(c('■ Particle Shape for this Section'))
    r.appendChild(
      f(
        'Shape on Entry',
        d(
          ['— inherit global —', 'Plane', 'Sphere', 'Cylinder', 'Torus', 'Explode'],
          a.morphShape || '— inherit global —',
          (G) => {
            a.morphShape = G === '— inherit global —' ? '' : G
          },
        ),
      ),
    )
    const H = this._wideBtn('PREVIEW SHAPE NOW', () => {
      var ne
      var ve
      var Ue
      var De
      var Oe
      const G = window.__nexusWorkshop
      if (!G) {
        H.textContent = 'WORKSHOP NOT READY'
        setTimeout(() => {
          H.textContent = 'PREVIEW SHAPE NOW'
        }, 2000)
        return
      }
      const B =
        a.morphShape ||
        ((ve = (ne = G.params) == null ? undefined : ne.transform) == null
          ? undefined
          : ve.shape) ||
        'Plane'
      if ((Ue = G.params) != null && Ue.transform) {
        G.params.transform.shape = B
      }
      if ((Oe = (De = G._callbacks) == null ? undefined : De.onTick) != null) {
        Oe.call(De)
      }
      H.textContent = `PREVIEWING: ${B}`
      setTimeout(() => {
        H.textContent = 'PREVIEW SHAPE NOW'
      }, 2500)
    })
    r.appendChild(H)
    const j = document.createElement('div')
    j.style.cssText =
      'display:flex;gap:8px;margin-top:6px;padding-top:10px;border-top:1px solid rgba(200,168,75,0.1);'
    const Z = this._btn(
      'SAVE & CLOSE',
      'rgba(138,180,176,0.10)',
      'rgba(138,180,176,0.25)',
      '#8ab4b0',
      () => {
        Object.assign(e, a)
        if (a.customCSS) {
          const G = `nexus-sec-css-${e.id}`
          let B = document.getElementById(G)
          if (!B) {
            B = document.createElement('style')
            B.id = G
            document.head.appendChild(B)
          }
          B.textContent = `#nexus-sec-${e.id} { ${a.customCSS} }`
        }
        this.setSections([...this.getSections()])
        t()
        document.body.removeChild(i)
      },
    )
    const $ = this._btn(
      'CANCEL',
      'transparent',
      'rgba(200,168,75,0.15)',
      'rgba(200,168,75,0.5)',
      () => {
        document.body.removeChild(i)
      },
    )
    const W = this._btn(
      'RESET',
      'transparent',
      'rgba(220,74,26,0.2)',
      'rgba(220,74,26,0.6)',
      () => {
        if (confirm('Reset all style changes for this section?')) {
          if (o) {
            ;[
              'opacity',
              'mixBlendMode',
              'backgroundColor',
              'paddingTop',
              'paddingBottom',
              'textAlign',
              'borderWidth',
              'borderRadius',
              'borderColor',
              'borderStyle',
              'filter',
            ].forEach((G) => {
              o.style[G] = ''
            })
          }
          document.body.removeChild(i)
          this._openSectionEdit(e, t)
        }
      },
    )
    j.append(Z, $, W)
    r.appendChild(j)
    i.appendChild(r)
    document.body.appendChild(i)
    this._makeDraggable(r, s)
    i.addEventListener('click', (G) => {
      if (G.target === i) {
        document.body.removeChild(i)
      }
    })
    const X = (G) => {
      if (G.key === 'Escape') {
        G.stopImmediatePropagation()
        G.preventDefault()
        document.removeEventListener('keydown', X, true)
        if (i.parentNode) {
          document.body.removeChild(i)
        }
      }
    }
    document.addEventListener('keydown', X, true)
    const ee = new MutationObserver(() => {
      if (!i.parentNode) {
        document.removeEventListener('keydown', X, true)
        ee.disconnect()
      }
    })
    ee.observe(document.body, {
      childList: true,
    })
    setTimeout(() => {
      var G
      if ((G = r.querySelector('select, input, button')) == null) {
        return undefined
      } else {
        return G.focus()
      }
    }, 50)
  }
  _buildImagePanel() {
    const e = this.gui.addFolder('Image Layer')
    const t = this._makeContainer()
    const i = document.createElement('div')
    i.style.cssText =
      'font-size:9px;color:rgba(200,210,215,0.60);min-height:14px;letter-spacing:0.06em;padding:2px 0;'
    i.textContent = 'Drop an image or select a preset'
    const r = document.createElement('canvas')
    r.width = 320
    r.height = 180
    r.style.cssText =
      'width:100%;border:1px solid rgba(255,255,255,0.10);border-radius:4px;background:#020807;cursor:pointer;display:block;'
    r.title = 'Click or drop image here'
    const s = () => {
      const v = r.getContext('2d')
      v.clearRect(0, 0, 320, 180)
      v.fillStyle = 'rgba(138,180,176,0.08)'
      v.fillRect(0, 0, 320, 180)
      v.fillStyle = 'rgba(138,180,176,0.30)'
      v.font = '11px DM Mono, monospace'
      v.textAlign = 'center'
      v.fillText('CLICK OR DROP IMAGE', 160, 82)
      v.fillStyle = 'rgba(255,255,255,0.12)'
      v.font = '9px DM Mono, monospace'
      v.fillText('JPEG  PNG  WEBP  AVIF', 160, 100)
      v.fillText('Maps to 3D mesh with bokeh shader', 160, 118)
    }
    s()
    const a = document.createElement('input')
    a.type = 'file'
    a.accept = 'image/*'
    a.style.display = 'none'
    document.body.appendChild(a)
    const o = this.getStore().imagePlaneConfig || {
      opacity: 0.85,
      blur: 0,
      vignette: 0.5,
      saturation: 1.2,
      exposure: 1,
    }
    const c = this._rangeRow('OPACITY', 0, 1, 0.01, o.opacity, (v) => {
      this.setStore('setImagePlaneConfig', {
        opacity: v,
      })
    })
    const f = this._rangeRow('BOKEH BLUR', 0, 1, 0.01, o.blur, (v) => {
      this.setStore('setImagePlaneConfig', {
        blur: v,
      })
    })
    const d = this._rangeRow('VIGNETTE', 0, 1, 0.01, o.vignette, (v) => {
      this.setStore('setImagePlaneConfig', {
        vignette: v,
      })
    })
    const p = this._rangeRow('SATURATION', 0, 3, 0.05, o.saturation, (v) => {
      this.setStore('setImagePlaneConfig', {
        saturation: v,
      })
    })
    const h = this._rangeRow('EXPOSURE', 0, 3, 0.05, o.exposure, (v) => {
      this.setStore('setImagePlaneConfig', {
        exposure: v,
      })
    })
    const m = (v, x) => {
      const M = new window.Image()
      M.onload = () => {
        const T = r.getContext('2d')
        T.clearRect(0, 0, 320, 180)
        const C = Math.min(320 / M.width, 180 / M.height)
        const R = M.width * C
        const N = M.height * C
        T.drawImage(M, (320 - R) / 2, (180 - N) / 2, R, N)
        i.textContent = `✓ ${x}`
        r.style.borderColor = 'rgba(138,180,176,0.35)'
      }
      M.src = v
      this.setStore('setImageTextureUrl', v)
      console.log(`${STUDIO_PREFIX} Image layer set: ${x}`)
    }
    r.addEventListener('click', () => a.click())
    r.addEventListener('dragover', (v) => {
      v.preventDefault()
      r.style.borderColor = '#8ab4b0'
      r.style.boxShadow = '0 0 16px rgba(255,255,255,0.15)'
    })
    r.addEventListener('dragleave', () => {
      r.style.borderColor = 'rgba(255,255,255,0.10)'
      r.style.boxShadow = ''
    })
    r.addEventListener('drop', (v) => {
      v.preventDefault()
      r.style.borderColor = 'rgba(255,255,255,0.10)'
      r.style.boxShadow = ''
      const x = v.dataTransfer.files[0]
      if (x && x.type.startsWith('image/')) {
        const M = URL.createObjectURL(x)
        m(M, x.name.slice(0, 30))
      }
    })
    a.addEventListener('change', () => {
      const v = a.files[0]
      if (v) {
        const x = URL.createObjectURL(v)
        m(x, v.name.slice(0, 30))
      }
      a.value = ''
    })
    const y = this._labeledSelect(
      'PRESET IMAGE',
      ['Select a preset...', ...PARTICLE_IMAGE_OPTIONS.filter((v) => v.value).map((v) => v.label)],
      (v) => {
        const x = PARTICLE_IMAGE_OPTIONS.find((M) => M.label === v)
        if (x != null && x.value) {
          const M = `/particle-images/${x.value}`
          m(M, x.label)
        }
      },
    )
    const S = document.createElement('div')
    S.style.cssText = 'display:flex;gap:6px;'
    const _ = this._btn(
      'CLEAR IMAGE',
      'transparent',
      'rgba(220,74,26,0.2)',
      'rgba(220,74,26,0.7)',
      () => {
        this.setStore('setImageTextureUrl', null)
        i.textContent = 'Image cleared — particle cloud only'
        s()
        r.style.borderColor = 'rgba(255,255,255,0.10)'
      },
    )
    _.style.flex = '1'
    _.style.padding = '7px 0'
    S.appendChild(_)
    t.append(r, y, c, f, d, p, h, S, i)
    e.$children.appendChild(t)
    e.close()
  }
  _buildVibeCoderPanel() {
    var y
    var S
    var _
    const e = this.gui.addFolder('Vibe Coder')
    const t = this._makeContainer()
    const i = {
      template: ((y = this.state.vibeCoder) == null ? undefined : y.lastTemplate) || 'statBlock',
      theme: ((S = this.state.vibeCoder) == null ? undefined : S.lastTheme) || 'solar',
      effect: ((_ = this.state.vibeCoder) == null ? undefined : _.lastEffect) || 'glassCard',
      content: '',
    }
    const r = this._labeledSelect(
      'TEMPLATE',
      Object.entries(COMPONENT_TEMPLATES).map(([v, x]) => `${v}: ${x.label}`),
      (v) => {
        i.template = v.split(':')[0].trim()
      },
    )
    const s = this._labeledSelect(
      'THEME',
      ['peacock', 'solar', 'crystal', 'macaw', 'water', 'mycelium'],
      (v) => {
        i.theme = v
      },
    )
    const a = this._labeledSelect(
      'EFFECT',
      ['glassCard', 'frostedRow', 'fullBleed', 'splitFeature'],
      (v) => {
        i.effect = v
      },
    )
    const o = this._label('CONTENT BRIEF')
    const c = document.createElement('textarea')
    c.placeholder = 'Describe this section: title, key stats, body text...'
    c.rows = 3
    c.style.cssText =
      'background:#040c0a;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.10);padding:6px;font-family:DM Mono,monospace;font-size:10px;border-radius:2px;width:100%;resize:vertical;box-sizing:border-box;line-height:1.5;'
    c.oninput = () => {
      i.content = c.value
    }
    const f = document.createElement('textarea')
    f.readOnly = true
    f.rows = 10
    f.style.cssText =
      'background:rgba(0,0,0,0.4);color:rgba(200,210,215,0.80);border:1px solid rgba(255,255,255,0.08);padding:6px;font-family:DM Mono,monospace;font-size:9px;border-radius:2px;width:100%;resize:vertical;box-sizing:border-box;line-height:1.45;'
    const d = this._wideBtn('GENERATE SECTION JSX', () => {
      const v = i.template
      const x = COMPONENT_TEMPLATES[v]
      if (!x) {
        f.value = `// Template "${v}" not found
// Available: ${Object.keys(COMPONENT_TEMPLATES).join(', ')}`
        return
      }
      try {
        f.value = x.generate({
          theme: i.theme,
          effect: i.effect,
          content: i.content || '[Add content brief above]',
        })
      } catch (M) {
        f.value = `// Generation error: ${M.message}`
      }
    })
    d.style.color = '#c8a84b'
    const p = document.createElement('div')
    p.style.cssText = 'display:flex;gap:6px;'
    const h = this._btn(
      'COPY JSX',
      'rgba(4,12,10,0.8)',
      'rgba(200,168,75,0.2)',
      'rgba(200,168,75,0.7)',
      () => {
        var v
        if (!f.value || f.value.startsWith('//')) {
          h.textContent = 'GENERATE FIRST'
          setTimeout(() => {
            h.textContent = 'COPY JSX'
          }, 2000)
          return
        }
        if ((v = navigator.clipboard) != null) {
          v.writeText(f.value)
            .then(() => {
              h.textContent = 'COPIED'
              setTimeout(() => {
                h.textContent = 'COPY JSX'
              }, 2000)
            })
            .catch(() => {
              f.select()
              document.execCommand('copy')
            })
        }
      },
    )
    h.style.flex = '1'
    const m = this._btn(
      'ADD TO PAGE',
      'rgba(138,180,176,0.08)',
      'rgba(138,180,176,0.25)',
      '#8ab4b0',
      () => {
        const v = {
          id: `custom-${Date.now()}`,
          componentName: 'CustomSection',
          label: `Custom: ${i.template}`,
          visible: true,
          theme: i.theme,
          transitionEffect: 'morph',
          glassOpacity: 0.62,
          glassBlur: 16,
          customCSS: '',
          _generatedCode: f.value,
        }
        this.setSections([...this.getSections(), v])
        alert(`Section registered: "${v.label}"

1. Copy the JSX above
2. Create: src/components/custom/${v.id}.jsx
3. Import it in App.jsx`)
      },
    )
    m.style.flex = '1'
    p.append(h, m)
    t.append(r, s, a, o, c, d, this._label('GENERATED JSX'), f, p)
    e.$children.appendChild(t)
    e.close()
  }
  _buildPresetsPanel() {
    const e = this.gui.addFolder('Presets')
    const t = this._makeContainer()
    const i = document.createElement('input')
    i.type = 'text'
    i.placeholder = 'Preset name'
    i.value = this.state.presetName || 'default'
    i.style.cssText =
      'background:#040c0a;color:#c8a84b;border:1px solid rgba(200,168,75,0.2);padding:5px 8px;font-family:DM Mono,monospace;font-size:10px;border-radius:2px;width:100%;box-sizing:border-box;'
    const r = document.createElement('div')
    r.style.cssText =
      'font-size:9px;color:rgba(200,210,215,0.55);min-height:14px;letter-spacing:0.06em;'
    const s = (h, m = true) => {
      r.textContent = h
      r.style.color = m ? 'rgba(200,210,215,0.65)' : 'rgba(220,74,26,0.7)'
    }
    const a = document.createElement('div')
    a.style.cssText = 'display:flex;gap:6px;'
    a.append(
      this._btn('SAVE', 'rgba(138,180,176,0.08)', 'rgba(255,255,255,0.15)', '#8ab4b0', () => {
        const h = i.value || 'default'
        studioStorage.save({
          ...this.state,
          presetName: h,
        })
        s(`Saved: ${h}`)
      }),
      this._btn('LOAD', 'rgba(4,12,10,0.8)', 'rgba(200,168,75,0.2)', 'rgba(200,168,75,0.7)', () => {
        var m
        var y
        const h = studioStorage.load()
        Object.assign(this.state, h)
        i.value = h.presetName || 'default'
        s(`Loaded: ${h.presetName || '(unnamed)'}`)
        document.documentElement.style.setProperty(
          '--nexus-panel-opacity',
          ((m = h.scene) == null ? undefined : m.panelOpacity) ?? 0.62,
        )
        document.documentElement.style.setProperty(
          '--nexus-panel-blur',
          `${((y = h.scene) == null ? undefined : y.panelBlur) ?? 16}px`,
        )
      }),
    )
    const o = document.createElement('div')
    o.style.cssText = 'display:flex;gap:6px;'
    o.append(
      this._btn(
        'EXPORT JSON',
        'rgba(4,12,10,0.8)',
        'rgba(200,168,75,0.2)',
        'rgba(200,168,75,0.7)',
        () => {
          const h = JSON.stringify(studioStorage.load(), null, 2)
          const m = document.createElement('a')
          const y = i.value || 'nexus-studio'
          m.href = URL.createObjectURL(
            new Blob([h], {
              type: 'application/json',
            }),
          )
          m.download = `${y}.json`
          m.click()
          URL.revokeObjectURL(m.href)
          s(`Exported: ${y}.json`)
        },
      ),
      this._btn(
        'IMPORT JSON',
        'rgba(4,12,10,0.8)',
        'rgba(200,168,75,0.2)',
        'rgba(200,168,75,0.7)',
        () => {
          const h = document.createElement('input')
          h.type = 'file'
          h.accept = '.json'
          h.onchange = () => {
            const m = new FileReader()
            m.onload = (y) => {
              try {
                const S = JSON.parse(y.target.result)
                studioStorage.save(S)
                Object.assign(this.state, S)
                i.value = S.presetName || h.files[0].name.replace('.json', '')
                s(`Imported: ${S.presetName || h.files[0].name}`)
              } catch (S) {
                s(`Import failed: ${S.message}`, false)
              }
            }
            m.readAsText(h.files[0])
          }
          h.click()
        },
      ),
    )
    const c = document.createElement('div')
    c.style.cssText = 'height:1px;background:rgba(255,255,255,0.07);margin:5px 0;'
    let f = false
    const d = this._wideBtn('THEATRE.JS STUDIO: OFF', async () => {
      d.textContent = 'LOADING…'
      d.disabled = true
      try {
        const { initTheatre, toggleStudioUI, isInitialized } =
          await import('./theatreIntegration.js')
        if (isInitialized()) {
          toggleStudioUI()
          f = !f
          d.textContent = f ? 'THEATRE.JS: ON' : 'THEATRE.JS: PAUSED'
        } else {
          await initTheatre({
            showStudio: true,
          })
          f = true
          d.textContent = 'THEATRE.JS: ON'
          d.style.color = 'rgba(100,200,120,0.9)'
          d.style.borderColor = 'rgba(100,200,120,0.3)'
        }
      } catch (h) {
        logger.warn('Studio', `Theatre.js unavailable: ${h.message}`)
        d.textContent = 'THEATRE: NOT AVAILABLE'
        d.style.color = 'rgba(220,74,26,0.7)'
      }
      d.disabled = false
    })
    d.style.marginTop = '4px'
    const p = document.createElement('div')
    p.innerHTML =
      'G&nbsp;=&nbsp;toggle&nbsp;|&nbsp;P&nbsp;=&nbsp;particles&nbsp;|&nbsp;Esc&nbsp;=&nbsp;close&nbsp;|&nbsp;Ctrl+S&nbsp;=&nbsp;save'
    p.style.cssText =
      'font-size:9px;color:rgba(200,168,75,0.25);letter-spacing:0.06em;margin-top:4px;'
    t.append(i, a, o, r, c, d, p)
    e.$children.appendChild(t)
    e.open()
  }
  _onKeyDown(e) {
    var i
    if (!this.hotkeysEnabled) {
      return
    }
    const t = (i = document.activeElement) == null ? undefined : i.tagName
    if (t !== 'INPUT' && t !== 'TEXTAREA' && t !== 'SELECT') {
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        this.toggle()
      }
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault()
        this.close()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        studioStorage.save(this.state)
        console.log(`${STUDIO_PREFIX} Auto-saved (Ctrl+S)`)
      }
    }
  }
  _makeContainer(e = null) {
    const t = document.createElement('div')
    t.style.cssText = `padding:8px 4px;display:flex;flex-direction:column;gap:7px;${e ? `max-height:${e};overflow-y:auto;scrollbar-width:thin;` : ''}`
    return t
  }
  _label(e) {
    const t = document.createElement('span')
    t.textContent = e.toUpperCase()
    t.style.cssText = 'font-size:9px;letter-spacing:0.12em;color:rgba(200,168,75,0.48);'
    return t
  }
  _btn(e, t, i, r, s) {
    const a = document.createElement('button')
    a.textContent = e
    a.style.cssText = `padding:5px 10px;background:${t};border:1px solid ${i};color:${r};font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.1em;cursor:pointer;border-radius:2px;transition:background 0.12s,border-color 0.12s;`
    a.onmouseenter = () => {
      a.style.background = 'rgba(200,168,75,0.08)'
      a.style.borderColor = 'rgba(200,168,75,0.3)'
    }
    a.onmouseleave = () => {
      a.style.background = t
      a.style.borderColor = i
    }
    a.onclick = s
    return a
  }
  _smallBtn(e, t) {
    return this._btn(e, 'rgba(4,12,10,0.8)', 'rgba(200,168,75,0.18)', 'rgba(200,168,75,0.65)', t)
  }
  _wideBtn(e, t) {
    const i = this._btn(e, 'rgba(4,12,10,0.8)', 'rgba(200,168,75,0.18)', 'rgba(200,168,75,0.6)', t)
    i.style.width = '100%'
    i.style.padding = '7px 8px'
    return i
  }
  _labeledSelect(e, t, i) {
    const r = document.createElement('div')
    r.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:space-between;'
    const s = this._label(e)
    const a = document.createElement('select')
    a.style.cssText =
      'background:#040c0a;color:#8ab4b0;border:1px solid rgba(255,255,255,0.10);padding:3px 6px;font-size:10px;font-family:DM Mono,monospace;border-radius:2px;flex:1;max-width:190px;'
    t.forEach((o) => {
      const c = document.createElement('option')
      c.value = o
      c.textContent = o
      a.appendChild(c)
    })
    a.onchange = () => i(a.value)
    r.append(s, a)
    return r
  }
  _rangeRow(e, t, i, r, s, a) {
    const o = document.createElement('div')
    o.style.cssText = 'display:flex;align-items:center;gap:6px;'
    const c = this._label(e)
    c.style.cssText += 'min-width:82px;'
    const f = document.createElement('input')
    f.type = 'range'
    f.min = t
    f.max = i
    f.step = r
    f.value = s
    f.style.flex = '1'
    f.style.accentColor = '#8ab4b0'
    const d = document.createElement('span')
    d.textContent = s
    d.style.cssText = 'color:#8ab4b0;min-width:36px;text-align:right;font-size:10px;'
    f.oninput = () => {
      a(parseFloat(f.value))
      d.textContent = parseFloat(f.value).toFixed(2)
    }
    o.append(c, f, d)
    return o
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
}
