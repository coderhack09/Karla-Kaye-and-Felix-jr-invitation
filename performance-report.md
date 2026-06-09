# Performance Audit – Karol & Talitha Invitation

Date: 2025-11-06

## Current Status (from Next.js build stats)
- First Load JS shared by all: ~101 kB
- Home (`/`): ~193 kB first load (includes shared)
- Dashboard (`/dashboard`): ~111 kB first load
- Images served from `public/` with many large hero backgrounds; previously unoptimized image pipeline disabled

Note: Automated Lighthouse runs are wired in CI and scripts, but not executed in this environment due to no Chrome. Use the provided scripts to reproduce locally/CI.

## Biggest Opportunities
1) Optimize image loading (Next Image, lazy loading, hero preload, turn on optimizer)
2) Reduce initial JavaScript (defer non-critical animations/decor)
3) Cache and compression headers for static assets
4) Prune lookahead image preloading in the hero rotator
5) Bundle analysis and tree-shaking for heavy UI libs

## Changes Applied (Low-risk)
- Enabled Next.js Image Optimization (`unoptimized: false`)
- Converted raw `<img>` in `components/bounce-cards.tsx` to `next/image` + lazy
- Preloaded only the first hero image per form factor; limited background preloading to next 2 images and respected Data Saver
- Added static caching headers for `/_next/static` and common asset extensions
- Added resource hints: `preconnect` to fonts, `preload` hero image
- Added `prefers-reduced-motion` support to minimize animations
- Introduced feature flag `NEXT_PUBLIC_ENABLE_DECOR` to quickly toggle heavy visual effects (Silk background + background music)
- Integrated bundle analyzer and Lighthouse CI with scripts and GitHub Action

## Expected Impact
- Image optimization and lazy loading: 500KB–3MB saved on initial load (varies by device); LCP -0.5s to -2.0s on mobile
- Reduced hero preloading: 5–30 MB network saved after initial paint on first visit (depending on original assets)
- Static caching headers: repeat-visit JS/CSS fetches largely eliminated; TTI/FCP improved on second visit
- Feature flag off (`NEXT_PUBLIC_ENABLE_DECOR=false`): immediate CPU/GPU relief; TTI -0.3s to -1.2s on low-end devices

## How to Reproduce Scans Locally
```bash
pnpm install
chmod +x scripts/run-audit.sh
scripts/run-audit.sh
# Reports: scripts/reports/
```
Or run individually:
```bash
pnpm build && pnpm start -p 3000 &
pnpm lhci
pnpm analyze
pnpm bundle:explore
```

## Performance Budget (enforced in CI via lighthouserc.json)
- Performance score: warn below 0.75
- Accessibility/best-practices/SEO: warn below 0.90
- Key audits tracked: optimized/responsive images, text-compression, rel-preload

## Next Prioritized Fixes (recommended)
1) Convert large background slides to responsive modern formats (AVIF/WEBP) and serve via `next/image` where feasible
2) Split dashboard into lighter route segments and use selective dynamic import for heavy charts/three/gsap usage
3) Replace or gate 3D/animation libs on mobile (three/ogl/gsap) and hydrate them on idle
4) Eliminate unused Radix/UI components from bundles via `optimizePackageImports` and code-splitting
5) Add HTTP compression if self-hosting (gzip/br/brotli); for Vercel, compression is automatic

## Notes on Cross-browser Support
- No global polyfill added; rely on feature detection and CSS fallbacks
- Reduced motion support added for platform accessibility

