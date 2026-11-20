"""Create delivery variants with the installed Pillow; never overwrite originals.

Run manually: python scripts/optimize-images.py
Pillow is a development tool already available on this machine, not a runtime dependency.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public/assets/optimized"
OUTPUT.mkdir(parents=True, exist_ok=True)
sources = sorted((ROOT / "src/assets").glob("portfolio*"))
sources += [ROOT / "src/assets" / name for name in ["portafolio14.gif", "me.webp", "me-about.jpg", "avatar1.jpg", "avatar2.jpg", "avatar3.jpg", "avatar4.jpg"]]
sources += [ROOT / "public/assets" / name for name in ["portfolio14.png", "portfolio15.png", "portfolio16.png", "portfolio17.jpg"]]
manifest, report = {}, []

for source in sources:
    if source.suffix.lower() not in {".png", ".jpg", ".webp", ".gif"}:
        continue
    with Image.open(source) as original:
        frames = getattr(original, "n_frames", 1)
        original.seek(0)
        image = ImageOps.exif_transpose(original).convert("RGBA")
    width, height = image.size
    limits = [96, 192, 384] if source.stem == "me" else [96, 150] if source.stem.startswith("avatar") else [480, 960] if source.stem == "me-about" else [320, 640, 1280]
    variants = []
    for target in sorted({min(width, size) for size in limits}):
        resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
        name = f"{source.stem}-{target}.webp"
        destination = OUTPUT / name
        resized.save(destination, "WEBP", quality=90, method=6)
        variants.append({"src": f"/assets/optimized/{name}", "width": target, "height": resized.height, "bytes": destination.stat().st_size})
    item = {"width": width, "height": height, "variants": variants}
    if frames > 1:
        poster = image.copy()
        poster.thumbnail((875, 875), Image.Resampling.LANCZOS)
        background = Image.new("RGB", poster.size, "#202047")
        background.paste(poster, mask=poster.getchannel("A"))
        name = f"{source.stem}-poster.jpg"
        background.save(OUTPUT / name, "JPEG", quality=90, optimize=True)
        item["animated"] = True
        item["posterFallback"] = f"/assets/optimized/{name}"
    manifest[source.stem] = item
    report.append({"original": source.relative_to(ROOT).as_posix(), "sha256": hashlib.sha256(source.read_bytes()).hexdigest().upper(), "bytes": source.stat().st_size, "width": width, "height": height, "frames": frames, "variants": variants})

(ROOT / "src/data/image-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
summary = {"images": len(report), "originalBytes": sum(item["bytes"] for item in report), "largestVariantBytes": sum(item["variants"][-1]["bytes"] for item in report), "method": "Pillow 10.4, WebP quality 90/method 6; resize without cropping/upscaling; animated source keeps original GIF and extracts frame 0 as poster.", "files": report}
(ROOT / "docs/phase-7/image-optimization.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: value for key, value in summary.items() if key != "files"}))
