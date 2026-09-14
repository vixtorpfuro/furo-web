import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

export const COOKIE_SESION_INTERNO = 'furo_interno_auth'

export type SesionInterno = {
  email: string
  nombre: string
  mondayPersonId: string
}

function getSecret() {
  const secret = process.env.LEAD_FORM_SESSION_SECRET
  if (!secret) throw new Error('Falta configurar LEAD_FORM_SESSION_SECRET en el servidor.')
  return new TextEncoder().encode(secret)
}

export async function crearSesionInterno(usuario: SesionInterno) {
  const token = await new SignJWT(usuario)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_SESION_INTERNO, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function cerrarSesionInterno() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_SESION_INTERNO)
}

export async function obtenerSesionInterno(): Promise<SesionInterno | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_SESION_INTERNO)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.email !== 'string' || typeof payload.nombre !== 'string') return null
    return {
      email: payload.email,
      nombre: payload.nombre,
      mondayPersonId: typeof payload.mondayPersonId === 'string' ? payload.mondayPersonId : '',
    }
  } catch {
    return null
  }
}
