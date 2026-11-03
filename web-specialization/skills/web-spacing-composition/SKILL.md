---
name: web-spacing-composition
description: Professional spacing, grid, rhythm and composition for websites — spacing scales, fluid clamp() sizing, CSS Grid/Flexbox layout systems, optical alignment, negative space, density, and a checklist to detect awkward proportions and inconsistent margins. Use when designing or auditing layout, sections, or responsive structure.
---
# Spacing, grid & composition

## 1. Tokens first (never ad-hoc px)
Base unit 8px (4px for tight UI). One scale, named by role, fluid between 360px and 1440px viewports:
```css
:root{
  --s-3xs:clamp(.25rem,.24rem + .05vw,.3rem);
  --s-2xs:clamp(.5rem,.48rem + .1vw,.6rem);
  --s-xs: clamp(.75rem,.71rem + .2vw,.9rem);
  --s-sm: clamp(1rem,.95rem + .25vw,1.2rem);
  --s-md: clamp(1.5rem,1.4rem + .5vw,1.9rem);
  --s-lg: clamp(2.5rem,2.2rem + 1.5vw,3.5rem);
  --s-xl: clamp(4rem,3.2rem + 4vw,7rem);     /* section padding */
  --s-2xl:clamp(6rem,4.5rem + 7.5vw,12rem);  /* hero / chapter breaks */
  --gutter:clamp(1rem,.6rem + 2vw,2.5rem);
  --measure:62ch;                              /* body text max width */
}
```
Rules: sections use only `--s-xl/2xl` vertical padding; related items `--s-2xs..sm`; unrelated groups `--s-lg+`. Proximity encodes grouping: gap between groups ≥ 2× gap inside a group.

## 2. Grid
- 12-col desktop / 6 tablet / 4 mobile, `column-gap: var(--gutter)`. Use `grid-template-columns: repeat(12,minmax(0,1fr))` and place by `grid-column: a / span n`. Always `minmax(0,…)` to prevent blowout.
- Container: `width:min(100% - 2*var(--gutter), 1440px); margin-inline:auto`. Full-bleed media breaks out with `grid-column:1/-1`.
- Intrinsic patterns: `repeat(auto-fit,minmax(min(100%,18rem),1fr))` for galleries; `grid-template-columns: minmax(0,1fr) minmax(0,var(--measure))` for editorial text beside media.
- Deliberate asymmetry: build on the grid, then break it on purpose once per section (offset image, oversized numeral bleeding off-edge). Break = ≥1 full column shift, never 6px.
- Subgrid for aligning card internals across a row (`grid-template-rows: subgrid`).

## 3. Rhythm & proportion
- Vertical rhythm: line-height multiples of 4px/8px; headings snap to the same baseline grid or use `text-wrap:balance`.
- Section cadence: alternate density — dense/medium/airy/dense. Three equal-height sections in a row = template smell.
- Ratios for media: 4:5, 3:2, 16:9, 1:1 chosen per role; mix 2–3 per page, not one.
- Size contrast: biggest:smallest type ≥ 8:1 on display pages; hero element ≥ 2.5× the next-level element.
- Negative space is content: reserve ≥ 30% of the first viewport as quiet area unless the concept is maximalist.

## 4. Optical alignment
Align to optical edges, not boxes: pull large display type left by ~0.04em (`margin-left:-.04em`), round buttons' text +1px down for cap-height centering, icons visually centered by mass, quotes hang outside the measure (`hanging-punctuation`/negative text-indent). Check first viewport at 1440×900 and 390×844.

## 5. Audit checklist (flag each failure with selector + fix)
1. Any margin/padding not in the scale? (grep for raw px) 2. Left edges: how many distinct x-positions in a section? (>3 = drift) 3. Two siblings with different gaps for the same relation. 4. Text line length outside 45–75ch. 5. Orphans/widows in headings. 6. Cards with unequal inner padding. 7. Hero fills viewport but CTA below the fold at 390×844. 8. Sections with identical rhythm top/bottom. 9. Touch targets < 44px. 10. Horizontal overflow at any width 320–1920 (use `web-visual-qa`).
Density guide: marketing 1 idea/viewport; product page 2–3 ideas/viewport; editorial 1 column + marginalia; dashboards are out of scope here.
