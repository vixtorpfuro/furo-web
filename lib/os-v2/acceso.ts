import 'server-only'

// FURŌ OS v2 está en prueba: solo lo ven los usuarios de esta lista (el resto del interno no
// ve la tarjeta ni puede abrir las rutas ni la API de Pedidos). Se puede cambiar sin tocar
// código con OS_V2_USUARIOS="correo1,correo2" en Vercel.
const POR_DEFECTO = ['vpellegrini@furo.company']

export function puedeVerOsV2(email: string | undefined | null) {
  if (!email) return false
  const lista = (process.env.OS_V2_USUARIOS || POR_DEFECTO.join(','))
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  return lista.includes(email.trim().toLowerCase())
}
