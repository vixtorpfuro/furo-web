import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { leerIndicadores, listarProyectos } from '@/lib/comercial/datos'
import { INDICADORES_BASE } from '@/lib/comercial/modelo'
import { PROYECTOS_SEMILLA } from '@/lib/comercial/semilla'
import InternoHeader from '../InternoHeader'
import BoardComercial from './BoardComercial'

export const metadata: Metadata = {
  title: 'Planificación comercial — Interno FURŌ',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const C = { dark: '#141210', off: '#f5f3ee', muted: '#8a8278' }

export default async function PlanificacionComercialPage() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno/comercial')

  let proyectos: Awaited<ReturnType<typeof listarProyectos>> = []
  let indicadores = INDICADORES_BASE
  let error = ''
  try {
    ;[proyectos, indicadores] = await Promise.all([listarProyectos(), leerIndicadores()])
  } catch (e) {
    error = e instanceof Error ? e.message : 'No se pudo cargar el board.'
  }

  return (
    <main style={{ backgroundColor: '#efece5', color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '32px 20px 60px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <Link href="/interno" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>← Interno</Link>
        <p style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, margin: '18px 0 4px' }}>Planificación comercial</p>
        <h1 style={{ fontSize: 34, fontWeight: 400, margin: '0 0 22px' }}>Proyectos en etapa comercial</h1>
        {error ? (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252' }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <BoardComercial proyectos={proyectos} indicadores={indicadores} hoy={new Date().toISOString().slice(0, 10)} totalSemilla={PROYECTOS_SEMILLA.length} />
        )}
      </div>
    </main>
  )
}
