---
name: web-final-qc
description: Final ship gate for any website — a pass/fail checklist across design, responsiveness, accessibility, motion, performance, SEO, code quality and honesty of claims, with required evidence. Use before telling the user a website is finished.
---
# Final quality control (ship gate)

Evidence-based: each line needs a command output, screenshot path or measurement. "Not tested" is allowed; "passed" without evidence is not.

## Gate A — Rendered result (via `web-visual-qa`)
- [ ] Screenshots viewed at 1440, 820, 390; no horizontal overflow; first viewport communicates concept + primary action
- [ ] Scroll-step captures reviewed for pinned/scroll stories (no jumps, blank frames, overlap)
- [ ] 0 console errors/uncaught exceptions, 0 failed requests
- [ ] Typography scale, spacing tokens and palette match the direction note (no stray values)
- [ ] Anti-generic self-test (`web-anti-generic-design` step 4) passed
## Gate B — Interaction & motion
- [ ] Every animation has a purpose; durations 150–300ms UI, 400–900ms cinematic; no animation blocks input
- [ ] `prefers-reduced-motion` path works (run in qa.mjs) ; no auto-playing motion > 5s without control
- [ ] Hover/focus/active/disabled/loading/error/empty states exist (`button-states`, `form-design`)
- [ ] Smooth-scroll (Lenis) doesn't break anchors, keyboard scroll, in-page find, or modals
## Gate C — Accessibility
- [ ] Semantic landmarks, one `h1`, logical heading order, `lang`, alt text, labelled controls
- [ ] Contrast AA, visible `:focus-visible`, full keyboard path, skip link when nav is long
- [ ] Canvas/3D has text alternative + non-3D fallback (`threejs-accessibility`)
## Gate D — Performance (`web-3d-performance-budget`, `lighthouse`)
- [ ] LCP ≤ 2.5s, CLS ≤ 0.1 (lab numbers recorded); images sized, AVIF/WebP, lazy below fold; fonts preloaded/subset
- [ ] 3D lazy-loaded with poster; budgets met or exception documented; no memory growth across navigation
## Gate E — SEO & production
- [ ] title, meta description, canonical, OG/Twitter image, favicon, robots/sitemap, JSON-LD where relevant (Restaurant/Product/Organization)
- [ ] Build passes (`npm run build`), no TODO/lorem, env secrets not committed, 404 page, error boundaries
- [ ] No unneeded dependencies; bundle analyzed if > 250KB gz JS
## Gate F — Honesty
- [ ] Final message lists: what was verified (with evidence), what was NOT (real devices, Safari, screen readers), known issues, placeholders to replace
