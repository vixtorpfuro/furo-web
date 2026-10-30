"""Lectura de planos DXF de FURŌ y propuesta de partidas de cubicación.

Se apoya en la convención de capas de los planos FURŌ:
  *CORTE*     muros cortados en planta (rectángulos cerrados)
  *CONTORNO*  contornos de fachadas y vanos en elevaciones y cortes; también el perfil del techo
  *PAV*       pavimento / deck
  A-3D*, A-TEXTURA*, A-MOBILIARIO   se ignoran
Las vistas se reconocen por su título (texto grande que empieza con PLANTA, ELEVACIÓN o CORTE).

El resultado son partidas *propuestas*: cada una dice de dónde salió y con qué confianza, para que
alguien la confirme o la corrija en el interno.
"""
from __future__ import annotations

import math
import re
import statistics
from collections import Counter, defaultdict
from dataclasses import dataclass, field

import ezdxf
from ezdxf import bbox as ezbbox

UNIDADES = {0: (1.0, 'sin unidad (se asume metros)'), 1: (0.0254, 'pulgadas'), 4: (0.001, 'milímetros'),
            5: (0.01, 'centímetros'), 6: (1.0, 'metros')}
IGNORAR = re.compile(r'^(A-3D|A-TEXTURA|A-MOBILIARIO|DEFPOINTS)', re.I)
CAPA_CORTE = re.compile(r'CORTE', re.I)
CAPA_CONTORNO = re.compile(r'CONTORNO|CORTE', re.I)
CAPA_PAV = re.compile(r'PAV', re.I)
TITULO = re.compile(r'^\s*(PLANTA|ELEVACI[OÓ]N|CORTE)\b', re.I)
ORIENTACION = re.compile(r'\((NO|NE|SO|SE|N|S|E|O)\)')
NPT = re.compile(r'^\s*[±]?\s*0[.,]00\b')

TOL = 0.05          # m: tolerancia para "toca" o "apoya en el piso"
HUECO_MAX = 5.0     # m: vano máximo que se salta al agrupar muros alineados de un mismo volumen
ALTO_FACHADA = 1.8  # m: alto mínimo para considerar un contorno como fachada o vano hasta piso


@dataclass
class Rect:
    x0: float
    y0: float
    x1: float
    y1: float
    capa: str

    @property
    def w(self): return self.x1 - self.x0

    @property
    def h(self): return self.y1 - self.y0

    def contiene(self, o: 'Rect', tol=TOL):
        return o.x0 >= self.x0 - tol and o.x1 <= self.x1 + tol and o.y0 >= self.y0 - tol and o.y1 <= self.y1 + tol

    def igual(self, o: 'Rect', tol=0.01):
        return all(abs(a - b) <= tol for a, b in ((self.x0, o.x0), (self.y0, o.y0), (self.x1, o.x1), (self.y1, o.y1)))


@dataclass
class Poligono:
    pts: list[tuple[float, float]]
    capa: str

    @property
    def rect(self):
        xs, ys = zip(*self.pts)
        return Rect(min(xs), min(ys), max(xs), max(ys), self.capa)

    @property
    def area(self):
        a = 0.0
        for (x0, y0), (x1, y1) in zip(self.pts, self.pts[1:] + self.pts[:1]):
            a += x0 * y1 - x1 * y0
        return abs(a) / 2


@dataclass
class Texto:
    texto: str
    x: float
    y: float
    alto: float
    capa: str


@dataclass
class Vista:
    tipo: str            # planta | elevacion | corte
    titulo: str
    x: float
    y: float
    rects: list[Rect] = field(default_factory=list)
    poligonos: list[Poligono] = field(default_factory=list)
    textos: list[Texto] = field(default_factory=list)
    pav: list[Rect] = field(default_factory=list)

    @property
    def nombre(self):
        o = ORIENTACION.search(self.titulo)
        if self.tipo == 'elevacion' and o:
            return f'Elevación {o.group(1)}'
        if self.tipo == 'corte':
            m = re.match(r'\s*CORTE\s+(\S+)', self.titulo, re.I)
            return f'Corte {m.group(1)}' if m else 'Corte'
        return self.titulo.split('—')[0].split('·')[0].strip().capitalize()


