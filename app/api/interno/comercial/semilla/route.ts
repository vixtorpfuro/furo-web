import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { writeClient } from '@/sanity/lib/writeClient'
import { aDocumento, contarProyectos } from '@/lib/comercial/datos'
import { PROYECTOS_SEMILLA } from '@/lib/comercial/semilla'

// Carga la cartera inicial (PDF 29-10-2026 + croquera). Solo funciona con el board vacío, para no
// duplicar proyectos si alguien vuelve a apretar el botón.
export async function POST(req: Request) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  try {
    if ((await contarProyectos()) > 0) {
      return NextResponse.json({ error: 'El board ya tiene proyectos; la carga inicial solo se hace una vez.' }, { status: 409 })
    }
    const tx = writeClient.transaction()
    for (const datos of PROYECTOS_SEMILLA) tx.create({ _type: 'proyectoComercial', ...aDocumento(datos, sesion.nombre) })
    await tx.commit()
    return NextResponse.json({ ok: true, creados: PROYECTOS_SEMILLA.length })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo cargar la cartera.' }, { status: 502 })
  }
}
