---
name: web-anti-generic-design
description: Prevents templated, AI-looking websites. Provides a project-specific direction protocol, a banned-default list with replacement moves, composition devices and a self-test. Use at the start of any website design and again before shipping; pairs with any art-direction engine.
---
# Anti-generic design protocol

Not a ban list: every default below is allowed ONLY if you can state in one sentence why this brief needs it.

## Step 1 — Concept (before any code)
Write: (a) one-sentence concept ("a diner menu printed on greasy butcher paper, lit by neon"), (b) a physical/cultural reference outside web design (print, signage, film, packaging, architecture, maps, scientific plates), (c) the **signature moment** (one memorable interaction/visual per page), (d) 3 things this site will not do.
Generate 3 divergent directions; choose the least obvious one that still serves the audience. Use references (Awwwards, Godly, SiteInspire, Land-book, Codrops, Three.js examples) for principles — composition, pacing, interaction mechanics — never layout copying.

## Step 2 — Default → move
| Default smell | Replace with |
|---|---|
| Centered hero + gradient blob + two buttons | asymmetric hero built on real subject: oversized type crop, product off-axis, annotation lines, or full-bleed image with type integrated into it |
| 3-up icon card grid | numbered list, ledger/table rows, annotated image, staggered mosaic with unequal spans, or prose |
| Rounded-2xl cards + soft shadow everywhere | one container language: hairline rules, flat blocks, or tight 0–4px radii; shadows only for true elevation |
| Purple/blue gradient, glassmorphism | palette from the subject; one accent; texture (grain, paper, halftone) instead of blur |
| Inter/Poppins everywhere | voice-matched pair (`web-type-color-identity`); one expressive display face |
| Emoji/Lucide icon rows | custom marks, real photography, diagrams, or no icons |
| Fade-up-on-scroll on every block | motion only where it explains: reveal for hierarchy, scrub for change, hover for affordance |
| Stock "trusted by" logo strip, fake testimonials, lorem | real content or clearly marked placeholder; never fabricate stats/reviews |
| Equal-height sections stacked | cadence: vary density, alignment, background, and scale between sections |
| Footer = link columns | footer as final scene: big wordmark, sign-off, real contact |

## Step 3 — Composition devices (pick 2–3 per project)
Oversized crop type; overlap (type over image over type); marginalia & captions; rotated labels; hairline grid made visible; index numerals; split-screen with scroll-swap; cursor-reactive element; full-bleed color changes per section; variable-font weight animation; mask/clip-path reveals; sticky sidebar index; "specimen sheet" layouts; inverted (dark/light) interludes.

## Step 4 — Self-test (answer honestly; fix on any "yes")
1. Could this page be re-skinned for another client by changing colors/logo only? 2. Do ≥3 sections share the same structure? 3. Is any element decorative with no job? 4. Is the accent used on >10% of the surface? 5. Could a viewer name the concept from a screenshot with the logo hidden? 6. Is the signature moment visible in the first 2 screens? 7. Does it still look good in grayscale (hierarchy by scale/weight, not color)?
Tools: `design-taste-frontend` inspector, `auteur` anti-slop linter, `form-and-force` source scan, `jury` for cold scoring, `web-visual-qa` for evidence.
