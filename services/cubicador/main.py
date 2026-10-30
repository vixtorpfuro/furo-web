"""Servicio de cubicación de FURŌ.

Recibe un plano (DXF por ahora), propone partidas y las guarda en Postgres como una revisión del
proyecto. El interno (Next.js) firma un token corto con CUBICADOR_SECRET; el navegador sube el
archivo directo acá porque los DXF superan el límite de tamaño de una función de Vercel.

    uvicorn main:app --port 8010
"""
from __future__ import annotations

import hashlib
import os
import re
import tempfile
from pathlib import Path

import jwt
import psycopg
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from psycopg.types.json import Jsonb

from extractor import cubicar

MAX_BYTES = 60 * 1024 * 1024
ETIQUETA = re.compile(r'^[\w .\-]{1,40}$')
ARCHIVOS = Path(os.environ.get('CUBICADOR_ARCHIVOS', Path(__file__).parent / 'archivos'))

app = FastAPI(title='Cubicador FURŌ')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get('CUBICADOR_ORIGENES', 'http://localhost:3000').split(',') if o.strip()],
    allow_methods=['POST'],
    allow_headers=['Authorization'],
)


def _usuario(authorization: str | None) -> str:
    secreto = os.environ.get('CUBICADOR_SECRET')
    if not secreto:
        raise HTTPException(500, 'Falta configurar CUBICADOR_SECRET en el servicio.')
    token = (authorization or '').removeprefix('Bearer ').strip()
    try:
        datos = jwt.decode(token, secreto, algorithms=['HS256'], audience='cubicador')
    except jwt.PyJWTError:
        raise HTTPException(401, 'Sesión no válida. Recarga la página del interno.')
    return str(datos.get('nombre') or datos.get('email') or 'interno')


def _conexion():
    url = os.environ.get('DATABASE_URL')
    if not url:
        raise HTTPException(500, 'Falta configurar DATABASE_URL en el servicio.')
    return psycopg.connect(url)


@app.get('/salud')
def salud():
    return {'ok': True}


@app.post('/revisiones')
async def crear_revision(
    proyecto_id: str = Form(...),
    etiqueta: str = Form(...),
    archivo: UploadFile = File(...),
    authorization: str | None = Header(None),
):
    usuario = _usuario(authorization)
    etiqueta = etiqueta.strip()
    if not ETIQUETA.match(etiqueta):
        raise HTTPException(400, 'La revisión necesita una etiqueta corta, por ejemplo R07.')
    nombre = Path(archivo.filename or 'plano.dxf').name
    if not nombre.lower().endswith('.dxf'):
        raise HTTPException(400, 'Por ahora solo se leen archivos DXF. Desde AutoCAD: Guardar como → DXF.')
    datos = await archivo.read(MAX_BYTES + 1)
    if len(datos) > MAX_BYTES:
        raise HTTPException(413, 'El archivo supera 60 MB.')
    sha = hashlib.sha256(datos).hexdigest()

    with _conexion() as cx:
        if not cx.execute('select 1 from cub_proyectos where id = %s', (proyecto_id,)).fetchone():
            raise HTTPException(404, 'Proyecto no encontrado.')
        revision_id = cx.execute(
            """insert into cub_revisiones (proyecto_id, etiqueta, origen, archivo_nombre, archivo_sha256, archivo_bytes, creado_por)
               values (%s, %s, 'dxf', %s, %s, %s, %s) returning id""",
            (proyecto_id, etiqueta, nombre, sha, len(datos), usuario),
        ).fetchone()[0]
        cx.commit()

        # Se guarda el original para poder volver a procesarlo cuando mejore el extractor.
        ARCHIVOS.mkdir(parents=True, exist_ok=True)
        ruta = ARCHIVOS / f'{sha}.dxf'
        if not ruta.exists():
            ruta.write_bytes(datos)

        try:
            with tempfile.TemporaryDirectory() as tmp:
                copia = Path(tmp) / 'plano.dxf'
                copia.write_bytes(datos)
                resultado = cubicar(str(copia))
        except Exception as e:  # el DXF puede venir dañado o en un formato que ezdxf no lee
            cx.execute("update cub_revisiones set estado = 'error', error = %s where id = %s",
                       (f'No se pudo leer el DXF: {e}'[:500], revision_id))
            cx.commit()
            raise HTTPException(422, f'No se pudo leer el DXF: {e}')

        partidas = resultado.pop('partidas')
        with cx.cursor() as cur:
            cur.executemany(
                """insert into cub_partidas (revision_id, orden, grupo, codigo, descripcion, unidad, cantidad, cantidad_original, fuente, confianza)
                   values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                [(revision_id, i, p['grupo'], p['codigo'], p['descripcion'], p['unidad'], p['cantidad'], p['cantidad'],
                  p['fuente'], p['confianza']) for i, p in enumerate(partidas)],
            )
        cx.execute("update cub_revisiones set estado = 'lista', resumen = %s where id = %s", (Jsonb(resultado), revision_id))
        cx.commit()

    return {'id': str(revision_id), 'partidas': len(partidas), 'avisos': resultado['avisos']}
