import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { limpiarFilaSheet, pedirCorrelativo, registrarEnSheet } from '@/lib/cotizador/integraciones'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'

export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const body = await req.json().catch(() => null)
  try {
    if (body?.accion === 'correlativo') {
      const correlativo = await pedirCorrelativo()
      return NextResponse.json({ ok: true, correlativo })
    }
    if (body?.accion === 'registrar') {
      const fila = limpiarFilaSheet(body.datos)
      if (!fila.proyecto) return NextResponse.json({ error: 'Falta el nombre del proyecto.' }, { status: 400 })
      const { confirmado } = await registrarEnSheet(fila, sesion.nombre)
      return NextResponse.json({ ok: true, confirmado })
    }
    return NextResponse.json({ error: 'Acción no reconocida.' }, { status: 400 })
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'Error comunicándose con el Sheet.'
    return NextResponse.json({ error: mensaje }, { status: 502 })
  }
}
