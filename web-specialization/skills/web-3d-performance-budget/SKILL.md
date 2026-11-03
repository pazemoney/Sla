---
name: web-3d-performance-budget
description: Hard performance budgets and optimization procedure for WebGL/Three.js/R3F and heavy-motion sites — asset budgets, draw-call/triangle limits, DPR caps, on-demand rendering, texture compression, loading strategy, mobile tiers, memory disposal and Core Web Vitals. Use when adding 3D, video, sequences or heavy animation, or when a page is slow.
---
# 3D & heavy-motion performance budget

## Budgets (defaults; justify any exception)
| Item | Mobile | Desktop |
|---|---|---|
| Initial JS (gz) before first paint of content | ≤ 170 KB | ≤ 250 KB |
| Three.js lazily loaded after LCP (dynamic `import()`) | yes | yes |
| Hero GLB (Draco/meshopt + KTX2) | ≤ 1.5 MB | ≤ 3 MB |
| Total 3D+texture payload | ≤ 5 MB | ≤ 10 MB |
| Triangles in view | ≤ 150k | ≤ 500k |
| Draw calls | ≤ 100 | ≤ 300 |
| Texture size | ≤ 1024² (2048² hero only) | ≤ 2048² (4096² only with KTX2) |
| DPR | cap 1.5 | cap 2 |
| Frame time | ≤ 16 ms (p95 ≤ 22) | ≤ 16 ms |
| LCP / CLS / INP | ≤ 2.5 s / ≤ 0.1 / ≤ 200 ms | same |
| Image sequence | ≤ 90 frames @ ≤ 900px webp, ≤ 3 MB | ≤ 150 frames @ 1280px ≤ 8 MB |

## Procedure
1. **LCP must not be the canvas.** Ship a real poster `<img>` (the model's first frame, preloaded, `fetchpriority=high`) in the same position; fade canvas in when ready.
2. **Lazy-load** Three/R3F/model with `import()` on idle or when the section nears (`IntersectionObserver rootMargin:'200%'`); show the poster meanwhile.
3. **Assets** (`optimize-3d-assets`): `gltf-transform optimize --compress meshopt --texture-compress webp|ktx2`, merge meshes/materials, bake AO/light into textures, instance repeats, no unused attributes. Prefer one 2048 atlas over ten maps.
4. **Render policy:** `frameloop="demand"`/render only when scroll progress, pointer or animation changed; pause when tab hidden or canvas offscreen (`IntersectionObserver`); lower `dpr` adaptively (drei `PerformanceMonitor`) .
5. **Shaders/post:** one effect pass chain max (bloom + grain + vignette), half-res bloom, no SSAO on mobile; avoid dynamic shadows (bake or `ContactShadows` once, `frames={1}`); ≤ 2 real-time lights + env map (`Environment` preset or `.hdr` ≤ 1 MB).
6. **Memory:** dispose geometry/material/texture on unmount; reuse `Vector3`/`Matrix4` in loops; never allocate in `useFrame`; check `renderer.info` (calls, triangles, textures, geometries) — stable across route changes.
7. **Tiers:** detect (`gpu-detect`/`navigator.hardwareConcurrency`, `deviceMemory`, coarse pointer, `prefers-reduced-motion`, `saveData`) → high: full scene; mid: no post, DPR 1.25; low/no-WebGL: poster sequence or static. Test the lowest tier deliberately.
8. **Scroll cost:** one ScrollTrigger timeline, no layout reads in scroll handlers, animate `transform/opacity` only, `will-change` only on pinned stage; fonts preloaded to avoid refresh jumps.
9. **Video/sequence:** AV1/H.264 mp4 + webm, `playsinline muted`, poster; sequences webp/avif, decode with `createImageBitmap`, draw only on index change.
10. **Measure:** `web-visual-qa` (LCP/CLS), `lighthouse`, Chrome tracing for GPU, `renderer.info`, Stats.js during dev. Record numbers in the final report — no number, no claim.
