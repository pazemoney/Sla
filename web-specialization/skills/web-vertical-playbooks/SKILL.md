---
name: web-vertical-playbooks
description: Opinionated playbooks for specific site types — restaurant/food, e-commerce, creative portfolio, premium landing page, luxury/editorial, experimental 3D — with page architecture, signature-moment ideas, content needs, conversion rules and traps. Use right after the brief to choose structure and the experience strategy.
---
# Vertical playbooks
(Each: goal → architecture → signature moment → must-haves → traps. Always adapt to the real brand; these are structures, not templates.)

## Restaurant / food & drink
Goal: appetite + reservation/order. Architecture: hero (real dish, sensory copy, Reserve/Order) → signature dish story (pinned stage; ingredients/layers revealed per scroll beat — 3D or photoreal sequence) → menu (scannable, prices, dietary marks, real text not image) → place/chef/story → hours, map, booking → footer. Signature: pinned hero dish (e.g. burger layers) or a menu that "plates" as you scroll. Must-haves: sticky Reserve/Order CTA, phone tap-to-call, hours + open-now state, menu as HTML (SEO, a11y), Google-friendly `Restaurant` JSON-LD, photo art direction (one lighting style, 45°/overhead consistency), warm high-contrast palette from the food. Traps: autoplay audio, PDF menus, carousels hiding the menu, stock food photos, slow 3D on mobile where most visitors are.

## E-commerce
Goal: confidence + speed. Architecture: PLP (fast filters, quick-add) → PDP (gallery, price, variants, shipping/returns above fold, reviews, related) → cart/checkout (zero distraction). Signature: PDP product viewer (3D/360 with hotspots, material/color variants, AR optional) — lazy, poster-first. Must-haves: real inventory/price states, skeletons, optimistic cart, empty/error states, Product JSON-LD, image optimization (AVIF, srcset), trust signals with real policies. Traps: scroll-jacking on listing/checkout, heavy intros, animated price/CTA, layout shift on images, fake urgency.

## Creative portfolio / agency
Goal: memorable taste + easy contact. Architecture: identity statement → selected work (3–6, each a mini case with scale/role/outcome) → about/approach → contact. Signature: one interaction nobody else has (cursor-reactive type, WebGL image distortion on hover, page transitions with shared-element, variable-font scrubbing). Must-haves: instant project navigation (View Transitions/GSAP), obvious contact, readable case studies, keyboard navigable, 60fps. Traps: mystery-meat nav, every project card identical, cursor effects on touch, 8 MB hero reel.

## Premium landing page (SaaS/product/service)
Goal: one conversion. Architecture: promise + proof + CTA above the fold → problem/solution shown visually (real UI/product) → how it works (3 steps, pinned/scrubbed if physical) → proof (real numbers/logos/quotes; mark placeholders) → pricing/offer → objections FAQ → final CTA. Signature: product demo as the hero, not an abstract blob. Must-haves: copy-first design (write headlines before layout), single primary CTA style, form with inline validation/states, analytics events, OG tags. Traps: 3-card feature grid, gradient mesh, vague headlines, 5 CTAs.

## Luxury / editorial
Goal: restraint and authority. Architecture: large imagery, generous whitespace (`--s-2xl`), serif display or fine grotesk, slow transitions (600–900ms, `power3.out`), minimal color (1 accent or none), caption/credit typography, long-form reading column (≤ 66ch). Signature: image reveal with mask, parallax ≤ 8%, cursor-follow caption. Traps: bling, carousels, bounce easing, tight spacing, too many type sizes.

## Experimental / 3D / art
Goal: wonder with a purpose. Allow shaders (`shader-art-coding`), WebGPU where supported (fallback WebGL), generative layouts (`algorithmic-art`), unusual navigation — but keep: a way to skip/enter, readable essential info, reduced-motion & no-WebGL fallbacks, honest loading screen < 5 s with progress. Perf per `web-3d-performance-budget`.

## Cross-cutting content rules
Use real copy/imagery when provided; otherwise generate plausible, clearly editable placeholders and list them. Never fabricate testimonials, awards, stats, certifications. Write alt text, titles, meta, OG, favicon, 404.