@dataclass
class Partida:
    grupo: str
    codigo: str
    descripcion: str
    unidad: str
    cantidad: float
    fuente: str
    confianza: str = 'media'

    def dict(self):
        return {**self.__dict__, 'cantidad': round(self.cantidad, 3)}


# ------------------------------------------------------------------ lectura

def _texto(e):
    if e.dxftype() == 'TEXT':
        return e.dxf.text, e.dxf.insert, e.dxf.get('height', 0)
    return e.plain_text(), e.dxf.insert, e.dxf.get('char_height', 0)


def leer(ruta: str):
    doc = ezdxf.readfile(ruta)
    escala, unidades = UNIDADES.get(doc.header.get('$INSUNITS', 0), (1.0, 'desconocidas (se asumen metros)'))
    msp = doc.modelspace()
    textos, rects, poligonos, pav = [], [], [], []
    for e in msp:
        capa = e.dxf.layer
        if IGNORAR.match(capa):
            continue
        t = e.dxftype()
        if t in ('TEXT', 'MTEXT'):
            s, p, h = _texto(e)
            if s and s.strip():
                textos.append(Texto(s.strip(), p.x * escala, p.y * escala, h * escala, capa))
        elif CAPA_PAV.search(capa):
            b = ezbbox.extents([e])
            if b.has_data:
                pav.append(Rect(b.extmin.x * escala, b.extmin.y * escala, b.extmax.x * escala, b.extmax.y * escala, capa))
        elif t == 'LWPOLYLINE' and e.closed:
            pts = [(x * escala, y * escala) for x, y in e.get_points('xy')]
            if len(pts) > 1 and pts[0] == pts[-1]:
                pts = pts[:-1]
            xs = {round(x, 3) for x, _ in pts}
            ys = {round(y, 3) for _, y in pts}
            if len(pts) == 4 and len(xs) == 2 and len(ys) == 2:
                rects.append(Rect(min(xs), min(ys), max(xs), max(ys), capa))
            elif len(pts) >= 5:
                poligonos.append(Poligono(pts, capa))
    return unidades, textos, rects, poligonos, pav


def separar_vistas(textos, rects, poligonos, pav):
    alto_med = statistics.median([t.alto for t in textos]) if textos else 0
    vistas = []
    for t in textos:
        m = TITULO.match(t.texto)
        if m and t.alto >= 1.5 * alto_med:
            palabra = m.group(1).upper()
            tipo = 'planta' if palabra == 'PLANTA' else ('corte' if palabra == 'CORTE' else 'elevacion')
            vistas.append(Vista(tipo, t.texto.strip(), t.x, t.y))
    if not vistas:
        return []

    # Cada objeto va a la vista cuyo título está más cerca por encima y a su izquierda.
    def vista_de(xmin, ymax):
        cand = [v for v in vistas if v.y >= ymax - 0.3 and v.x <= xmin + 0.3]
        if not cand:
            return None
        return min(cand, key=lambda v: (round(v.y - ymax, 1), -v.x))

    titulos = {id(v) for v in vistas}
    for t in textos:
        v = vista_de(t.x, t.y + t.alto)
        if v and not (TITULO.match(t.texto) and t.texto.strip() == v.titulo):
            v.textos.append(t)
    for r in rects:
        v = vista_de(r.x0, r.y1)
        if v:
            v.rects.append(r)
    for p in poligonos:
        r = p.rect
        v = vista_de(r.x0, r.y1)
        if v:
            v.poligonos.append(p)
    for r in pav:
        v = vista_de(r.x0, r.y1)
        if v:
            v.pav.append(r)
    del titulos
    return vistas


# ------------------------------------------------------------------ planta

