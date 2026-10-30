# Cubicador FURŌ

Lee planos DXF, propone partidas de cubicación y las guarda en Postgres. La pantalla está en
`/interno/cubicador` del sitio (Next.js).

```
navegador ──(DXF, token corto)──▶ servicio Python (este) ──▶ Postgres ◀── Next.js /interno
```

El DXF va directo del navegador a este servicio porque pesa más que el límite de una función de
Vercel (4,5 MB). Next firma un token de 2 horas con `CUBICADOR_SECRET`; el servicio lo verifica.

## Variables

| Variable | Dónde | Para qué |
|---|---|---|
| `DATABASE_URL` | Next y servicio | Postgres (Neon u otro). La misma base para los dos. |
| `CUBICADOR_SECRET` | Next y servicio | Secreto compartido para el token de subida. Un texto largo y aleatorio. |
| `CUBICADOR_URL` | Next | URL pública del servicio, p. ej. `https://cubicador.furo.company`. |
| `CUBICADOR_ORIGENES` | servicio | Orígenes que pueden subir, separados por coma: `https://furo.company,https://www.furo.company`. |
| `CUBICADOR_ARCHIVOS` | servicio (opcional) | Carpeta donde se guardan los DXF originales. Por defecto `./archivos`. |

## Base de datos

```bash
node --env-file=.env.local scripts/migrar.mjs
```

Aplica las migraciones de `db/migraciones/` que falten. Tablas: `cub_proyectos`, `cub_revisiones`,
`cub_partidas`.

## Correr en local

```bash
python3 -m venv services/cubicador/.venv
services/cubicador/.venv/bin/pip install -r services/cubicador/requirements.txt
services/cubicador/.venv/bin/uvicorn main:app --app-dir services/cubicador --port 8010
```

Probar el extractor sin base de datos:

```bash
services/cubicador/.venv/bin/python services/cubicador/extractor.py plano.dxf
```

## Convención de capas que lee

| Capa | Uso |
|---|---|
| `*CORTE*` | Muros cortados en planta (rectángulos cerrados). En cortes, también el perfil del techo. |
| `*CONTORNO*` | Fachadas y vanos en elevaciones y cortes; perfil del techo a dos aguas. |
| `*PAV*` | Pavimento / deck. |
| `A-3D*`, `A-TEXTURA*`, `A-MOBILIARIO` | Se ignoran. |

Cada vista necesita un título grande que empiece con `PLANTA`, `ELEVACIÓN` o `CORTE`; la orientación
va entre paréntesis, p. ej. `ELEVACIÓN NOR-PONIENTE (NO)`. En elevaciones, el texto `±0.00` marca el
piso. Un vano que apoya en el piso se clasifica como puerta o ventanal hasta piso; el resto, como
ventana.

## Despliegue

Necesita un servidor con disco para guardar los DXF (Railway, Render o Fly.io, con un volumen
montado en `CUBICADOR_ARCHIVOS`). Comando de inicio:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
