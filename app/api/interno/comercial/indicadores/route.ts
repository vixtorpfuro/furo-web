import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { guardarIndicadores, limpiarIndicadores } from '@/lib/comercial/datos'

// Guarda los indicadores UF/m² del board comercial.
export async function PUT(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const ind = limpiarIndicadores(await req.json().catch(() => null))
  if (!ind) return NextResponse.json({ error: 'Indicadores no válidos.' }, { status: 400 })

  try {
    await guardarIndicadores(ind, sesion.nombre)
    return NextResponse.json({ ok: true, indicadores: ind })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo guardar.' }, { status: 502 })
  }
}
