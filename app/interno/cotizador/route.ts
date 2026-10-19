import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'

// Cotizador obra gruesa V3 (antes cotizadorfuro.netlify.app). Es una app HTML/JS autónoma; se
// entrega desde lib/ (no desde public/) para que solo la vean usuarios con sesión interna.
export const dynamic = 'force-dynamic'

const RUTA_HTML = path.join(process.cwd(), 'lib/cotizador/cotizador.html')

const CSP = [
  "default-src 'self'",
  // La app usa handlers inline (onclick=...) en todo el HTML; connect-src/img-src restringidos
  // impiden sacar datos hacia otros dominios aunque se inyectara código.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

let htmlCache: string | null = null

export async function GET(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) {
    return NextResponse.redirect(new URL('/interno/login?next=/interno/cotizador', req.url))
  }

  htmlCache ??= await readFile(RUTA_HTML, 'utf-8')

  return new NextResponse(htmlCache, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy': CSP,
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
