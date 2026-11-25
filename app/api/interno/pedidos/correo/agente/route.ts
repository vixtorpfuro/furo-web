import { NextResponse } from 'next/server'
import { conversacion, borradoresPara, guardarBorrador } from '@/lib/pedidos/gmail'
import { analizarPedido, conFirma } from '@/lib/pedidos/agente'
import { exigirSesion, leadPorEmail, error } from '@/lib/pedidos/acceso'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

// El agente analiza el pedido y deja (o actualiza) un borrador en Gmail. No envía nada.
export async function POST(req: Request) {
  const noAuth = await exigirSesion()
  if (noAuth) return noAuth
  try {
    const { email } = (await req.json()) as { email?: string }
    const lead = await leadPorEmail(email ?? '')
    if (!lead) return NextResponse.json({ error: 'Ese correo no corresponde a un lead.' }, { status: 404 })

    const [hilo, borradores] = await Promise.all([conversacion(lead.email), borradoresPara(lead.email)])
    const analisis = await analizarPedido(lead, hilo)

    let borrador = borradores[0] ?? null
    if (analisis.debe_escribir && analisis.correo_cuerpo.trim()) {
      const ultimoHilo = hilo.at(-1)?.threadId
      const g = await guardarBorrador(lead.email, analisis.correo_asunto || 'Tu proyecto Noki — FURŌ', conFirma(analisis.correo_cuerpo), ultimoHilo, borrador?.id)
      borrador = { id: g.id, threadId: g.threadId, para: lead.email, asunto: g.asunto, cuerpo: conFirma(analisis.correo_cuerpo) }
    }
    return NextResponse.json({ analisis, borrador })
  } catch (e) {
    return error(e)
  }
}
