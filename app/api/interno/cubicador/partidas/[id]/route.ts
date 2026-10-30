import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { actualizarPartida, UUID } from '@/lib/cubicador/datos'

// Corrige a mano la cantidad o la descripción de una partida propuesta por el extractor.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })
  if (!UUID.test(id)) return NextResponse.json({ error: 'Partida no encontrada.' }, { status: 404 })

  const body = await req.json().catch(() => null)
  const descripcion = typeof body?.descripcion === 'string' ? body.descripcion.trim().slice(0, 300) : ''
  const cantidad = body?.cantidad === null ? null : Number(body?.cantidad)
  if (!descripcion) return NextResponse.json({ error: 'La partida necesita una descripción.' }, { status: 400 })
  if (cantidad !== null && (!Number.isFinite(cantidad) || Math.abs(cantidad) > 1e9)) {
    return NextResponse.json({ error: 'Cantidad no válida.' }, { status: 400 })
  }

  try {
    const ok = await actualizarPartida(id, { cantidad, descripcion }, sesion.nombre)
    if (!ok) return NextResponse.json({ error: 'Partida no encontrada.' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo guardar.' }, { status: 502 })
  }
}
