import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { crearProyecto } from '@/lib/cubicador/datos'

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// Crea un proyecto del cubicador (las revisiones de planos se suben después al servicio Python).
export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const nombre = texto(body?.nombre, 120)
  if (!nombre) return NextResponse.json({ error: 'El proyecto necesita un nombre.' }, { status: 400 })

  try {
    const id = await crearProyecto(nombre, texto(body?.cliente, 120), sesion.nombre)
    return NextResponse.json({ ok: true, id })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo crear.' }, { status: 502 })
  }
}
