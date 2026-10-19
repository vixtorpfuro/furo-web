import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { obtenerPlanificacion } from '@/lib/planificacion/datos'
import { aIso } from '@/lib/planificacion/calculo'
import InternoHeader from '../InternoHeader'
import Planificador from './Planificador'

export const metadata: Metadata = {
  title: 'Planificación — Interno FURŌ',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const C = { dark: '#141210', off: '#f5f3ee', muted: '#8a8278' }

export default async function PlanificacionPage() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno/planificacion')

  let proyectos: Awaited<ReturnType<typeof obtenerPlanificacion>> = []
  let error = ''
  try {
    proyectos = await obtenerPlanificacion()
  } catch (e) {
    error = e instanceof Error ? e.message : 'No se pudo cargar la planificación.'
  }

  return (
    <main style={{ backgroundColor: C.off, color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '32px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <Link href="/interno" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>← Interno</Link>
            <h1 style={{ fontSize: 26, fontWeight: 400, margin: '6px 0 0' }}>Planificación de proyectos</h1>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, maxWidth: 520 }}>
            Proyectos de Monday en espera de presupuesto o con presupuesto entregado. Las fechas se calculan hacia atrás desde el inicio de montaje objetivo.
          </p>
        </div>
        {error ? (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252' }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <Planificador proyectos={proyectos} hoy={aIso(new Date())} />
        )}
      </div>
    </main>
  )
}
