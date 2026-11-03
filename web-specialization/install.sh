#!/usr/bin/env bash
# Reinstall the web-specialization toolkit into ~/.claude (safe: never overwrites existing skills/CLAUDE.md content).
# 1) original skills  2) pinned third-party skills from manifest.json  3) global instructions block
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; DEST="$HOME/.claude/skills"; mkdir -p "$DEST"
for d in "$HERE"/skills/*/; do n=$(basename "$d"); [ -e "$DEST/$n" ] || cp -r "$d" "$DEST/$n"; done
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
python3 -I - "$HERE/manifest.json" "$TMP" "$DEST" <<'PY'
import json,sys,subprocess,os,shutil,re
man,tmp,dest=sys.argv[1:4]; m=json.load(open(man))
for r,i in m['repos'].items():
    d=os.path.join(tmp,r); subprocess.run(['git','init','-q',d],check=True)
    subprocess.run(['git','-C',d,'fetch','-q','--depth','1',i['url'],i['commit']],check=True)
    subprocess.run(['git','-C',d,'checkout','-q','FETCH_HEAD'],check=True)
ign=shutil.ignore_patterns('.git','node_modules','kie.mjs','*.zip','.github','evals')
def find(repo,name):
    root=os.path.join(tmp,repo)
    for dp,dn,fn in os.walk(root):
        dn[:]=[x for x in dn if x not in('.git','node_modules')]
        if 'SKILL.md' in fn and (os.path.basename(dp)==name or re.search(r'^name:\s*["\']?'+re.escape(name)+r'["\']?\s*$',open(os.path.join(dp,'SKILL.md'),errors='ignore').read().split('---')[1],re.M)): return dp
n=0
for s in m['skills']:
    dst=os.path.join(dest,s['name'])
    if os.path.exists(dst): continue
    src=find(s['repo'],s['name'].removeprefix('vercel-') if s['repo'].startswith('vercel') else s['name'])
    if s['name']=='threejs-procedural-scene': src=find(s['repo'],'threejs-scene')
    if not src: print('NOT FOUND',s); continue
    shutil.copytree(src,dst,ignore=ign); n+=1
    if s['name']=='threejs-procedural-scene': t=open(dst+'/SKILL.md').read(); open(dst+'/SKILL.md','w').write(re.sub(r'^name:.*$','name: threejs-procedural-scene',t,count=1,flags=re.M))
    if s['name'].startswith('vercel-'): pass
j=os.path.join(tmp,'AThevon__genjutsu','skills','_jutsu')
if os.path.isdir(j) and not os.path.exists(dest+'/_jutsu'): shutil.copytree(j,dest+'/_jutsu',ignore=shutil.ignore_patterns('compose-*','swiftui-*'))
print('installed',n,'third-party skills')
PY
CM="$HOME/.claude/CLAUDE.md"; touch "$CM"
grep -q 'BEGIN web-specialization' "$CM" || { echo; cat "$HERE/CLAUDE.md.snippet"; } >> "$CM"
echo "done"
