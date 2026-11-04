from pathlib import Path
import base64,json
root=Path(__file__).parent
html=(root/'index.html').read_text(encoding='utf-8')
for file in ['style.css','style_v5.css']:
 html=html.replace(f'<link rel="stylesheet" href="{file}">','<style>\n'+(root/file).read_text(encoding='utf-8')+'\n</style>')
images={p.stem:'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode('ascii') for p in (root/'assets').glob('*.png')}
html=html.replace('<script src="pixel.js"></script>','<script>window.YG_ART_DATA='+json.dumps(images,separators=(',',':'))+';</script>\n<script src="pixel.js"></script>')
for file in ['data.js','expansion.js','engine.js','pixel.js','app.js']:
 html=html.replace(f'<script src="{file}"></script>','<script>\n'+(root/file).read_text(encoding='utf-8')+'\n</script>')
(root/'PLAY.html').write_text(html,encoding='utf-8')
print('standalone',len(html),len(images))