def _alineados(a: Rect, b: Rect):
    """Dos tramos de muro en la misma línea (con un vano entre medio) o que se tocan."""
    sep_x = max(a.x0, b.x0) - min(a.x1, b.x1)
    sep_y = max(a.y0, b.y0) - min(a.y1, b.y1)
    if sep_x <= TOL and sep_y <= TOL:
        return True
    if sep_y <= -0.02 and 0 < sep_x <= HUECO_MAX:   # misma franja horizontal
        return True
    if sep_x <= -0.02 and 0 < sep_y <= HUECO_MAX:   # misma franja vertical
        return True
    return False


def _grupos(rects):
    padre = list(range(len(rects)))

    def raiz(i):
        while padre[i] != i:
            padre[i] = padre[padre[i]]
            i = padre[i]
        return i

    for i in range(len(rects)):
        for j in range(i + 1, len(rects)):
            if _alineados(rects[i], rects[j]):
                padre[raiz(i)] = raiz(j)
    grupos = defaultdict(list)
    for i, r in enumerate(rects):
        grupos[raiz(i)].append(r)
    return list(grupos.values())


def cubicar_planta(v: Vista, n: int):
    partidas, avisos = [], []
    muros = [r for r in v.rects if CAPA_CORTE.search(r.capa) and min(r.w, r.h) >= 0.03]
    if not muros:
        avisos.append(f'{v.nombre}: no hay muros cortados (capa *CORTE*).')
    else:
        gruesos = [r for r in muros if max(r.w, r.h) >= 0.5 and min(r.w, r.h) >= 0.15]
        delgados = [r for r in muros if max(r.w, r.h) >= 0.5 and min(r.w, r.h) < 0.15]
        if gruesos:
            partidas.append(Partida('Muros y tabiques', f'PL{n}-M', 'Muros cortados en planta (espesor ≥ 0.15)', 'ml',
                                    sum(max(r.w, r.h) for r in gruesos), f'{v.nombre}: {len(gruesos)} tramos en capa *CORTE*', 'media'))
        if delgados:
            partidas.append(Partida('Muros y tabiques', f'PL{n}-T', 'Tabiques y montantes (espesor < 0.15)', 'ml',
                                    sum(max(r.w, r.h) for r in delgados), f'{v.nombre}: {len(delgados)} tramos en capa *CORTE*', 'baja'))

        # Volúmenes: muros alineados del mismo volumen, saltando vanos de hasta HUECO_MAX.
        alto_rec = max((t.alto for t in v.textos), default=0) * 0.95
        recintos = [t for t in v.textos if t.alto >= alto_rec and len(t.texto) > 2 and not re.match(r'^[\d.,+±−-]', t.texto)]
        for i, g in enumerate(sorted(_grupos(muros), key=lambda g: min(r.x0 for r in g)), start=1):
            caja = Rect(min(r.x0 for r in g), min(r.y0 for r in g), max(r.x1 for r in g), max(r.y1 for r in g), '')
            if caja.w * caja.h < 4:
                continue
            nombres = [t.texto for t in recintos if caja.contiene(Rect(t.x, t.y, t.x, t.y, ''), 0)]
            nombre = ' + '.join(dict.fromkeys(nombres)) or 'sin nombre'
            partidas.append(Partida('Superficies', f'PL{n}-V{i}', f'Volumen {nombre} ({caja.w:.2f} × {caja.h:.2f})', 'm²',
                                    caja.w * caja.h, f'{v.nombre}: contorno exterior de muros cortados', 'baja'))
    if v.pav:
        caja = Rect(min(r.x0 for r in v.pav), min(r.y0 for r in v.pav), max(r.x1 for r in v.pav), max(r.y1 for r in v.pav), '')
        partidas.append(Partida('Superficies', f'PL{n}-P', f'Plataforma / deck, contorno total ({caja.w:.2f} × {caja.h:.2f})', 'm²',
                                caja.w * caja.h, f'{v.nombre}: capa *PAV*', 'media'))
    return partidas, avisos


