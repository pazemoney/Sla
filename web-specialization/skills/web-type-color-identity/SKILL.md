---
name: web-type-color-identity
description: Build a project-specific typographic and color identity — font pairing logic, variable/fluid type scales, display vs text roles, palette construction in OKLCH with role tokens, contrast systems, gradients with purpose. Use when choosing fonts, palette, or theming a website, or when type/color feels generic.
---
# Type & color identity (per project, never reused by default)

## Typography
1. **Pick the voice first** (one adjective pair: e.g. "warm/industrial", "clinical/playful"), then fonts. Search order: Fontshare, Google Fonts, Adobe Fonts (Adobe MCP `font_recommend` if connected), variable foundry free cuts. Avoid defaulting to Inter/Roboto/Space Grotesk/Playfair unless the concept demands them.
2. **Pairing logic:** contrast on ONE axis (serif display + grotesk text, or wide display + narrow text), harmony on the rest (similar x-height, same era). Max 2 families + 1 mono/accent. Variable fonts: use `wght`, `wdth`, `opsz` axes for hierarchy instead of more families.
3. **Scale:** fluid modular scale with `clamp()`; ratio 1.2 (text-heavy) → 1.333/1.5 (display-led). Example:
```css
--step--1:clamp(.83rem,.8rem + .15vw,.94rem);
--step-0: clamp(1rem,.95rem + .25vw,1.19rem);
--step-2: clamp(1.44rem,1.3rem + .7vw,1.9rem);
--step-4: clamp(2.07rem,1.7rem + 1.8vw,3.4rem);
--step-6: clamp(3rem,2rem + 5vw,7rem);   /* display */
```
Display: line-height .9–1.05, tracking −0.02…−0.04em, `text-wrap:balance`. Body: 1.5–1.65, tracking 0, `max-width:var(--measure)`, `font-optical-sizing:auto`. All-caps labels: +0.06…0.12em tracking.
4. Loading: `font-display:swap` + preload the display face (woff2, subset), size-adjust fallback to kill CLS. Self-host.
5. Hierarchy test: squint — you must identify H1 → sub → CTA in <1s. Weight/size/colour: change at most two per step.

## Color
1. Derive from the subject (food photo, product material, brand mark) — sample 3–5 real colors; name roles: `--bg`, `--surface`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--signal`.
2. Build in **OKLCH**: keep L steps even, vary C and H slightly across ramp so tints don't go muddy; `color-mix(in oklch, …)` for states.
3. Proportion rule: ~70% neutral field, 20% secondary, 10% accent; accent appears only where action/meaning lives. Neutral should be tinted toward the brand hue (C 0.005–0.02), not pure grey.
4. Contrast: body ≥ 4.5:1, large ≥ 3:1, UI boundaries ≥ 3:1; verify programmatically. Dark themes: don't invert — lift surfaces by L, desaturate accent 10–15%.
5. Gradients only to model light/material (a glow behind a product, sky behind a hero) with 2 hues ≤ 60° apart in OKLCH + grain/dither to avoid banding. No purple→blue default washes.
6. Psychology is a hypothesis, not a rule: warm saturated reds/ambers → appetite/urgency; deep greens/inks → trust/heritage; high-chroma on black → tech/night. Confirm with the audience and category conventions, then subvert one thing deliberately.
7. Provide light/dark only if the brief benefits; otherwise commit to one world.

Deliverable of this skill: a `tokens.css` (type + color + radius + shadow rules) and a 5-line rationale tying each choice to the concept. Deeper reference: `color-expert`, `modular-scale-typography`, `algorithmic-color-palette`.
