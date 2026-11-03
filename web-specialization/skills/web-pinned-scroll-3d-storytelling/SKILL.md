---
name: web-pinned-scroll-3d-storytelling
description: Implement pinned-object scrollytelling — a 3D model, image sequence or illustration stays fixed while scroll progress drives its transformation and swaps copy/ingredients/details (e.g. a 3D burger whose layers appear as you scroll). Covers GSAP ScrollTrigger + Lenis wiring, Three.js/R3F scroll sync, image-sequence canvas, mobile fallback, reduced motion and perf. Use for product reveals, restaurant/food 3D, step-by-step explainers.
---
# Pinned scroll + 3D storytelling

## 0. Decide the technique (cost vs fidelity)
| Asset | Technique | Use when |
|---|---|---|
| GLB model, interactive/lit in real time | Three.js/R3F, scroll → timeline progress | model < 2 MB (Draco/meshopt+KTX2), needs lighting/camera freedom |
| Pre-rendered camera move / photoreal | Image sequence on `<canvas>` (see `scroll-film`) | photoreal food/product, mobile-heavy audience, no 3D asset |
| Flat illustration/photo layers | CSS/GSAP transforms on pinned stage | simple reveals, lowest risk |
Pin one stage, change content around it. NEVER rely on bare `position:sticky` when you need timeline control, snapping, or progress callbacks — but sticky is fine for the stage when copy sections provide the scroll length (robust, no pin-spacer layout bugs). See `references/patterns.md` for both variants.

## 1. Narrative first
Write a beat sheet: N beats × (scroll span, what the object does, what the copy says, camera, light). Burger example, 6 beats: bun top → patty → cheese melt → veg → sauce → assemble/CTA. One idea per beat; ≥ 60–100vh of scroll per beat on desktop; the object must visibly change at each beat boundary and never sit idle > 1 beat.
Layout: object center or 45/55 offset; copy alternates sides or sits in a fixed column; large numerals/labels sync with beat. Leave the object's silhouette clear of text.

## 2. Wiring (the canonical stack)
```js
import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });   // touch stays native by default
lenis.on('scroll', ScrollTrigger.update);                      // keep ST in sync
gsap.ticker.add(t => lenis.raf(t * 1000));                     // ONE raf loop: gsap's
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({ ignoreMobileResize: true });
```
Rules: one RAF driver (GSAP ticker) — never run Lenis' own `requestAnimationFrame` too; call `ScrollTrigger.refresh()` after fonts/images/model load; `lenis.stop()` while a modal is open; anchor links via `lenis.scrollTo`; destroy Lenis + `ScrollTrigger.getAll().forEach(k=>k.kill())` on unmount (React: `useGSAP` / `gsap.context()` — see `gsap-react`). If you use ScrollSmoother, do NOT also use Lenis.

## 3. Scroll → 3D (Three.js)
Drive a single normalized value, not many triggers:
```js
const state = { p: 0 };                                  // 0..1 across the whole story
const tl = gsap.timeline({ scrollTrigger:{ trigger:'#story', start:'top top', end:'+=600%',
  scrub: 0.6, pin:'#stage', anticipatePin:1, invalidateOnRefresh:true }, defaults:{ ease:'none' }});
tl.to(layers.bunTop.position,{ y:2.2 }, 0)               // beat positions in timeline seconds (1 unit = 1 beat)
  .to(layers.patty.position,{ y:1.1 }, 1)
  .to(camera.position,{ z:4.2, y:1.4 }, 2)
  .to(state,{ p:1 }, 0);
renderer.setAnimationLoop(() => { /* read state.p for shader uniforms */ renderer.render(scene,camera); });
```
- Render on demand: if nothing animates between scrolls, use `invalidate()` (R3F `frameloop="demand"`) or render only when `scrub` value changed.
- Copy sync: `ScrollTrigger.create({ trigger: beatEl, start:'top 55%', end:'bottom 55%', onToggle: s => s.isActive && setBeat(i) })` and crossfade text with `autoAlpha` + 12–24px y; keep outgoing/incoming overlap ≤ 150ms. Use `scrub` for the object, discrete triggers for text.
- Easing: object transforms `ease:'none'` inside a scrubbed timeline (scrub supplies smoothing); add easing only per-beat via `power2.inOut` on tweens whose span ≥ 1 unit.
- R3F: wrap in `<Canvas frameloop="demand">`, put the scroll `ScrollTrigger` in the DOM layer and write to a ref/`useRef` store, read it in `useFrame`; or use drei `<ScrollControls>` only when the whole page lives inside the canvas (hurts SEO/a11y — prefer DOM scroll + sticky canvas, `position:fixed; inset:0; pointer-events:none`).
- Lighting that tells the story: key light angle and env map rotation change per beat; add contact shadow (`ContactShadows`), subtle bloom only on emissives. Materials: use real PBR maps (`threejs-materials`).

## 4. Image-sequence variant (photoreal, light on GPU)
Frames 960–1440px wide webp/avif, 60–180 frames, named `f_0001.webp`. Preload in 3 priority tiers (first frame → every 10th → rest) with `createImageBitmap`; draw to canvas with cover-fit + DPR cap 2; map `progress → Math.round(p*(N-1))` and only redraw when the index changes. See `scroll-film`, `scroll-craft`, `scrollytelling` for asset generation/holds.

## 5. Responsive, a11y, fallback
- Mobile: shorter beats (70vh), object scaled 0.8, copy as bottom sheet over the object; `ScrollTrigger.matchMedia`/`gsap.matchMedia()` to swap timelines. Keep pin lengths in `vh` not px; `invalidateOnRefresh:true`.
- `prefers-reduced-motion`: render a static composed state per beat (stacked sections with still images or the model at rest), no scrub, no Lenis.
- No-WebGL/low-end (`navigator.hardwareConcurrency<=4` or context failure): poster image sequence or stills. Always give the story's content as real HTML text (SEO + screen readers); canvas gets `role="img"` + `aria-label`.
- Page must remain usable without JS for the copy; CTA reachable via keyboard at all times (fixed header CTA).

## 6. Failure modes to test (use `web-visual-qa` scroll-step capture)
Jump at pin start/end (pin-spacer + `anticipatePin`); content shifts after fonts load (refresh); mobile URL-bar resize retriggering (ignoreMobileResize); layered `transform` on pinned parent breaking `position:fixed` children; two triggers fighting over the same property (use one timeline); memory growth on route change (dispose geometries/textures); scrub lag feeling "rubbery" (lower `scrub` to 0.3–0.8 or use `true` for tight sync); Safari canvas size limits (cap 4096²).
