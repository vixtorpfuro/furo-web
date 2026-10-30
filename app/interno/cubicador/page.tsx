import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { listarProyectos, type ProyectoCub } from '@/lib/cubicador/datos'
import { tokenSubida, urlCubicador } from '@/lib/cubicador/token'
import InternoHeader from '../InternoHeader'
import Cubicador from './Cubicador'

export const metadata: Metadata = {
  title: 'Cubicador — Interno FURŌ',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const C = { dark: '#141210', muted: '#8a8278' }

export default async function CubicadorPage() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno/cubicador')

  let proyectos: ProyectoCub[] = []
  let subida = { url: '', token: '' }
  let error = ''
  try {
    ;[proyectos, subida.url, subida.token] = await Promise.all([listarProyectos(), urlCubicador(), tokenSubida(sesion)])
  } catch (e) {
    error = e instanceof Error ? e.message : 'No se pudo cargar el cubicador.'
    subida = { url: '', token: '' }
  }

  return (
    <main style={{ backgroundColor: '#efece5', color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '32px 20px 60px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <Link href="/interno" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>← Interno</Link>
        <p style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, margin: '18px 0 4px' }}>Cubicador</p>
        <h1 style={{ fontSize: 34, fontWeight: 400, margin: '0 0 8px' }}>Cubicación desde planos</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 24px', maxWidth: 720, lineHeight: 1.5 }}>
          Sube el DXF de plantas y elevaciones. El cubicador propone superficies, fachadas, vanos, cubierta y muros; revisa
          cada partida y corrige lo que haga falta. Cada archivo queda como una revisión del proyecto.
        </p>
        {error ? (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252' }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <Cubicador proyectos={proyectos} urlServicio={subida.url} token={subida.token} />
        )}
      </div>
    </main>
  )
}
