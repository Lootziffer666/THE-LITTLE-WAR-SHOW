#!/usr/bin/env python3
"""Sprite-Defringe (schonend) fuer "The Little War Show".

Entfernt den hellen KI-Freisteller-Saum per WEISS-MATTE-ENTFERNUNG: jeder Randpixel
ist eine Mischung aus Figurfarbe F und hellem Hintergrund (Matte) mit Deckung alpha.
Wir rechnen die Matte heraus:  F = (C - (1-alpha)*matte) / alpha.
Das saeubert die Kantenfarbe OHNE Erosion -> duenne Merkmale (Schnuere, Laeufe) bleiben.
Zusaetzlich: schwachen Geister-Saum (sehr kleines Alpha) auf 0.
"""
import sys
import numpy as np
from PIL import Image


def analyze(path: str) -> None:
    im = Image.open(path).convert("RGBA")
    a = np.array(im)[..., 3].astype(np.float32) / 255.0
    rgb = np.array(im)[..., :3].astype(np.float32)
    opaque = a >= 0.9
    keep = a >= 0.5          # was Alpha-Scissor (0.5) im Spiel rendert
    semi = (a > 0.05) & (a < 0.9)
    lum = rgb.mean(axis=2)
    print(f"{path}")
    print(f"  opaque={opaque.sum()} semi={semi.sum()} | helligkeit: figur(opaque)={lum[opaque].mean():.0f}"
          f" semi={lum[semi].mean():.0f} scissor-rand(0.5..0.9)="
          f"{lum[keep & ~opaque].mean() if (keep & ~opaque).any() else 0:.0f}")


def defringe(path: str, out: str, matte: float = 255.0, alpha_floor: int = 16,
             strength: float = 1.0) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im).astype(np.float32)
    rgb = arr[..., :3]
    a = (arr[..., 3] / 255.0)[..., None]
    a_safe = np.clip(a, 1e-3, 1.0)

    unmatted = (rgb - (1.0 - a) * matte) / a_safe          # Figurfarbe ohne Matte
    F = rgb * (1.0 - strength) + unmatted * strength
    F = np.clip(F, 0.0, 255.0)

    aa = arr[..., 3].copy()
    aa[aa < alpha_floor] = 0.0                              # Geister-Saum kappen

    out_arr = np.dstack([F, aa]).astype(np.uint8)
    Image.fromarray(out_arr, "RGBA").save(out)


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "analyze":
        for p in sys.argv[2:]:
            analyze(p)
    elif mode == "one":
        src, dst = sys.argv[2], sys.argv[3]
        strength = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
        defringe(src, dst, strength=strength)
        print(f"wrote {dst}")
    elif mode == "batch":
        import glob
        root = sys.argv[2]
        files = sorted(glob.glob(root + "/**/*.png", recursive=True))
        for f in files:
            defringe(f, f, strength=1.0)  # in-place
        print(f"defringed {len(files)} files under {root}")
