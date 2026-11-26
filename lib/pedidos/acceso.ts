import 'server-only'
import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { listarLeads, type Lead } from './gmail'
import { puedeVerOsV2 } from '@/lib/os-v2/acceso'

// Solo se puede leer o escribir a correos de leads de Noki: así el interno no expone el resto
// de la casilla aunque alguien llame la API con otra dirección.
export async function exigirSesion() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  if (!puedeVerOsV2(sesion.email)) return NextResponse.json({ error: 'Sin acceso.' }, { status: 403 })
  return null
}

export async function leadPorEmail(email: string): Promise<Lead | null> {
  const e = email.trim().toLowerCase()
  if (!e) return null
  return (await listarLeads()).find((l) => l.email === e) ?? null
}

export function error(e: unknown, status = 500) {
  const msg = e instanceof Error ? e.message : 'Error inesperado.'
  return NextResponse.json({ error: msg }, { status })
}
