import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { crearItemMonday, limpiarDatosMonday, solicitudMismoOrigen } from '@/lib/cotizador/integraciones'

export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const datos = limpiarDatosMonday(await req.json().catch(() => null))
  if (!datos) return NextResponse.json({ error: 'Falta el nombre del proyecto.' }, { status: 400 })

  try {
    const itemId = await crearItemMonday(datos)
    return NextResponse.json({ ok: true, itemId })
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'Error comunicándose con Monday.'
    return NextResponse.json({ error: mensaje }, { status: 502 })
  }
}
