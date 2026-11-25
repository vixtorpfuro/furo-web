"""Genera escenas isométricas SVG para el mockup FURŌ OS.
Uso: python3 escena.py  -> escribe portada.svgpart, modelo.svgpart, montaje.svgpart
"""
import math, os, random

OUT = os.path.dirname(os.path.abspath(__file__))
C30, S30 = math.cos(math.radians(30)), 0.5


class Iso:
    def __init__(self, ox, oy, s):
        self.ox, self.oy, self.s = ox, oy, s
        self.parts = []

    def p(self, x, y, z=0):
        return (self.ox + (x - y) * C30 * self.s, self.oy + (x + y) * S30 * self.s - z * self.s)

    def poly(self, pts, fill, stroke=None, sw=0.6, op=None, extra=''):
        d = ' '.join(f'{a:.1f},{b:.1f}' for a, b in (self.p(*q) for q in pts))
        st = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
        o = f' opacity="{op}"' if op is not None else ''
        self.parts.append(f'<polygon points="{d}" fill="{fill}"{st}{o}{extra}></polygon>')

    def line(self, a, b, col, sw=1, op=None, dash=None):
        (x1, y1), (x2, y2) = self.p(*a), self.p(*b)
        o = f' opacity="{op}"' if op is not None else ''
        da = f' stroke-dasharray="{dash}"' if dash else ''
        self.parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{o}{da}></line>')

    def box(self, x0, y0, z0, x1, y1, z1, top, left, right, stroke=None, sw=0.5):
        self.poly([(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)], right, stroke, sw)
        self.poly([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], left, stroke, sw)
        self.poly([(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], top, stroke, sw)

    def shadow(self, x0, y0, x1, y1, dx=1.2, op=0.18):
        self.poly([(x0 + dx, y0 + dx * .4, 0), (x1 + dx, y0 + dx * .4, 0), (x1 + dx, y1 + dx, 0), (x0 + dx, y1 + dx, 0)], '#4b443c', op=op)

    def gable(self, x0, y0, x1, y1, h, r, wall_l, wall_r, roof_n, roof_s, stroke=None, ov=0.35):
        ym = (y0 + y1) / 2
        # paredes
        self.poly([(x1, y0, 0), (x1, y1, 0), (x1, y1, h), (x1, y0, h)], wall_r, stroke)
        self.poly([(x0, y1, 0), (x1, y1, 0), (x1, y1, h), (x0, y1, h)], wall_l, stroke)
        # faldón norte, testero, faldón sur
        self.poly([(x0 - ov, y0 - ov, h - .15), (x1 + ov, y0 - ov, h - .15), (x1 + ov, ym, h + r), (x0 - ov, ym, h + r)], roof_n, stroke)
        self.poly([(x1, y0, h), (x1, y1, h), (x1, ym, h + r)], wall_r, stroke)
        self.poly([(x0 - ov, y1 + ov, h - .15), (x1 + ov, y1 + ov, h - .15), (x1 + ov, ym, h + r), (x0 - ov, ym, h + r)], roof_s, stroke)

    def tree(self, x, y, r=1.1, h=1.6, col='#8fa07c', dark='#73855f'):
        bx, by = self.p(x, y, 0)
        cx, cy = self.p(x, y, h + r * .7)
        rp = r * self.s
        self.parts.append(f'<ellipse cx="{bx + rp*.35:.1f}" cy="{by + 2:.1f}" rx="{rp*.95:.1f}" ry="{rp*.45:.1f}" fill="#4b443c" opacity="0.16"></ellipse>')
        self.parts.append(f'<line x1="{bx:.1f}" y1="{by:.1f}" x2="{bx:.1f}" y2="{cy:.1f}" stroke="#7a6550" stroke-width="2"></line>')
        self.parts.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rp:.1f}" fill="{col}"></circle>')
        self.parts.append(f'<circle cx="{cx - rp*.3:.1f}" cy="{cy - rp*.3:.1f}" r="{rp*.55:.1f}" fill="#a9b893" opacity="0.7"></circle>')
        self.parts.append(f'<path d="M{cx + rp*.1:.1f} {cy + rp:.1f} A{rp:.1f} {rp:.1f} 0 0 0 {cx + rp:.1f} {cy:.1f}" fill="none" stroke="{dark}" stroke-width="{rp*.35:.1f}" opacity="0.5"></path>')

    def truck(self, x, y, load, cab='#f5f3ee', flip=False):
        # camión a lo largo de x; cabina en x+9
        L = 8.5
        self.shadow(x, y, x + L + 2.4, y + 2.2, dx=.8, op=.2)
        # ruedas
        for wx in (x + 1.2, x + 3.0, x + 7.0, x + L + 1.6):
            for wy in (y + 2.2,):
                cx, cy = self.p(wx, wy, .45)
                self.parts.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{.42*self.s:.1f}" ry="{.5*self.s:.1f}" fill="#2b2622"></ellipse>')
        # chasis / rampla
        self.box(x, y, .55, x + L, y + 2.2, .9, '#6f6860', '#4f4943', '#5d564e')
        # carga (paquetes de componentes) por colores de izaje
        cx0 = x + .25
        for i, col in enumerate(load):
            w = (L - .5) / len(load)
            hh = 1.1 + (i % 2) * .35
            self.box(cx0 + i * w + .05, y + .15, .9, cx0 + (i + 1) * w - .05, y + 2.05, .9 + hh, col, shade(col, .82), shade(col, .9), '#2b2622', .3)
        # cabina
        self.box(x + L + .2, y + .1, .55, x + L + 2.4, y + 2.1, 2.5, shade(cab, .97), shade(cab, .86), shade(cab, .93), '#9d958b', .4)
        self.poly([(x + L + 2.4, y + .35, 1.6), (x + L + 2.4, y + 1.85, 1.6), (x + L + 2.4, y + 1.85, 2.3), (x + L + 2.4, y + .35, 2.3)], '#4d5a63')


