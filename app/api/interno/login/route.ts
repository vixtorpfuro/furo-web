import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { writeClient } from '@/sanity/lib/writeClient'
import { crearSesionInterno } from '@/lib/interno/sesion'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son obligatorios.' }, { status: 400 })
  }

  const usuario = await writeClient.fetch(
    `*[_type == "usuarioInterno" && email == $email && activo == true][0]{ nombre, email, passwordHash, mondayPersonId }`,
    { email: String(email).trim().toLowerCase() }
  )

  if (!usuario) {
    return NextResponse.json({ error: 'Email o contraseña incorrectos.' }, { status: 401 })
  }

  const valido = await bcrypt.compare(password, usuario.passwordHash)
  if (!valido) {
    return NextResponse.json({ error: 'Email o contraseña incorrectos.' }, { status: 401 })
  }

  await crearSesionInterno({
    email: usuario.email,
    nombre: usuario.nombre,
    mondayPersonId: usuario.mondayPersonId || '',
  })

  return NextResponse.json({ ok: true, nombre: usuario.nombre })
}