# ------------------------------------------------------------------ elevaciones y cortes

def _nivel_piso(v: Vista):
    bases = [r.y0 for r in v.rects if CAPA_CONTORNO.search(r.capa)] + [p.rect.y0 for p in v.poligonos]
    marca = next((t for t in v.textos if NPT.match(t.texto)), None)
    if marca:
        # La línea de piso es la base más repetida cerca de la marca ±0.00 (el texto va sobre la línea).
        cerca = Counter(round(b, 2) for b in bases if marca.y - 0.3 <= b <= marca.y + 0.05)
        if cerca:
            return max(cerca.items(), key=lambda kv: (kv[1], -kv[0]))[0]
    altos = [round(r.y0, 2) for r in v.rects if r.h >= ALTO_FACHADA]
    return statistics.mode(altos) if altos else None


def _tipo_vano(r: Rect, piso: float):
    if abs(r.y0 - piso) <= TOL:
        return 'Puerta' if r.w <= 1.2 else 'Ventanal / puerta hasta piso'
    return 'Ventana (no llega a piso)'


def cubicar_alzado(v: Vista, n: int):
    partidas, avisos = [], []
    piso = _nivel_piso(v)
    if piso is None:
        return partidas, [f'{v.nombre}: no se encontró el nivel de piso (texto ±0.00).']

    contornos = [r for r in v.rects if CAPA_CONTORNO.search(r.capa) and r.w >= 0.3 and r.h >= 0.3]
    # Fachadas: contornos que apoyan en el piso, altos y no contenidos en otro. Incluye frontones (polígonos).
    cand = [('rect', r, r.w * r.h) for r in contornos if abs(r.y0 - piso) <= TOL and r.h >= ALTO_FACHADA and r.w >= 2.0]
    cand += [('pol', p.rect, p.area) for p in v.poligonos if CAPA_CONTORNO.search(p.capa)
             and abs(p.rect.y0 - piso) <= TOL and p.rect.h >= ALTO_FACHADA and p.rect.w >= 2.0]
    fachadas = [c for c in cand if not any(o is not c and o[1].contiene(c[1], 0.01) and not o[1].igual(c[1]) for o in cand)]

    for i, (forma, caja, area) in enumerate(sorted(fachadas, key=lambda c: c[1].x0), start=1):
        dentro = [r for r in contornos if caja.contiene(r) and not caja.igual(r)
                  and not (abs(r.y0 - piso) <= TOL * 3 and r.h < ALTO_FACHADA)]
        vanos = [r for r in dentro if not any(o is not r and o.contiene(r, 0.01) and not o.igual(r) for o in dentro)]
        cod = f'AL{n}-F{i}'
        partidas.append(Partida('Envolvente', cod, f'{v.nombre} · fachada {i} bruta ({caja.w:.2f} × {caja.h:.2f}{", con frontón" if forma == "pol" else ""})',
                                'm²', area, f'{v.nombre}: capa *CONTORNO*', 'media' if forma == 'pol' or v.tipo == 'elevacion' else 'baja'))
        por_tipo = defaultdict(list)
        for r in vanos:
            por_tipo[(_tipo_vano(r, piso), round(r.w, 2), round(r.h, 2))].append(r)
        total_vanos = 0.0
        for j, ((tipo, w, h), rs) in enumerate(sorted(por_tipo.items()), start=1):
            m2 = len(rs) * w * h
            total_vanos += m2
            partidas.append(Partida('Vanos', f'{cod}-V{j}', f'{v.nombre} · {len(rs)} × {tipo} {w:.2f} × {h:.2f}', 'm²', m2,
                                    f'{v.nombre}, fachada {i}', 'media'))
        if vanos:
            partidas.append(Partida('Envolvente', f'{cod}-N', f'{v.nombre} · fachada {i} neta (sin vanos)', 'm²', area - total_vanos,
                                    f'{v.nombre}: bruta − vanos', 'media'))
    if not fachadas:
        avisos.append(f'{v.nombre}: no se reconoció ninguna fachada apoyada en el piso.')
    return partidas, avisos


