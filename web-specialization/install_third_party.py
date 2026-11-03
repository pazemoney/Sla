import os,re,shutil,subprocess,json
S='src/'; D=os.path.expanduser('~/.claude/skills/')
picks=[]
def add(repo,sub,names,pre=''):
    for n in names: picks.append((repo,f'{sub}/{n}' if sub else '',n))
add('greensock__gsap-skills','skills',['gsap-core','gsap-timeline','gsap-scrolltrigger','gsap-plugins','gsap-react','gsap-utils','gsap-performance','gsap-frameworks'])
add('emalorenzo__three-agent-skills','skills',['r3f-best-practices','three-best-practices'])
add('cesartevisual__threejs-skills','skills',['threejs-materials','threejs-postprocessing','threejs-accessibility','threejs-debugging','threejs-particles','threejs-r3f','threejs-assets','threejs-lighting','threejs-shaders','threejs-scene','threejs-web','threejs-animation','threejs-deployment','threejs-performance','threejs-interaction','threejs-product-viewer','threejs-geometry','threejs-webgpu','threejs-html','threejs-testing'])
add('skinnye__3d-web-pack','skills',['scaffold-3d-site','add-postprocessing','optimize-3d-assets','scroll-3d-scene'])
add('Moh4696__open-3d-skills','skills',['threejs-scene','scroll-film','exploded-view','site-check','frame-capture'])
add('gokayfem__shader-skills','skills',['shader-art-coding'])
add('nateherkai__scroll-craft','plugins/nateherk-design/skills',['scroll-craft'])
add('ma68foysal__claude-scrollytelling-skill','plugins/scrollytelling/skills',['scrollytelling'])
add('harshavarma02__zero-jank-scroll-agent-skill','skills',['zero-jank-scroll'])
add('juliobsz__skills','',['awwwards','jury'])
add('agiwhitelist__auteur','.',['auteur'])
add('akseolabs-seo__cinematic-ui','.',['cinematic-ui'])
add('erenthedeveloper0__form-and-force','skills',['form-and-force'])
add('alanvaa06__award-craft','skills',['direction','elevate','verify'])
add('emilkowalski__skill','skills',['animate','animation-vocabulary','review-animations','animation-performance','emil-design-eng','apple-design','break-ui','improve-animations','find-animation-opportunities','remove-animations','prototype','pick-ui-library','mobile-native'])
add('meodai__skill.color-expert','.',['color-expert'])
add('dembrandt__dembrandt-skills','skills',['dembrandt','modular-scale-typography','algorithmic-color-palette','brand-visual-language','motion-and-storytelling','micro-interactions','performance-and-web-vitals','semantic-html-and-seo','wcag-accessibility','responsive-paradigms','visual-emphasis-and-hierarchy','elevation-and-depth','sizing-units','loading-states-and-perceived-performance','form-design','information-architecture','color-mode-and-theme','nielsen-usability-heuristics','sticky-and-fixed-elements','repeated-component-alignment','layout-paradigms-and-consistency','button-states'])
add('keysjoao__laws-of-ux-skills','',['laws-of-ux','laws-of-ux-review','laws-of-ux-checklist'])
add('nimajafari__lighthouse-skill','skills',['lighthouse'])
add('vercel-labs__agent-skills','skills',['web-design-guidelines','react-best-practices','composition-patterns','react-view-transitions'])
add('anthropics-skills','skills',['frontend-design','webapp-testing','canvas-design','algorithmic-art'])
add('AThevon__genjutsu','skills',['cast','paint','bunshin'])
ok=[];skip=[];fail=[]
for repo,sub,n in picks:
    # locate
    cands=[S+repo+'/'+sub, S+repo+'/'+sub+'/'+n, S+repo+'/'+n, S+repo]
    src=next((c for c in cands if os.path.isfile(os.path.join(c,'SKILL.md')) and re.search(r'^name:\s*["\']?'+re.escape(n)+r'["\']?\s*$',open(os.path.join(c,'SKILL.md')).read().split('---')[1],re.M)),None)
    if not src:
        # repo-root skills whose frontmatter name differs
        c=S+repo
        if sub in('.','') and os.path.isfile(c+'/SKILL.md'): src=c
    if not src: fail.append((repo,n,'source not found / name mismatch')); continue
    dst=D+n
    if os.path.exists(dst): skip.append(n); continue
    shutil.copytree(src,dst,ignore=shutil.ignore_patterns('.git','node_modules','kie.mjs','*.zip','.github','evals'))
    ok.append((n,repo))
print('installed',len(ok),'skipped',skip,'failed',fail)
# genjutsu internal modules (relative refs)
g=S+'AThevon__genjutsu/skills/_jutsu'; 
if not os.path.exists(D+'_jutsu'): shutil.copytree(g,D+'_jutsu',ignore=shutil.ignore_patterns('compose-*','swiftui-*')); print('_jutsu copied')
json.dump(ok,open('installed.json','w'))
