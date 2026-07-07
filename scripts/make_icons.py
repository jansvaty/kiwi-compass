"""Generate the Kiwi Compass app icons (pure stdlib PNG writer).

Draws the compass mark from icons/logo.svg on the brand teal:
ring, needle pointing north-west, and a centre pivot dot.

Usage: python3 scripts/make_icons.py
"""
import zlib, struct, math, os

BG = (15, 61, 62)       # brand teal #0f3d3e
FG = (250, 250, 248)    # off-white #fafaf8
DIM = tuple(int(f * 0.55 + b * 0.45) for f, b in zip(FG, BG))  # muted tail

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")

# Geometry as fractions of icon size, matching logo.svg proportions
RING_R = 0.35
RING_W = 0.045
NEEDLE_LEN = 0.245     # centre to tip / tail
NEEDLE_HALFW = 0.105   # side spread from centre
DOT_R = 0.05

U = (-math.sqrt(0.5), -math.sqrt(0.5))   # needle direction: north-west
V = (math.sqrt(0.5), -math.sqrt(0.5))    # perpendicular


def in_triangle(p, a, b, c):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    d1, d2, d3 = sign(p, a, b), sign(p, b, c), sign(p, c, a)
    has_neg = d1 < 0 or d2 < 0 or d3 < 0
    has_pos = d1 > 0 or d2 > 0 or d3 > 0
    return not (has_neg and has_pos)


def make(size, path):
    c = (size / 2, size / 2)
    tip = (c[0] + U[0] * NEEDLE_LEN * size, c[1] + U[1] * NEEDLE_LEN * size)
    tail = (c[0] - U[0] * NEEDLE_LEN * size, c[1] - U[1] * NEEDLE_LEN * size)
    s1 = (c[0] + V[0] * NEEDLE_HALFW * size, c[1] + V[1] * NEEDLE_HALFW * size)
    s2 = (c[0] - V[0] * NEEDLE_HALFW * size, c[1] - V[1] * NEEDLE_HALFW * size)

    px = []
    for y in range(size):
        row = []
        for x in range(size):
            p = (x + 0.5, y + 0.5)
            d = math.hypot(p[0] - c[0], p[1] - c[1])
            col = BG
            if abs(d - RING_R * size) <= RING_W * size / 2:
                col = FG
            if in_triangle(p, tip, s1, s2):
                col = FG
            elif in_triangle(p, tail, s1, s2):
                col = DIM
            if d <= DOT_R * size:
                col = BG
            row.append(col)
        px.append(row)

    def chunk(tag, data):
        blob = tag + data
        return struct.pack(">I", len(data)) + blob + struct.pack(">I", zlib.crc32(blob))

    raw = b"".join(b"\x00" + bytes(v for pt in row for v in pt) for row in px)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)
    print(f"wrote {path} ({size}x{size})")


make(180, os.path.join(OUT_DIR, "icon-180.png"))
make(512, os.path.join(OUT_DIR, "icon-512.png"))
