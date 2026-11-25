import { NextResponse } from 'next/server'
import { listarLeads, conversacion, borradoresPara, casilla } from '@/lib/pedidos/gmail'
import { exigirSesion, leadPorEmail, error } from '@/lib/pedidos/acceso'

export const dynamic = 'force-dynamic'

// Sin ?email: lista de leads de Noki. Con ?email: hilo de correo y borrador pendiente de ese lead.
export async function GET(req: Request) {
  const noAuth = await exigirSesion()
  if (noAuth) return noAuth
  try {
    const email = new URL(req.url).searchParams.get('email')
    if (!email) return NextResponse.json({ casilla: casilla(), leads: await listarLeads() })
    const lead = await leadPorEmail(email)
    if (!lead) return NextResponse.json({ error: 'Ese correo no corresponde a un lead.' }, { status: 404 })
    const [hilo, borradores] = await Promise.all([conversacion(lead.email), borradoresPara(lead.email)])
    return NextResponse.json({ lead, hilo, borrador: borradores[0] ?? null })
  } catch (e) {
    return error(e)
  }
}
