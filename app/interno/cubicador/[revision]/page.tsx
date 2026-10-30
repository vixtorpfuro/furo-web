import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { leerRevision, UUID } from '@/lib/cubicador/datos'
import InternoHeader from '../../InternoHeader'
import TablaPartidas from './TablaPartidas'

export const metadata: Metadata = {
  title: 'Revisión — Cubicador FURŌ',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const C = { dark: '#141210', muted: '#8a8278' }

export default async function RevisionPage({ params }: { params: Promise<{ revision: string }> }) {
  const { revision: id } = await params
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect(`/interno/login?next=/interno/cubicador/${encodeURIComponent(id)}`)
  if (!UUID.test(id)) notFound()

  const datos = await leerRevision(id)
  if (!datos) notFound()
  const { revision, proyecto, resumen, partidas } = datos

  return (
    <main style={{ backgroundColor: '#efece5', color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '32px 20px 60px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <Link href="/interno/cubicador" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>← Cubicador</Link>
        <p style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, margin: '18px 0 4px' }}>
          {proyecto.nombre}{proyecto.cliente ? ` · ${proyecto.cliente}` : ''}
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 400, margin: '0 0 6px' }}>Revisión {revision.etiqueta}</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>
          {revision.archivoNombre} · {resumen.unidades ?? 'unidades desconocidas'} · subida por {revision.creadoPor} el{' '}
          {new Date(revision.creadoEn).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>

        {revision.estado === 'error' && (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{revision.error}</p>
          </div>
        )}

        {(resumen.vistas?.length || resumen.avisos?.length) ? (
          <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            {resumen.vistas?.length ? (
              <p style={{ margin: 0 }}>
                <span style={{ color: C.muted }}>Vistas leídas: </span>
                {resumen.vistas.map(v => v.titulo.split('—')[0].split('·')[0].trim()).join(' · ')}
              </p>
            ) : null}
            {resumen.avisos?.map(a => <p key={a} style={{ margin: 0, color: '#b26a00' }}>⚠ {a}</p>)}
          </div>
        ) : null}

        <TablaPartidas partidas={partidas} titulo={`${proyecto.nombre} ${revision.etiqueta}`} />
      </div>
    </main>
  )
}
