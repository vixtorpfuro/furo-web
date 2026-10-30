import 'server-only'
import { SignJWT } from 'jose'
import type { SesionInterno } from '@/lib/interno/sesion'

// El navegador sube los planos directo al servicio de cubicación (Python): los DXF pesan más que
// el límite de una función de Vercel. Este token corto le dice al servicio quién sube y a qué proyecto.
export async function tokenSubida(sesion: SesionInterno) {
  const secreto = process.env.CUBICADOR_SECRET
  if (!secreto) throw new Error('Falta configurar CUBICADOR_SECRET en el servidor.')
  return new SignJWT({ nombre: sesion.nombre, email: sesion.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience('cubicador')
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(secreto))
}

export function urlCubicador() {
  const url = process.env.CUBICADOR_URL
  if (!url) throw new Error('Falta configurar CUBICADOR_URL en el servidor.')
  return url.replace(/\/$/, '')
}
