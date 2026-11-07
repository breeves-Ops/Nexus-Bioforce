import { create } from 'zustand'
import { findSectionElement } from '../utils/sectionTargets'

export const STORE_PREFIX = '[NEXUS_BIOFORCE_SYSTEM]'

const DEFAULT_SECTIONS = [
  {
    id: 'hero',
    label: 'Hero',
    componentName: 'HeroSection',
    visible: true,
    theme: '',
    glassOpacity: 0,
    glassBlur: 0,
    blendMode: 'normal',
    transitionEffect: 'morph',
    customCSS: '',
  },
  {
    id: 'ticker',
    label: 'Ticker',
    componentName: 'TickerBand',
    visible: true,
    theme: '',
    glassOpacity: 0.55,
    glassBlur: 8,
    blendMode: 'normal',
    transitionEffect: 'flow',
    customCSS: '',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    componentName: 'NexusNumbers',
    visible: true,
    theme: 'peacock',
    glassOpacity: 0.7,
    glassBlur: 16,
    blendMode: 'normal',
    transitionEffect: 'crystallize',
    customCSS: '',
  },
  {
    id: 'crisis',
    label: 'Crisis',
    componentName: 'NexusCrisis',
    visible: true,
    theme: 'solar',
    glassOpacity: 0.65,
    glassBlur: 14,
    blendMode: 'normal',
    transitionEffect: 'burn',
    customCSS: '',
  },
  {
    id: 'solution',
    label: 'Solution',
    componentName: 'NexusSolution',
    visible: true,
    theme: 'solar',
    glassOpacity: 0.68,
    glassBlur: 16,
    blendMode: 'normal',
    transitionEffect: 'morph',
    customCSS: '',
  },
  {
    id: 'process',
    label: 'Process',
    componentName: 'NexusProcess',
    visible: true,
    theme: 'crystal',
    glassOpacity: 0.62,
    glassBlur: 16,
    blendMode: 'normal',
    transitionEffect: 'dissolve',
    customCSS: '',
  },
  {
    id: 'stakeholders',
    label: 'Stakeholders',
    componentName: 'NexusStakeholders',
    visible: true,
    theme: 'macaw',
    glassOpacity: 0.62,
    glassBlur: 16,
    blendMode: 'normal',
    transitionEffect: 'morph',
    customCSS: '',
  },
  {
    id: 'media',
    label: 'Media',
    componentName: 'NexusMedia',
    visible: true,
    theme: 'water',
    glassOpacity: 0.6,
    glassBlur: 12,
    blendMode: 'normal',
    transitionEffect: 'flow',
    customCSS: '',
  },
  {
    id: 'comparison',
    label: 'Comparison',
    componentName: 'NexusComparison',
    visible: true,
    theme: 'crystal',
    glassOpacity: 0.82,
    glassBlur: 22,
    blendMode: 'normal',
    transitionEffect: 'shatter',
    customCSS: '',
  },
  {
    id: 'partners',
    label: 'Partners',
    componentName: 'NexusPartners',
    visible: true,
    theme: 'mycelium',
    glassOpacity: 0.62,
    glassBlur: 12,
    blendMode: 'normal',
    transitionEffect: 'dissolve',
    customCSS: '',
  },
  {
    id: 'credentials',
    label: 'Credentials',
    componentName: 'NexusCredentials',
    visible: true,
    theme: 'mycelium',
    glassOpacity: 0.65,
    glassBlur: 14,
    blendMode: 'normal',
    transitionEffect: 'morph',
    customCSS: '',
  },
  {
    id: 'contact',
    label: 'Contact',
    componentName: 'ContactFooter',
    visible: true,
    theme: '',
    glassOpacity: 0.9,
    glassBlur: 24,
    blendMode: 'normal',
    transitionEffect: 'morph',
    customCSS: '',
  },
]

const useNexusStore = create((n, e) => ({
  scrollProgress: 0,
  themeIndex: 0,
  themeBlend: 0,
  currentTheme: 'peacock',
  setScrollProgress: (t) => {
    const r = t * 6
    const s = Math.floor(r)
    const a = r - s
    const o = Math.max(0, Math.min(5, s))
    n({
      scrollProgress: t,
      themeIndex: o,
      themeBlend: a,
      currentTheme: ['peacock', 'solar', 'crystal', 'macaw', 'water', 'mycelium'][o],
    })
  },
  gui: {},
  setGuiValue: (t, i) => {
    n((r) => ({
      gui: {
        ...r.gui,
        [t]: i,
      },
    }))
  },
  resetGuiValues: () =>
    n({
      gui: {},
    }),
  sections: DEFAULT_SECTIONS,
  getSections: () => e().sections,
  setSections: (t) => {
    t.forEach((i) => {
      const r = findSectionElement(i)
      if (
        r &&
        ((r.style.display = i.visible ? '' : 'none'),
        i.blendMode && i.blendMode !== 'normal' && (r.style.mixBlendMode = i.blendMode),
        i.customCSS)
      ) {
        const s = `nexus-sec-css-${i.id}`
        let a = document.getElementById(s)
        if (!a) {
          a = document.createElement('style')
          a.id = s
          document.head.appendChild(a)
        }
        a.textContent = `#nexus-sec-${i.id} { ${i.customCSS} }`
      }
    })
    n({
      sections: t,
    })
  },
  imageTextureUrl: null,
  imagePlaneConfig: {
    opacity: 0.85,
    blur: 0,
    vignette: 0.5,
    saturation: 1.2,
    exposure: 1,
  },
  setImageTextureUrl: (t) =>
    n({
      imageTextureUrl: t,
    }),
  setImagePlaneConfig: (t) =>
    n((i) => ({
      imagePlaneConfig: {
        ...i.imagePlaneConfig,
        ...t,
      },
    })),
  imageParticles: null,
  setImageParticles: (t) => {
    n({
      imageParticles: t,
    })
  },
  studioOpen: false,
  toggleStudio: () =>
    n((t) => ({
      studioOpen: !t.studioOpen,
    })),
}))

export default useNexusStore