def shade(hexcol, f):
    hexcol = hexcol.lstrip('#')
    r, g, b = (int(hexcol[i:i + 2], 16) for i in (0, 2, 4))
    return '#%02x%02x%02x' % tuple(max(0, min(255, int(c * f))) for c in (r, g, b))


IZ = ['#52448a', '#c08a3e', '#6f9a72', '#8b7fc0']  # colores de izaje 1..4


def portada():
    g = Iso(500, 64, 13.2)
    X, Y, T = 50, 28, 1.4
    # placa base
    g.poly([(0, Y, 0), (X, Y, 0), (X, Y, -T), (0, Y, -T)], '#c9c3b6')
    g.poly([(X, 0, 0), (X, Y, 0), (X, Y, -T), (X, 0, -T)], '#d6d1c6')
    g.poly([(0, 0, 0), (X, 0, 0), (X, Y, 0), (0, Y, 0)], '#e6e2d9')
    # pasto
    for (a, b, c, d) in [(1, 18, 15, 27), (17, 18, 30, 27), (32, 18, 49, 27), (24, 1, 33, 11), (44, 1, 49, 11)]:
        g.poly([(a, b, 0), (c, b, 0), (c, d, 0), (a, d, 0)], '#d3d7c4')
    # camino
    g.poly([(0, 12.6, 0), (X, 12.6, 0), (X, 16.8, 0), (0, 16.8, 0)], '#aaa499')
    for i in range(0, X, 3):
        g.line((i + .4, 14.7, 0), (i + 1.8, 14.7, 0), '#f5f3ee', 1.4, .9)
    # acceso a fábrica
    g.poly([(19, 9, 0), (23, 9, 0), (23, 12.6, 0), (19, 12.6, 0)], '#bdb7ab')

    # FÁBRICA (Pudahuel)
    fx0, fy0, fx1, fy1, fh = 2, 1.5, 20, 10.5, 4.6
    g.shadow(fx0, fy0, fx1, fy1, 2.2)
    g.box(fx0, fy0, 0, fx1, fy1, fh, '#d9d4ca', '#d8d2c7', '#ece8e0', '#b7b0a4', .5)
    # cubierta diente de sierra
    n = 6
    w = (fx1 - fx0) / n
    for i in range(n):
        a = fx0 + i * w
        g.poly([(a, fy0, fh), (a, fy1, fh), (a + w, fy1, fh + 1.6), (a + w, fy0, fh + 1.6)], '#4a4462', '#38334c', .4)
        g.poly([(a + w, fy0, fh), (a + w, fy1, fh), (a + w, fy1, fh + 1.6), (a + w, fy0, fh + 1.6)], '#b8c4cc', '#8f9aa1', .4)
    # portón y ventanas
    g.poly([(fx1, 5, 0), (fx1, 8.6, 0), (fx1, 8.6, 3.2), (fx1, 5, 3.2)], '#3b3631')
    for k in range(4):
        g.poly([(fx1, 1.9 + k * .75, 1.4), (fx1, 2.4 + k * .75, 1.4), (fx1, 2.4 + k * .75, 2.6), (fx1, 1.9 + k * .75, 2.6)], '#b8c4cc') if k < 3 else None
    for k in range(7):
        a = fx0 + 1 + k * 2.4
        g.poly([(a, fy1, 1.6), (a + 1.4, fy1, 1.6), (a + 1.4, fy1, 2.9), (a, fy1, 2.9)], '#b8c4cc')
    # acopio de madera
    for i, (a, b) in enumerate([(21, 2), (21, 4.6), (23.4, 2)]):
        for lay in range(3):
            g.box(a, b, lay * .45, a + 2, b + 2, lay * .45 + .42, '#d8b07a', '#b98c55', '#c99b62', '#8f6a3e', .3)
    # paquetes de componentes listos
    for i, col in enumerate(IZ):
        a = 21 + (i % 2) * 2.4
        b = 7 + (i // 2) * 0
        if i < 2:
            g.box(a, 7.2, 0, a + 2, 8.8, 1.0, col, shade(col, .8), shade(col, .9), '#2b2622', .3)

    # árboles fondo
    for (x, y) in [(26, 2), (28.5, 3.5), (31, 2.2), (27, 7.5), (30, 9), (45.5, 3), (47.5, 7), (1.2, 11.2)]:
        g.tree(x, y, r=1.0 + (x % 3) * .15)

    # CASA terminada (fondo derecha) – carbonizado
    g.shadow(35, 2, 43, 9)
    g.gable(35, 2, 43, 9, 2.6, 2.0, '#4a423b', '#5b5249', '#2b2622', '#3a3430', '#1f1c19', .3)
    for k in range(3):
        a = 36 + k * 2.4
        g.poly([(a, 9, .2), (a + 1.6, 9, .2), (a + 1.6, 9, 2.1), (a, 9, 2.1)], '#d7e0e5')
    g.poly([(43, 3.4, .2), (43, 5.2, .2), (43, 5.2, 2.0), (43, 3.4, 2.0)], '#d7e0e5')

    # CAMIONES en ruta
    g.truck(4, 13.2, [IZ[0], IZ[1], IZ[2]])
    g.truck(27.5, 13.2, [IZ[3], IZ[0], IZ[1]], cab='#e9e6df')

    # OBRAS lado sur
    # A) Casa terminada madera natural
    g.shadow(3, 19, 12, 25.5)
    g.gable(3, 19, 12, 25.5, 2.6, 1.9, '#b88b5a', '#c99b68', '#3a2d5e', '#4a3d70', '#2e2449', .35)
    for k in range(3):
        a = 4 + k * 2.6
        g.poly([(a, 25.5, .2), (a + 1.7, 25.5, .2), (a + 1.7, 25.5, 2.2), (a, 25.5, 2.2)], '#dfe7eb')
    # B) Casa en montaje: muros CM + techo parcial con CT
    bx0, by0, bx1, by1, bh = 19, 19, 28, 25.5, 2.6
    g.shadow(bx0, by0, bx1, by1, 1.2, .12)
    g.poly([(bx0, by0, .02), (bx1, by0, .02), (bx1, by1, .02), (bx0, by1, .02)], '#cfc9bd')
    ym = (by0 + by1) / 2
    # faldón norte con componentes
    for i in range(6):
        a = bx0 + i * 1.5
        col = '#c99b62' if i % 2 == 0 else '#e0c49a'
        if i < 5:
            g.poly([(a, by0 - .3, bh - .1), (a + 1.45, by0 - .3, bh - .1), (a + 1.45, ym, bh + 1.9), (a, ym, bh + 1.9)], col, '#8f6a3e', .4)
    # muros por paneles
    for i in range(6):
        a = bx0 + i * 1.5
        col = '#d2a771' if i % 2 == 0 else '#e8d3b0'
        g.poly([(a, by1, 0), (a + 1.45, by1, 0), (a + 1.45, by1, bh), (a, by1, bh)], col, '#8f6a3e', .4)
    g.poly([(bx1, by0, 0), (bx1, by1, 0), (bx1, by1, bh), (bx1, by0, bh)], '#c49461', '#8f6a3e', .4)
    g.poly([(bx1, by0, bh), (bx1, by1, bh), (bx1, ym, bh + 1.9)], '#d8b07a', '#8f6a3e', .4)
    # faldón sur parcial: 3 componentes montados
    for i in range(3):
        a = bx0 + i * 1.5
        col = IZ[0] if i == 2 else '#c99b62'
        g.poly([(a, by1 + .3, bh - .1), (a + 1.45, by1 + .3, bh - .1), (a + 1.45, ym, bh + 1.9), (a, ym, bh + 1.9)], col, '#6e5131', .4)
    # grúa
    g.line((30.5, 22, 0), (30.5, 22, 9), '#c08a3e', 2.2)
    g.line((30.5, 22, 9), (20.5, 22, 9), '#c08a3e', 1.8)
    g.line((30.5, 22, 9), (33, 22, 9), '#c08a3e', 1.8)
    g.line((30.5, 22, 10.2), (21, 22, 9.05), '#8a6a3e', .8)
    g.line((24, 22, 9), (24, 22, 6.2), '#4b443c', .8)
    g.box(23.2, 21.4, 5.6, 24.8, 22.6, 6.1, IZ[0], shade(IZ[0], .8), shade(IZ[0], .9), '#2b2622', .3)
    g.box(32.4, 21.4, 9, 33.4, 22.6, 9.8, '#6f6860', '#4f4943', '#5d564e')
    # C) Estructura (solo marcos)
    cx0, cy0, cx1, cy1, ch = 35, 19, 44, 25.5, 2.6
    g.poly([(cx0, cy0, .02), (cx1, cy0, .02), (cx1, cy1, .02), (cx0, cy1, .02)], '#cfc9bd')
    ym = (cy0 + cy1) / 2
    wood = '#a87b4a'
    for i in range(7):
        a = cx0 + i * 1.5
        g.line((a, cy0, 0), (a, cy0, ch), wood, 1.4)
        g.line((a, cy0, ch), (a, ym, ch + 1.9), wood, 1.4)
        g.line((a, ym, ch + 1.9), (a, cy1, ch), wood, 1.4)
        g.line((a, cy1, 0), (a, cy1, ch), wood, 1.6)
    g.line((cx0, cy0, ch), (cx1, cy0, ch), wood, 1.6)
    g.line((cx0, cy1, ch), (cx1, cy1, ch), wood, 1.6)
    g.line((cx0, ym, ch + 1.9), (cx1, ym, ch + 1.9), wood, 2)
    g.line((cx0, cy1, 0), (cx1, cy1, 0), wood, 1.6)
    # árboles frente
    for (x, y) in [(14, 24.5), (15.5, 21), (30.5, 26), (46.5, 21.5), (47.5, 25.2), (1.5, 26.6)]:
        g.tree(x, y, r=1.0)

    pins = {
        'fabrica': g.p(11, 6, 7.2),
        'camion': g.p(32, 14.3, 4.2),
        'montaje': g.p(23.5, 22, 6.2),
        'pedido': g.p(39.5, 22, 5.6),
        'terminada': g.p(39, 5.5, 5.4),
    }
    return '\n'.join(g.parts), pins


def modelo(colors):
    """Casa tipo con componentes coloreados por familia (vista 3D FURŌ)."""
    g = Iso(300, 60, 21)
    x0, y0, x1, y1, h, r = 0, 0, 12.64, 7.2, 2.53, 2.0
    ym = (y0 + y1) / 2
    g.poly([(-1, -1, 0), (x1 + 1, -1, 0), (x1 + 1, y1 + 1, 0), (-1, y1 + 1, 0)], '#2a2723', '#3a3631', .6)
    for i in range(0, 15):
        g.line((-1 + i, -1, 0), (-1 + i, y1 + 1, 0), '#3a3631', .5)
    # piso y muro norte (cara interior)
    g.poly([(x0, y0, .05), (x1, y0, .05), (x1, y1, .05), (x0, y1, .05)], '#3a3631', '#4a4640', .5)
    seqn = [1.24, 1.16] * 5 + [0.64]
    a = x0
    for i, wseg in enumerate(seqn):
        fam = 'cm' if abs(wseg - 1.24) < .01 else ('cm2' if wseg < 1 else 'cbm')
        g.poly([(a, y0, 0), (a + wseg, y0, 0), (a + wseg, y0, h), (a, y0, h)], colors[fam], '#141210', .6, op=.7)
        a += wseg
    # faldón norte
    k = 0
    a = x0
    seq = [1.24, 1.16] * 5 + [0.64]
    for wseg in seq:
        fam = 'ct' if abs(wseg - 1.24) < .01 else ('cb' if abs(wseg - 1.16) < .01 else 'ct2')
        g.poly([(a, y0 - .3, h - .1), (a + wseg, y0 - .3, h - .1), (a + wseg, ym, h + r), (a, ym, h + r)], colors[fam], '#141210', .6)
        a += wseg
    # muro sur por componentes
    a = x0
    for i, wseg in enumerate(seq):
        fam = 'cm' if abs(wseg - 1.24) < .01 else ('vano' if i in (3, 7) else ('cbm' if abs(wseg - 1.16) < .01 else 'cm2'))
        g.poly([(a, y1, 0), (a + wseg, y1, 0), (a + wseg, y1, h), (a, y1, h)], colors[fam], '#141210', .6)
        a += wseg
    # testero
    g.poly([(x1, y0, 0), (x1, y1, 0), (x1, y1, h), (x1, y0, h)], colors['test'], '#141210', .6)
    g.poly([(x1, y0, h), (x1, y1, h), (x1, ym, h + r)], colors['test'], '#141210', .6)
    # colectora
    g.line((x0, y1 + .05, h), (x1, y1 + .05, h), colors['col'], 3)
    # faldón sur: solo contorno (corte para ver muros)
    g.poly([(x0 - .3, y1 + .3, h - .1), (x1 + .3, y1 + .3, h - .1), (x1 + .3, ym, h + r), (x0 - .3, ym, h + r)], 'none', '#f5f3ee', .8, op=.35, extra=' stroke-dasharray="4 4"')
    return '\n'.join(g.parts)


if __name__ == '__main__':
    sc, pins = portada()
    open(os.path.join(OUT, 'portada.svgpart'), 'w').write(sc)
    print({k: (round(v[0]), round(v[1])) for k, v in pins.items()})
    cols = {'ct': '{{ cCT }}', 'ct2': '{{ cCT2 }}', 'cb': '{{ cCB }}', 'cm': '{{ cCM }}', 'cm2': '{{ cCM2 }}',
            'cbm': '{{ cCBM }}', 'vano': '{{ cVano }}', 'test': '{{ cTest }}', 'col': '{{ cCol }}'}
    open(os.path.join(OUT, 'modelo.svgpart'), 'w').write(modelo(cols))
