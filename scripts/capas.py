# Versões leves da capa de cada artigo (artigos/): AVIF e WebP em 600, 900 e 1200 de largura, pro <picture> do site.
# O nome leva o hash da capa (<capa>-<hash>-<largura>.<formato>): capa trocada sem rodar isto = o site usa o JPEG, nunca
# a capa velha. Capa que já tem as 6 versões do hash dela fica como está. O CI roda isto no PR e sobe as versões.
#   python3 scripts/capas.py
import glob, hashlib, os
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
ARTIGOS = os.path.join(AQUI, "..", "artigos")
LARGURAS = (600, 900, 1200)
FORMATOS = (("avif", "AVIF", {"quality": 55, "speed": 4}), ("webp", "WEBP", {"quality": 78, "method": 6}))

for capa in sorted(glob.glob(os.path.join(ARTIGOS, "*.jpg")) + glob.glob(os.path.join(ARTIGOS, "*.jpeg")) + glob.glob(os.path.join(ARTIGOS, "*.png"))):
    base = os.path.splitext(os.path.basename(capa))[0]
    with open(capa, "rb") as f:
        h = hashlib.sha256(f.read()).hexdigest()[:8]
    for velho in glob.glob(os.path.join(ARTIGOS, f"{base}-*-*.avif")) + glob.glob(os.path.join(ARTIGOS, f"{base}-*-*.webp")):
        if f"-{h}-" not in os.path.basename(velho):
            os.remove(velho)
    destinos = [(l, ext, fmt, op, os.path.join(ARTIGOS, f"{base}-{h}-{l}.{ext}")) for l in LARGURAS for ext, fmt, op in FORMATOS]
    if all(os.path.exists(d[-1]) for d in destinos):
        continue
    im = Image.open(capa).convert("RGB")
    for largura, ext, fmt, op, dest in destinos:
        menor = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
        menor.save(dest, fmt, **op)
        print(os.path.basename(dest), os.path.getsize(dest) // 1024, "KB")
