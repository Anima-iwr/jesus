"""Build the public article index from reflections/*.md (stdlib only)."""
import json, re
from pathlib import Path
root=Path(__file__).resolve().parent
entries=[]
for path in (root/'reflections').glob('*.md'):
    raw=path.read_text(encoding='utf-8-sig')
    match=re.match(r'^---\s*\n(.*?)\n---\s*\n',raw,re.S)
    if not match:
        raise SystemExit(f'Missing YAML-style metadata at top of {path}')
    metadata={}
    for line in match.group(1).splitlines():
        if ':' in line:
            k,v=line.split(':',1); metadata[k.strip()]=v.strip().strip('"').strip("'")
    for field in ('title','date','subtitle'):
        if not metadata.get(field): raise SystemExit(f'Missing {field} in {path}')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',metadata['date']): raise SystemExit(f'Invalid date in {path}')
    metadata['file']='reflections/'+path.name
    entries.append(metadata)
entries.sort(key=lambda x:(x['date'],x['file']),reverse=True)
(root/'reflections.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Indexed {len(entries)} reflections')
