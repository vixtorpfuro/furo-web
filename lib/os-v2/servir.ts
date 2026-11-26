import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { CAMPOS } from '@/lib/pedidos/campos'
import { puedeVerOsV2 } from './acceso'

// FURŌ OS v2 es un mockup navegable hecho como componentes .dc.html (diseño en claude.ai).
// Se entrega desde lib/ (no desde public/) para que solo lo vean usuarios con sesión interna,
// y se arma en una página autónoma con un renderizador mínimo (runtime.js).
const DIR = path.join(process.cwd(), 'lib/os-v2')

const ENLACES: Record<string, string> = {
  'OS.dc.html': '/interno/os-v2',
  'Formulario.dc.html': '/interno/os-v2/formulario',
  'Cliente.dc.html': 'https://www.furo.company/propuestas/colonia-suiza-c9feec.html',
}

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const cache = new Map<string, string>()

async function armar(archivo: string, titulo: string): Promise<string> {
  const [fuente, runtime] = await Promise.all([
    readFile(path.join(DIR, archivo), 'utf-8'),
    readFile(path.join(DIR, 'runtime.js'), 'utf-8'),
  ])
  const helmet = fuente.match(/<helmet>([\s\S]*?)<\/helmet>/)?.[1] ?? ''
  const cuerpo = fuente.match(/<\/helmet>([\s\S]*?)<\/x-dc>/)?.[1] ?? ''
  const script = fuente.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ''
  let plantilla = cuerpo
  for (const [de, a] of Object.entries(ENLACES)) plantilla = plantilla.split(`href="${de}"`).join(`href="${a}"`)
  // Los enlaces externos se abren en otra pestaña.
  plantilla = plantilla.replace(/<a href="https:\/\//g, '<a target="_blank" rel="noopener" href="https://')

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${titulo}</title>
${helmet}
</head>
<body>
<div id="raiz"></div>
<template id="plantilla">${plantilla}</template>
<script>window.__CAMPOS = ${JSON.stringify(CAMPOS)};</script>
<script>${runtime}</script>
<script>
${script}
montarDC(document.getElementById('plantilla'), document.getElementById('raiz'), Component);
</script>
</body>
</html>`
}

export async function servirOsV2(req: Request, archivo: string, titulo: string, ruta: string) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.redirect(new URL(`/interno/login?next=${ruta}`, req.url))
  if (!puedeVerOsV2(sesion.email)) return NextResponse.redirect(new URL('/interno', req.url))

  let html = cache.get(archivo)
  if (!html || process.env.NODE_ENV !== 'production') {
    html = await armar(archivo, titulo)
    cache.set(archivo, html)
  }
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy': CSP,
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
