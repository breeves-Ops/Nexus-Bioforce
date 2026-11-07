# Nexus Bioforce — nexusbioforce.com

The Resource Revolution website for Nexus Bioforce: a React + Vite single-page site with a WebGL particle
background, the Declaration, the Project Aethelred walkthrough video, and the live Houston Landfill
Methane Tracker.

## Run it

```bash
npm install
npm run dev      # local development at http://localhost:5173
npm run build    # production build into dist/
```

Deploys on Vercel: the site is built with `vite build`, `vercel.json` sends every page route to the app,
and `api/methane-plumes.js` runs as a serverless function.

## Where things are

| Path | What it is |
| --- | --- |
| `src/pages/HomePage.jsx` | Homepage order: hero → ticker → walkthrough video → Declaration → methane spotlight → contact |
| `src/components/HeroSection.jsx` | Hero headline, tags, stats and buttons |
| `src/components/declaration/` | The Declaration: `Declaration.jsx` (layout and wording), `declarationData.js` (cards, tables, figures), `declarationStyles.js` |
| `src/components/VideoWalkthrough.jsx` | "Inside the Resource Revolution" video section (video files in `public/video/`) |
| `src/components/ContactSection.jsx`, `ContactOverlay.jsx`, `src/utils/contact.js` | Contact form (opens the visitor's email app), email, phone and address |
| `src/components/MenuDrawer.jsx`, `StickyLogo.jsx`, `Ticker.jsx` | Navigation, logo and the scrolling ticker |
| `src/pages/MethaneTrackerPage.jsx`, `src/components/MethaneSpotlight.jsx`, `src/components/methane/` | Methane tracker page, homepage spotlight, map and stat cards |
| `src/data/houstonLandfills.js` | Houston-area landfill sites shown on the map |
| `api/methane-plumes.js` | Serverless function: pulls CH₄ plume detections for Greater Houston from Carbon Mapper's public catalog (no API key) |
| `src/components/particles/` | WebGL particle background |
| `src/studio/`, `src/components/StudioMount.jsx` | Design tools (Nexus Studio, Particle Workshop, Theatre.js). Hidden from visitors; add `?studio` to the URL and press **G** or **P** |
| `src/presets/` | Particle presets saved from the Particle Workshop; any `.json` here shows up in its preset list |
| `src/App.css`, `src/styles/theme.css`, `src/index.css` | Site styles |
| `public/` | Logo (`brand/`), favicons, link-preview image, video, particle images |

## History

Originally built by Ash Genocipher. Restored in November 2026 from the live production build, after the
original source repository became unavailable, and checked against nexusbioforce.com page by page.
Because the code was recovered from a compiled build, variable names inside some functions are short;
component names, file layout and all site text are fully readable.
