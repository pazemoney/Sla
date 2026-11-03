#!/usr/bin/env node
// Visual QA capture. Usage: node qa.mjs --url http://localhost:4173 --out ./qa [--steps 8] [--widths 1440,820,390] [--wait 1500] [--selector css] [--no-webgl-check]
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i<0?d:(process.argv[i+1]?.startsWith('--')||process.argv[i+1]===undefined?true:process.argv[i+1])};
const url=arg('url'); if(!url||url===true){console.error('--url required');process.exit(2)}
const out=arg('out','./qa'); const steps=+arg('steps',8); const widths=String(arg('widths','1440,820,390')).split(',').map(Number); const wait=+arg('wait',1500);
fs.mkdirSync(out,{recursive:true});
let chromium; for(const base of [process.cwd()+'/x.js', ...(process.env.NODE_PATH||'').split(':').filter(Boolean).map(p=>p+'/x.js'), '/usr/lib/node_modules/x.js','/usr/local/lib/node_modules/x.js']){ try{ chromium=createRequire(base)('playwright').chromium; break }catch{} }
if(!chromium){ try{ chromium=(await import('playwright')).chromium }catch{ console.error('playwright not found (set NODE_PATH to global node_modules)'); process.exit(2) } }
const H={desktop:900,tablet:1180,mobile:844}; const name=w=>w>=1024?'desktop':w>=700?'tablet':'mobile';
const report={url,widths:{},blocking:[]}; const browser=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
async function run(w,reduced=false){
  const nm=name(w); const ctx=await browser.newContext({viewport:{width:w,height:H[nm]},deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference',isMobile:nm==='mobile',hasTouch:nm==='mobile'});
  const page=await ctx.newPage(); const r={console:[],pageErrors:[],failed:[]};
  page.on('console',m=>{if(['error','warning'].includes(m.type()))r.console.push(m.type()+': '+m.text().slice(0,300))});
  page.on('pageerror',e=>r.pageErrors.push(String(e).slice(0,300)));
  page.on('requestfailed',q=>r.failed.push(q.url().slice(0,200)+' '+(q.failure()?.errorText||'')));
  page.on('response',s=>{if(s.status()>=400)r.failed.push(s.status()+' '+s.url().slice(0,200))});
  await page.addInitScript(()=>{window.__cls=0;window.__lcp=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{const e=l.getEntries().at(-1);window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch{}});
  await page.goto(url,{waitUntil:'networkidle',timeout:60000}).catch(async()=>{await page.goto(url,{waitUntil:'load',timeout:60000})});
  await page.waitForTimeout(wait);
  const sfx=reduced?'-reduced':''; 
  if(!reduced){
    await page.screenshot({path:path.join(out,`${nm}-${w}.png`),fullPage:true}).catch(e=>r.console.push('fullpage screenshot failed: '+e.message));
    r.metrics=await page.evaluate(()=>{
      const de=document.documentElement,vw=innerWidth; const off=[];
      for(const el of document.querySelectorAll('body *')){const b=el.getBoundingClientRect(); if(b.width>0&&(b.right>vw+1||b.left<-1)){const cs=getComputedStyle(el); if(cs.position!=='fixed'&&!el.closest('[data-qa-ignore]')&&off.length<15)off.push((el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):'')+` right=${Math.round(b.right)}`))}}
      const tiny=[...document.querySelectorAll('a,button,input,select,textarea,[role=button]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&(b.width<24||b.height<24)&&getComputedStyle(e).visibility!=='hidden'}).slice(0,15).map(e=>(e.tagName.toLowerCase()+' '+(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30)));
      const imgs=[...document.images]; const noDim=imgs.filter(i=>!(i.getAttribute('width')&&i.getAttribute('height'))&&!getComputedStyle(i).aspectRatio.match(/\d/)).length; const noAlt=imgs.filter(i=>!i.hasAttribute('alt')).length;
      const bodyFont=parseFloat(getComputedStyle(document.body).fontSize);
      const canv=[...document.querySelectorAll('canvas')].map(c=>({w:c.width,h:c.height}));
      return {scrollWidth:de.scrollWidth,vw,hOverflow:de.scrollWidth>vw+1,overflowOffenders:off,tinyTargets:tiny,images:imgs.length,imagesNoDimensions:noDim,imagesNoAlt:noAlt,bodyFontPx:bodyFont,lang:de.lang||null,title:document.title,h1Count:document.querySelectorAll('h1').length,canvases:canv,docHeight:de.scrollHeight,cls:+(window.__cls||0).toFixed(3),lcpMs:Math.round(window.__lcp||0),viewportMeta:!!document.querySelector('meta[name=viewport]')}});
    if(!process.argv.includes('--no-webgl-check')&&r.metrics.canvases.length){
      r.canvasBlank=await page.evaluate(()=>{const res=[];for(const c of document.querySelectorAll('canvas')){try{const t=document.createElement('canvas');t.width=32;t.height=32;const x=t.getContext('2d');x.drawImage(c,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let s=0;for(let i=0;i<d.length;i+=4)s+=d[i]+d[i+1]+d[i+2]+d[i+3];res.push(s===0)}catch(e){res.push('unreadable')}}return res});
    }
    // scroll steps
    const total=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    for(let i=0;i<steps;i++){const y=Math.round(total*(i/(steps-1||1)));await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(700);await page.screenshot({path:path.join(out,`scroll-${nm}-${String(i).padStart(2,'0')}.png`)});}
    const sel=arg('selector'); if(sel&&sel!==true&&nm==='desktop'){const el=await page.$(sel); if(el)await el.screenshot({path:path.join(out,`section-${nm}.png`)}).catch(()=>{})}
  } else {
    await page.screenshot({path:path.join(out,`${nm}-${w}${sfx}.png`),fullPage:true}).catch(()=>{});
    r.metrics={hOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};
  }
  await ctx.close(); return r;
}
for(const w of widths){report.widths[w]=await run(w)}
report.reducedMotion=await run(widths[0],true);
await browser.close();
for(const [w,r] of Object.entries(report.widths)){
  if(r.pageErrors.length)report.blocking.push(`${w}: ${r.pageErrors.length} uncaught page error(s)`);
  if(r.failed.length)report.blocking.push(`${w}: ${r.failed.length} failed/4xx-5xx request(s)`);
  if(r.metrics?.hOverflow)report.blocking.push(`${w}: horizontal overflow (${r.metrics.scrollWidth}>${r.metrics.vw})`);
  if(r.canvasBlank?.some(b=>b===true))report.blocking.push(`${w}: blank canvas detected (may be WebGL unavailable in headless)`);
  if(r.metrics&&!r.metrics.viewportMeta)report.blocking.push(`${w}: missing viewport meta`);
}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({blocking:report.blocking,files:fs.readdirSync(out)},null,1));
process.exit(report.blocking.length?1:0);
