import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { writeClient } from '@/sanity/lib/writeClient'
import { aDocumento, limpiarProyecto } from '@/lib/comercial/datos'

const ID = /^[\w.-]{1,80}$/

async function proyectoExiste(id: string) {
  return !!(await writeClient.fetch(`*[_id == $id && _type == "proyectoComercial"][0]._id`, { id }))
}

async function verificar(req: Request, id: string) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return { error: NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 }) }
  if (!solicitudMismoOrigen(req)) return { error: NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 }) }
  if (!ID.test(id) || !(await proyectoExiste(id))) return { error: NextResponse.json({ error: 'Proyecto no encontrado.' }, { status: 404 }) }
  return { sesion }
}

// Reemplaza los datos editables del proyecto (nombre, tipo, hitos...).
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { sesion, error } = await verificar(req, id)
  if (error) return error

  const datos = limpiarProyecto(await req.json().catch(() => null))
  if (!datos) return NextResponse.json({ error: 'El proyecto necesita un nombre.' }, { status: 400 })

  try {
    const doc = aDocumento(datos, sesion.nombre)
    const vacios = ['cliente', 'superficie', 'm2', 'estado', 'mondayItemId'].filter(k => !(k in doc))
    await writeClient.patch(id).set(doc).unset(vacios).commit()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo guardar.' }, { status: 502 })
  }
}

// Archiva el proyecto (no se borra, por si hay que recuperarlo).
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { sesion, error } = await verificar(req, id)
  if (error) return error
  try {
    await writeClient.patch(id).set({ archivado: true, actualizadoPor: sesion.nombre }).commit()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'No se pudo archivar.' }, { status: 502 })
  }
}
