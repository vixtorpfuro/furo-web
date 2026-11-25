import { servirOsV2 } from '@/lib/os-v2/servir'

// Formulario por servicio + WhatsApp del mockup FURŌ OS v2 (solo con sesión interna).
export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  return servirOsV2(req, 'formulario.dc.html', 'Formulario — FURŌ OS v2', '/interno/os-v2/formulario')
}
