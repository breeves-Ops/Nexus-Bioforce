import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { logger } from '../utils/logger'

gsap.registerPlugin(ScrollTrigger)

function bridgeLenisToScrollTrigger(n) {
  n.on('scroll', ScrollTrigger.update)
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(e) {
      if (arguments.length) {
        n.scrollTo(e, {
          immediate: true,
        })
      }
      return n.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  })
  ScrollTrigger.addEventListener('refresh', () => n.resize())
  ScrollTrigger.refresh()
  logger.info('ScrollAnimations', 'Lenis → ScrollTrigger bridge active')
}

function animateHeadings() {
  gsap.utils
    .toArray(
      [
        '.section-heading',
        '.section-title',
        '.nexus-section-title',
        'h1',
        'h2',
        '[class*="heading"]',
        '[class*="title"]',
      ].join(','),
    )
    .forEach((n) => {
      if (!n.closest('.hero-section')) {
        gsap.fromTo(
          n,
          {
            opacity: 0,
            y: 48,
            clipPath: 'inset(0 0 100% 0)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: n,
              start: 'top 85%',
              end: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }
    })
  gsap.utils
    .toArray(
      [
        '.stat-card',
        '.number-card',
        '.metric-card',
        '.process-card',
        '.engine-card',
        '.feature-card',
        '.partner-item',
        '.credential-item',
        '[class*="stat-card"]',
        '[class*="process-card"]',
      ].join(','),
    )
    .forEach((n) => {
      const e = n.parentElement
      if (!e || e._gsapStaggered) {
        return
      }
      e._gsapStaggered = true
      const t = e.querySelectorAll(
        [
          '.stat-card',
          '.number-card',
          '.metric-card',
          '.process-card',
          '.engine-card',
          '.feature-card',
          '.partner-item',
          '.credential-item',
        ].join(','),
      )
      if (t.length !== 0) {
        gsap.fromTo(
          t,
          {
            opacity: 0,
            y: 40,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: e,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }
    })
  gsap.utils.toArray('hr, .section-divider').forEach((n) => {
    gsap.fromTo(
      n,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: n,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })
  logger.info('ScrollAnimations', 'Section entrance animations registered')
}

function animateHeroIntro() {
  const n = document.querySelector('.hero-section')
  if (!n) {
    return
  }
  const e = gsap.timeline({
    delay: 0.3,
  })
  const t = n.querySelectorAll('h1, h2, .hero-title, [class*="hero-title"]')
  if (t.length) {
    e.fromTo(
      t,
      {
        opacity: 0,
        y: 60,
        clipPath: 'inset(0 0 100% 0)',
      },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      },
    )
  }
  const i = n.querySelectorAll('p, .hero-sub, [class*="hero-sub"]')
  if (i.length) {
    e.fromTo(
      i,
      {
        opacity: 0,
        y: 24,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.06,
      },
      '-=0.4',
    )
  }
  const r = n.querySelectorAll('a, button, [class*="cta"], [class*="btn"]')
  if (r.length) {
    e.fromTo(
      r,
      {
        opacity: 0,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
      },
      '-=0.3',
    )
  }
  logger.info('ScrollAnimations', 'Hero entrance animation playing')
}

function animateHeroParallax() {
  const n = document.querySelector('.hero-section .hero-content, .hero-section > *')
  if (n) {
    gsap.to(n, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
  }
}

function animateCounters() {
  document
    .querySelectorAll('[data-count], .stat-number, .metric-value, [class*="counter"]')
    .forEach((n) => {
      const e = parseFloat(n.dataset.count || n.textContent.replace(/[^0-9.]/g, ''))
      if (isNaN(e)) {
        return
      }
      const t = n.dataset.prefix || n.textContent.replace(/[0-9.]+.*/, '') || ''
      const i = n.dataset.suffix || n.textContent.replace(/^[^0-9]*[0-9.]+/, '') || ''
      const r = {
        val: 0,
      }
      gsap.to(r, {
        val: e,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: n,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        },
        onUpdate() {
          n.textContent = t + r.val.toFixed(e % 1 === 0 ? 0 : 1) + i
        },
      })
    })
}

let scrollAnimationsReady = false

export function initScrollAnimations(n) {
  if (scrollAnimationsReady) {
    logger.warn('ScrollAnimations', 'Already initialized — skipping')
    return () => {}
  } else {
    bridgeLenisToScrollTrigger(n)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateHeroIntro()
        animateHeadings()
        animateHeroParallax()
        animateCounters()
        scrollAnimationsReady = true
        logger.info('ScrollAnimations', 'All animations initialized')
      })
    })
    return () => killScrollAnimations()
  }
}

function killScrollAnimations() {
  ScrollTrigger.getAll().forEach((n) => n.kill())
  gsap.globalTimeline.clear()
  scrollAnimationsReady = false
  logger.info('ScrollAnimations', 'All ScrollTriggers killed')
}
