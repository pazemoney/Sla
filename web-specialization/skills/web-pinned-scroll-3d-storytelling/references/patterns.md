# Patterns & copy-paste skeletons

## A. Sticky stage + beat sections (most robust)
```html
<section id="story" class="story">
  <div class="stage"><canvas id="gl"></canvas><div class="stage__label" aria-live="polite"></div></div>
  <article class="beat" data-beat="0"><h2>Toasted brioche</h2><p>…</p></article>
  <article class="beat" data-beat="1">…</article>
</section>
```
```css
.story{position:relative}
.stage{position:sticky;top:0;height:100svh;display:grid;place-items:center;overflow:clip}
.beat{min-height:100svh;display:grid;align-items:center;padding-inline:var(--gutter)}
.beat > *{max-width:28rem}
.beat:nth-of-type(even)>*{margin-left:auto}
```
```js
const beats=[...document.querySelectorAll('.beat')];
const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#story',start:'top top',end:'bottom bottom',scrub:.6}});
beats.forEach((_,i)=>tl.to(model.userData.layers[i].position,{y:LAYOUT[i].y,duration:1},i));
```
Sticky needs no ancestor with `overflow:hidden|auto` (use `overflow:clip` on the stage only).

## B. ScrollTrigger pin (needed for horizontal sections, snapping, pin-within-pin)
`ScrollTrigger.create({trigger:'#story',pin:'#stage',start:'top top',end:'+=500%',pinSpacing:true,scrub:true,snap:{snapTo:1/(N-1),duration:{min:.2,max:.6},ease:'power1.inOut'}})` — snap only for step-wise stories; never snap in free-reading sections.

## C. Horizontal scroll panel
```js
const panels=gsap.utils.toArray('.hpanel');
gsap.to(panels,{xPercent:-100*(panels.length-1),ease:'none',scrollTrigger:{trigger:'.hwrap',pin:true,scrub:1,end:()=>'+='+(innerWidth*(panels.length-1)),invalidateOnRefresh:true}});
// nested triggers inside: containerAnimation: thatTween
```

## D. R3F bridge
```tsx
const prog = useRef({ p:0 });
useGSAP(()=>{ gsap.timeline({scrollTrigger:{trigger:'#story',start:'top top',end:'bottom bottom',scrub:.6}}).to(prog.current,{p:1,ease:'none'}); },[]);
function Burger(){ const g=useRef<THREE.Group>(null!); useFrame(()=>{ const p=prog.current.p; g.current.children.forEach((c,i)=>{ const t=gsap.utils.clamp(0,1,p*N-i); c.position.y = gsap.utils.interpolate(0,i*0.35,t); }); invalidate(); }); return <group ref={g}>…</group>; }
// <Canvas frameloop="demand" dpr={[1,2]} gl={{powerPreference:'high-performance'}}>
```
## E. Per-beat text swap with SplitText-style reveal
Use `gsap.timeline({paused:true})` per beat, `play()` on enter / `reverse()` on leave-back. Keep ≤ 0.6s per reveal; stagger ≤ 0.04s.

## F. Debug aids
`markers:true` while developing; `ScrollTrigger.getAll()` to list; log `tl.progress()`; test with the `web-visual-qa` scroll-step script at progress 0, .17, .33, .5, .67, .83, 1.