def perfil_techo(vistas):
    """Pendiente y ancho desde el perfil de techo a dos aguas; largo desde la franja de techo más larga."""
    perfil = None
    for v in vistas:
        for p in v.poligonos:
            if not CAPA_CONTORNO.search(p.capa) or len(p.pts) < 5:
                continue
            caja = p.rect
            cumbre = max(p.pts, key=lambda q: q[1])
            if abs(cumbre[0] - (caja.x0 + caja.x1) / 2) > 0.1 * caja.w:
                continue
            izq = max((q for q in p.pts if abs(q[0] - caja.x0) < 0.01), key=lambda q: q[1])
            subida = cumbre[1] - izq[1]
            if subida <= 0.2:
                continue
            perfil = (v, caja.w, math.degrees(math.atan(subida / (caja.w / 2))))
            break
        if perfil:
            break
    if not perfil:
        return [], ['No se encontró un perfil de techo a dos aguas (polígono con cumbrera al centro).']
    v, ancho, pendiente = perfil
    largo = 0.0
    for w in vistas:
        piso = _nivel_piso(w) if w.tipo == 'elevacion' else None
        if piso is None:
            continue
        for r in w.rects:
            if CAPA_CONTORNO.search(r.capa) and r.y0 > piso + ALTO_FACHADA and r.w > largo:
                largo = r.w
    partidas = [Partida('Cubierta', 'CUB-P', f'Pendiente medida en {v.nombre} (ancho con aleros {ancho:.2f})', '°', pendiente,
                        f'{v.nombre}: borde superior del perfil de techo', 'alta')]
    if largo:
        faldon = ancho / 2 / math.cos(math.radians(pendiente))
        partidas += [
            Partida('Cubierta', 'CUB-A', f'Cubierta inclinada, 2 faldones ({largo:.2f} × {faldon:.2f} × 2)', 'm²', 2 * largo * faldon,
                    'Largo de la franja de techo en elevación × faldón', 'media'),
            Partida('Cubierta', 'CUB-C', 'Cumbrera', 'ml', largo, 'Largo de cubierta', 'media'),
            Partida('Cubierta', 'CUB-K', 'Canales (2 aleros longitudinales)', 'ml', 2 * largo, '2 × largo de cubierta', 'media'),
            Partida('Cubierta', 'CUB-T', 'Tapacanes de frontón', 'ml', 4 * faldon, '2 frontones × 2 faldones', 'media'),
        ]
    return partidas, []


# ------------------------------------------------------------------ entrada

def cubicar(ruta: str):
    unidades, textos, rects, poligonos, pav = leer(ruta)
    vistas = separar_vistas(textos, rects, poligonos, pav)
    partidas, avisos = [], []
    if not vistas:
        avisos.append('No se reconocieron vistas: falta un título que empiece con PLANTA, ELEVACIÓN o CORTE.')
    n_pl = n_al = 0
    for v in vistas:
        if v.tipo == 'planta':
            n_pl += 1
            p, a = cubicar_planta(v, n_pl)
        else:
            n_al += 1
            p, a = cubicar_alzado(v, n_al)
        partidas += p
        avisos += a
    p, a = perfil_techo([v for v in vistas if v.tipo != 'planta'])
    partidas += p
    avisos += a
    orden = ['Superficies', 'Envolvente', 'Vanos', 'Cubierta', 'Muros y tabiques']
    partidas.sort(key=lambda p: (orden.index(p.grupo) if p.grupo in orden else 99, p.codigo))
    return {
        'unidades': unidades,
        'vistas': [{'tipo': v.tipo, 'titulo': v.titulo} for v in vistas],
        'avisos': avisos,
        'partidas': [p.dict() for p in partidas],
    }


if __name__ == '__main__':
    import json
    import sys
    print(json.dumps(cubicar(sys.argv[1]), ensure_ascii=False, indent=1))
