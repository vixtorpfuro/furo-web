import { NextResponse } from 'next/server'
import { cerrarSesionInterno } from '@/lib/interno/sesion'

export async function POST() {
  await cerrarSesionInterno()
  return NextResponse.json({ ok: true })
}
