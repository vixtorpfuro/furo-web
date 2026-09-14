import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { getLead } from '@/lib/interno/monday'
import { extraeFolderIdDeUrl, subirArchivoACarpeta } from '@/lib/interno/drive'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  }

  const { id } = await params
  const lead = await getLead(id)
  if (!lead || !lead.carpetaDrive) {
    return NextResponse.json({ error: 'Este lead no tiene una carpeta de Drive asociada.' }, { status: 404 })
  }

  const folderId = extraeFolderIdDeUrl(lead.carpetaDrive)
  if (!folderId) {
    return NextResponse.json({ error: 'No se pudo determinar la carpeta de Drive del lead.' }, { status: 500 })
  }

  const form = await req.formData()
  const archivos = form.getAll('archivos').filter((a): a is File => a instanceof File && a.size > 0)
  if (!archivos.length) {
    return NextResponse.json({ error: 'Selecciona al menos un archivo.' }, { status: 400 })
  }

  const subidos = []
  for (const archivo of archivos) {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const res = await subirArchivoACarpeta(folderId, archivo.name, archivo.type || 'application/octet-stream', buffer)
    subidos.push(res)
  }

  return NextResponse.json({ ok: true, subidos })
}
