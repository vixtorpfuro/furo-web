import 'server-only'

// Las APIs usan la cookie de sesión (sameSite=lax). Exigir JSON y mismo origen evita que otro
// sitio dispare envíos con un formulario.
export function solicitudMismoOrigen(req: Request): boolean {
  if (!req.headers.get('content-type')?.includes('application/json')) return false
  const origen = req.headers.get('origin')
  return !origen || origen === new URL(req.url).origin
}
