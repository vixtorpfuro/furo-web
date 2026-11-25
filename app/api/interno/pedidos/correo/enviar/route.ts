import { NextResponse } from 'next/server'
import { obtenerBorrador, guardarBorrador, enviarBorrador } from '@/lib/pedidos/gmail'
import { exigirSesion, leadPorEmail, error } from '@/lib/pedidos/acceso'

export const dynamic = 'force-dynamic'

// Envía un borrador aprobado por una persona. Si se editó el texto, primero actualiza el borrador.
export async function POST(req: Request) {
  const noAuth = await exigirSesion()
  if (noAuth) return noAuth
  try {
    const { draftId, cuerpo } = (await req.json()) as { draftId?: string; cuerpo?: string }
    const borrador = draftId ? await obtenerBorrador(draftId) : null
    if (!borrador) return NextResponse.json({ error: 'No se encontró el borrador.' }, { status: 404 })
    // Solo borradores dirigidos a un lead de Noki.
    if (!(await leadPorEmail(borrador.para))) return NextResponse.json({ error: 'El borrador no es para un lead.' }, { status: 403 })

    let id = borrador.id
    if (typeof cuerpo === 'string' && cuerpo.trim() && cuerpo.trim() !== borrador.cuerpo.trim()) {
      id = (await guardarBorrador(borrador.para, borrador.asunto, cuerpo.trim(), borrador.threadId || undefined, borrador.id)).id
    }
    const enviado = await enviarBorrador(id)
    return NextResponse.json({ ok: true, enviado })
  } catch (e) {
    return error(e)
  }
}
