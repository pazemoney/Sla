---
name: web-visual-qa
description: Evidence-based visual QA for a running website — Playwright script that screenshots desktop/tablet/mobile, scroll-step captures for pinned/scroll stories, console errors, failed requests, horizontal overflow, small tap targets, and image/CLS basics; plus a review loop. Use after building or changing any page and before saying a site is done.
---
# Visual QA loop

**Never claim visual verification without running this and viewing the images.** If the browser can't run, say so.

## Run
```bash
# 1) serve the site (static: `npx --yes serve -l 4173 dist` or `python3 -m http.server 4173`; app: its dev/preview server)
# 2) capture (Playwright is preinstalled; script resolves it from NODE_PATH/global)
node ~/.claude/skills/web-visual-qa/scripts/qa.mjs --url http://localhost:4173 --out ./qa --steps 8
```
Outputs in `--out`: `desktop-1440.png`, `tablet-820.png`, `mobile-390.png` (full-page), `scroll-desktop-XX.png` (viewport screenshots at N scroll positions, pinned stories included), `report.json` (console errors, page errors, failed requests, overflow offenders, tiny tap targets, images without dimensions/alt, LCP/CLS, canvas presence & blank-canvas check, reduced-motion run). Exit code 1 on blocking issues.
Flags: `--steps N`, `--widths 1440,820,390`, `--wait ms` (after load, default 1500), `--selector '#story'` (also capture inside a specific section), `--no-webgl-check`.

## Then LOOK (use Read on each PNG) and judge
1. Desktop 1440×900 first viewport: hierarchy in <1s? concept visible? CTA visible? 2. Mobile 390×844: no overflow, type ≥16px body, CTA reachable, 3D scaled/fallback ok. 3. Tablet 820: not just stretched mobile. 4. Scroll-step sequence: object stays pinned, state changes per beat, no jumps/blank frames, text doesn't overlap object. 5. Alignment/spacing against `web-spacing-composition` audit. 6. Color/contrast vs `web-type-color-identity`. 7. report.json: any console error, 404, overflow, canvas blank = fix.
Write findings as a list `[severity] selector — problem — fix`; fix; re-run; compare. Cap at 3 loops, then report remaining issues honestly.

## Extra checks (when relevant)
Lighthouse (`lighthouse` skill): Perf ≥ 90 mobile for content sites; ≥ 75 acceptable for heavy 3D with justification. Accessibility: keyboard tab order, focus-visible, `prefers-reduced-motion` run (script does a second pass), axe via `webapp-testing`. Safari/WebKit & Firefox: `site-check`. Real-device test is not replaceable — state that it was not done if so.
