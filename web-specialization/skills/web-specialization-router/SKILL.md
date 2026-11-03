---
name: web-specialization-router
description: Entry point and precedence map for ALL website work (landing pages, restaurant, e-commerce, portfolio, luxury, editorial, 3D, scrollytelling). Use at the start of any request to build, redesign or review a website; it picks which specialist skills to load and in what order.
---
# Web specialization router

Load this first for any website task, then load only the skills the brief needs (progressive disclosure — never load everything).

## Workflow (do in order)
1. **Brief** — purpose, audience, brand, single primary action, content that really exists. If missing, state assumptions in 3 lines and proceed; ask only if the answer changes the direction.
2. **Direction** — load `web-anti-generic-design`, then ONE art-direction engine (see precedence). Write a 10-line direction note: concept sentence, type pair, palette (with roles), grid/spacing base, motion personality, signature moment, what you will NOT do.
3. **System** — `web-spacing-composition`, `web-type-color-identity` (+ `color-expert`, `modular-scale-typography`, `algorithmic-color-palette` for depth). Define tokens (CSS custom properties) BEFORE components.
4. **Experience** — decide per brief (see decision table). 3D → `web-pinned-scroll-3d-storytelling`, `three-best-practices`/`r3f-best-practices`, `web-3d-performance-budget`. Motion → `gsap-*`, `emil-design-eng`, `animation-performance`.
5. **Build** — smallest stack that works (static HTML+CSS+vanilla/GSAP for one-pagers; Vite+React+R3F when 3D state is complex; Next.js only with routing/SEO/CMS needs).
6. **Verify** — `web-visual-qa` (run the script, LOOK at screenshots), fix, repeat; then `web-final-qc`.

## Decision table
| Brief signal | Do | Don't |
|---|---|---|
| Physical product / food / object with parts | pinned 3D or image-sequence scrollytelling | decorative spinning model |
| Editorial, law, finance, medical | type-led, restrained motion, strong grid | forced 3D, parallax everywhere |
| Portfolio / agency | one signature interaction, bold type, case-study rhythm | template card grid |
| E-commerce | speed + clarity first, 3D only in product viewer | scroll-jacking checkout/listing |
| Experimental / art | shaders, WebGL, odd layouts allowed | sacrificing load time on mobile |

## Precedence when skills disagree
1. User brief + brand assets  > 2. Accessibility & performance budget (`web-final-qc` gates) > 3. `web-*` original skills > 4. Official library skills (`gsap-*`, `three-best-practices`, vercel-*) for API correctness > 5. Art-direction engines (`awwwards`, `auteur`, `cinematic-ui`, `form-and-force`, `genjutsu:*`, `design-taste-frontend`, `impeccable`, `frontend-design`) > 6. Dembrandt/UX heuristics (advisory).
Pick ONE art-direction engine per project (default `design-taste-frontend` or `frontend-design` for quick work; `awwwards`/`auteur`/`cinematic-ui` for cinematic long-form; `genjutsu:paint|cast` for motion-heavy). Do not run two engines on the same page — their palettes/rules conflict. Use `jury` (juliobsz) or `web-visual-qa` for review.
Library API facts: trust `gsap-*` (official) over any engine's snippets. Scroll: ScrollTrigger + Lenis wiring in `web-pinned-scroll-3d-storytelling` wins over other recipes.

## Skill map
- Direction: web-anti-generic-design, awwwards, auteur, cinematic-ui, form-and-force, direction/elevate/verify (award-craft), design-taste-frontend, impeccable, frontend-design, paint/cast/bunshin
- Layout/type/color: web-spacing-composition, web-type-color-identity, color-expert, modular-scale-typography, sizing-units, visual-emphasis-and-hierarchy, repeated-component-alignment, layout-paradigms-and-consistency
- 3D/WebGL: three-best-practices, r3f-best-practices, threejs-* (20), scaffold-3d-site, add-postprocessing, optimize-3d-assets, shader-art-coding, exploded-view, threejs-procedural-scene
- Scroll: web-pinned-scroll-3d-storytelling, scroll-craft, scrollytelling, zero-jank-scroll, scroll-3d-scene, scroll-film, gsap-scrolltrigger
- Motion: gsap-core/timeline/plugins/react/utils/performance, animate, animation-vocabulary, review-animations, motion-and-storytelling, micro-interactions, vercel-react-view-transitions
- UX: laws-of-ux(+review/checklist), nielsen-usability-heuristics, form-design, information-architecture, button-states, wcag-accessibility, loading-states-and-perceived-performance
- Quality: web-visual-qa, web-final-qc, site-check, lighthouse, performance-and-web-vitals, web-design-guidelines, break-ui, jury
- Verticals: web-vertical-playbooks
