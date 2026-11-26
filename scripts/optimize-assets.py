#!/usr/bin/env python3
"""
EZ Studio Automated Media Optimization Pipeline
------------------------------------------------
Reads untouched original assets from `assets-raw/` and writes web-optimized
assets to `public/Assets/`:
  - Images (.png/.jpg/.jpeg/.webp/.avif): EXIF-corrected, resized WebP
    (plus -thumb.webp for Lightbox galleries).
  - Animated GIFs (.gif): resized 512px animated WebP (preserving alpha)
    plus a static -poster.webp first frame.
  - Videos (.mp4/.mov): faststart H.264 MP4 + VP9 WebM + -poster.webp frame
    (audio preserved for featured/interactive videos, stripped for muted hero loops).
  - SVGs (.svg): copied directly.

Usage:
  npm run optimize            # incremental (skips up-to-date files)
  npm run optimize -- --force # rebuild all optimized assets
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "assets-raw"
OUT_DIR = ROOT / "public" / "Assets"

# Videos that have user audio controls (keep audio track & higher clarity)
KEEP_AUDIO_SUBSTRINGS = ("self introduction", "video_1")

# Folders/prefixes that open in the fullscreen Lightbox (generate -thumb.webp + full .webp)
LIGHTBOX_RULES = (
    ("cinematic", "photo_"),
    ("design", "poster_"),
)

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}
VIDEO_EXTS = {".mp4", ".mov", ".m4v"}


def fmt_mb(num_bytes: int) -> str:
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def fmt_kb(num_bytes: int) -> str:
    if num_bytes >= 1024 * 1024:
        return fmt_mb(num_bytes)
    return f"{num_bytes / 1024:.0f} KB"


def is_up_to_date(src: Path, targets: list[Path], force: bool) -> bool:
    if force:
        return False
    src_mtime = src.stat().st_mtime
    return all(t.exists() and t.stat().st_mtime >= src_mtime for t in targets)


def open_image_any(src: Path) -> Image.Image:
    """Open standard images with Pillow, falling back to macOS sips/ffmpeg for AVIF."""
    try:
        with Image.open(src) as im:
            im.load()
            return ImageOps.exif_transpose(im).copy()
    except Exception:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_png = Path(tmp) / "decoded.png"
            # Try ffmpeg first, then macOS sips
            res = subprocess.run(
                ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-frames:v", "1", str(tmp_png)],
                capture_output=True,
            )
            if res.returncode != 0 or not tmp_png.exists():
                subprocess.run(
                    ["sips", "-s", "format", "png", str(src), "--out", str(tmp_png)],
                    check=True,
                    capture_output=True,
                )
            with Image.open(tmp_png) as im:
                im.load()
                return ImageOps.exif_transpose(im).copy()


def has_meaningful_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        alpha = im.convert("RGBA").getchannel("A")
        lo, _ = alpha.getextrema()
        return lo < 250
    return False


def save_webp_resized(im: Image.Image, dest: Path, max_dim: int, quality: int) -> None:
    work = im.copy()
    if max(work.size) > max_dim:
        work.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    if has_meaningful_alpha(work):
        work = work.convert("RGBA")
    else:
        work = work.convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    work.save(dest, format="WEBP", quality=quality, method=6)


def is_lightbox_image(rel_path: Path) -> bool:
    folder = rel_path.parent.name.lower()
    name = rel_path.name.lower()
    return any(folder == f and name.startswith(p) for f, p in LIGHTBOX_RULES)


def optimize_image(src: Path, rel_path: Path, force: bool) -> tuple[int, int]:
    out_base = OUT_DIR / rel_path.parent / src.stem
    main_webp = out_base.with_suffix(".webp")
    make_thumb = is_lightbox_image(rel_path)
    thumb_webp = out_base.with_name(f"{src.stem}-thumb.webp") if make_thumb else None

    targets = [main_webp] + ([thumb_webp] if thumb_webp else [])
    src_size = src.stat().st_size

    if is_up_to_date(src, targets, force):
        out_size = sum(t.stat().st_size for t in targets)
        return src_size, out_size

    im = open_image_any(src)
    lower_name = src.name.lower()

    if lower_name.startswith("avatar_"):
        save_webp_resized(im, main_webp, max_dim=320, quality=82)
    elif make_thumb and thumb_webp is not None:
        save_webp_resized(im, main_webp, max_dim=1800, quality=84)
        save_webp_resized(im, thumb_webp, max_dim=800, quality=80)
    else:
        save_webp_resized(im, main_webp, max_dim=1400, quality=82)

    out_size = sum(t.stat().st_size for t in targets)
    extra = f" + thumb ({fmt_kb(thumb_webp.stat().st_size)})" if thumb_webp else ""
    print(f"  [IMG] {rel_path} ({fmt_kb(src_size)}) -> {main_webp.name} ({fmt_kb(main_webp.stat().st_size)}){extra}")
    return src_size, out_size


def optimize_gif(src: Path, rel_path: Path, force: bool) -> tuple[int, int]:
    out_dir = OUT_DIR / rel_path.parent
    anim_webp = out_dir / f"{src.stem}.webp"
    poster_webp = out_dir / f"{src.stem}-poster.webp"
    targets = [anim_webp, poster_webp]
    src_size = src.stat().st_size

    if is_up_to_date(src, targets, force):
        return src_size, sum(t.stat().st_size for t in targets)

    out_dir.mkdir(parents=True, exist_ok=True)
    frames: list[Image.Image] = []
    durations: list[int] = []
    best_poster_idx = 0
    best_visible = -1

    with Image.open(src) as im:
        n_frames = getattr(im, "n_frames", 1)
        for idx in range(n_frames):
            im.seek(idx)
            frame = im.convert("RGBA")
            if max(frame.size) > 512:
                frame.thumbnail((512, 512), Image.Resampling.LANCZOS)
            frames.append(frame)
            dur = int(im.info.get("duration", 40) or 40)
            durations.append(max(20, dur))
            # Pick a visible frame for the static poster (prefer first frame if visible)
            if idx == 0 or (best_visible < 500 and idx % 5 == 0):
                alpha = frame.getchannel("A")
                visible = sum(1 for px in alpha.getdata() if px > 20)
                if visible > best_visible:
                    best_visible = visible
                    best_poster_idx = idx

    # Save static first/visible poster frame
    frames[best_poster_idx].save(poster_webp, format="WEBP", quality=85, method=6)

    # Save animated WebP preserving alpha transparency
    frames[0].save(
        anim_webp,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=78,
        method=4,
        minimize_size=True,
        background=(0, 0, 0, 0),
        disposal=2,
    )

    out_size = anim_webp.stat().st_size + poster_webp.stat().st_size
    print(
        f"  [GIF] {rel_path} ({fmt_kb(src_size)}) -> {anim_webp.name} ({fmt_kb(anim_webp.stat().st_size)})"
        f" + poster ({fmt_kb(poster_webp.stat().st_size)})"
    )
    return src_size, out_size


def optimize_video(src: Path, rel_path: Path, force: bool) -> tuple[int, int]:
    out_dir = OUT_DIR / rel_path.parent
    out_mp4 = out_dir / f"{src.stem}.mp4"
    out_webm = out_dir / f"{src.stem}.webm"
    poster_webp = out_dir / f"{src.stem}-poster.webp"
    targets = [out_mp4, out_webm, poster_webp]
    src_size = src.stat().st_size

    if is_up_to_date(src, targets, force):
        return src_size, sum(t.stat().st_size for t in targets)

    out_dir.mkdir(parents=True, exist_ok=True)
    lower_name = src.name.lower()
    keep_audio = any(k in lower_name for k in KEEP_AUDIO_SUBSTRINGS)

    scale_filter = "scale='min(1280,iw)':-2"
    mp4_crf = "24" if keep_audio else "27"
    webm_crf = "31" if keep_audio else "34"

    # 1. Extract poster frame at 1.5s (fallback to 0s if shorter)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_png = Path(tmp) / "poster.png"
        res = subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-ss", "1.5", "-i", str(src), "-frames:v", "1", "-vf", scale_filter, str(tmp_png)],
            capture_output=True,
        )
        if res.returncode != 0 or not tmp_png.exists():
            subprocess.run(
                ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-frames:v", "1", "-vf", scale_filter, str(tmp_png)],
                check=True,
                capture_output=True,
            )
        with Image.open(tmp_png) as im:
            im.convert("RGB").save(poster_webp, format="WEBP", quality=80, method=6)

    # 2. Faststart H.264 MP4
    mp4_cmd = [
        "ffmpeg", "-y", "-v", "error", "-i", str(src),
        "-vf", scale_filter,
        "-c:v", "libx264", "-preset", "slow", "-crf", mp4_crf,
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    ]
    if keep_audio:
        mp4_cmd += ["-c:a", "aac", "-b:a", "128k"]
    else:
        mp4_cmd += ["-an"]
    mp4_cmd.append(str(out_mp4))
    subprocess.run(mp4_cmd, check=True)

    # 3. VP9 WebM
    webm_cmd = [
        "ffmpeg", "-y", "-v", "error", "-i", str(src),
        "-vf", scale_filter,
        "-c:v", "libvpx-vp9", "-crf", webm_crf, "-b:v", "0",
        "-deadline", "good", "-cpu-used", "2", "-row-mt", "1",
        "-pix_fmt", "yuv420p",
    ]
    if keep_audio:
        webm_cmd += ["-c:a", "libopus", "-b:a", "96k"]
    else:
        webm_cmd += ["-an"]
    webm_cmd.append(str(out_webm))
    subprocess.run(webm_cmd, check=True)

    # Report the primary delivered size (WebM is what modern browsers pick; MP4 is Safari/fallback)
    print(
        f"  [VID] {rel_path} ({fmt_mb(src_size)}) -> "
        f"mp4={fmt_mb(out_mp4.stat().st_size)}, webm={fmt_mb(out_webm.stat().st_size)}, "
        f"poster={fmt_kb(poster_webp.stat().st_size)} (audio={'kept' if keep_audio else 'stripped'})"
    )
    return src_size, out_mp4.stat().st_size + out_webm.stat().st_size + poster_webp.stat().st_size


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize EZ Studio media assets.")
    parser.add_argument("--force", action="store_true", help="Re-encode all assets even if up to date.")
    args = parser.parse_args()

    if not RAW_DIR.exists():
        print(f"Error: source folder {RAW_DIR} does not exist.", file=sys.stderr)
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total_src = 0
    total_out = 0
    counts = {"img": 0, "gif": 0, "vid": 0, "svg": 0, "other": 0}

    print(f"Optimizing assets: {RAW_DIR.name}/ -> public/Assets/ (force={args.force})\n")

    for root, dirs, filenames in os.walk(RAW_DIR):
        dirs[:] = [d for d in dirs if not d.startswith("_") and not d.startswith(".")]
        for fn in sorted(filenames):
            if fn.startswith("._") or fn == ".DS_Store":
                continue
            src = Path(root) / fn
            rel = src.relative_to(RAW_DIR)
            ext = src.suffix.lower()

            if ext in IMAGE_EXTS:
                s, o = optimize_image(src, rel, args.force)
                counts["img"] += 1
            elif ext == ".gif":
                s, o = optimize_gif(src, rel, args.force)
                counts["gif"] += 1
            elif ext in VIDEO_EXTS:
                s, o = optimize_video(src, rel, args.force)
                counts["vid"] += 1
            elif ext == ".svg":
                dest = OUT_DIR / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not is_up_to_date(src, [dest], args.force):
                    shutil.copy2(src, dest)
                s = src.stat().st_size
                o = dest.stat().st_size
                counts["svg"] += 1
            else:
                dest = OUT_DIR / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not is_up_to_date(src, [dest], args.force):
                    shutil.copy2(src, dest)
                s = src.stat().st_size
                o = dest.stat().st_size
                counts["other"] += 1

            total_src += s
            total_out += o

    saved_pct = (1 - total_out / total_src) * 100 if total_src else 0
    print("\n=== Optimization Summary ===")
    print(f"Processed: {counts['img']} images, {counts['gif']} GIFs, {counts['vid']} videos, {counts['svg']} SVGs")
    print(f"Original total : {fmt_mb(total_src)}")
    print(f"Optimized total: {fmt_mb(total_out)} (includes BOTH MP4+WebM + lightbox thumbs; -{saved_pct:.1f}%)")


if __name__ == "__main__":
    main()
