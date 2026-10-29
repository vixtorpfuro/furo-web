import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { writeClient } from '@/sanity/lib/writeClient'
import { aDocumento, limpiarProyecto } from '@/lib/comercial/datos'

// Crea un proyecto en el board comercial.
export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const datos = limpiarProyecto(await req.json().catch(() => null))
  if (!datos) return NextResponse.json({ error: 'El proyecto necesita un nombre.' }, { status: 400 })

  try {
    const doc = await writeClient.create({ _type: 'proyectoComercial', ...aDocumento(datos, sesion.nombre) })
    return NextResponse.json({ ok: true, id: doc._id })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo crear el proyecto.' }, { status: 502 })
  }
}
