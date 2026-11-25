import { servirOsV2 } from '@/lib/os-v2/servir'

// FURŌ OS v2: portada + secciones (mockup navegable, solo con sesión interna).
export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  return servirOsV2(req, 'os.dc.html', 'FURŌ OS v2', '/interno/os-v2')
}
