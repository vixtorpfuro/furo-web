import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { getMisLeads } from '@/lib/interno/monday'
import InternoHeader from './InternoHeader'

export const metadata: Metadata = {
  title: 'Mis leads — Interno FURŌ',
  robots: { index: false, follow: false },
}

const C = { dark: '#141210', off: '#f5f3ee', muted: '#8a8278', border: 'rgba(20,18,16,0.12)', purpleMid: '#52448a' }

export default async function InternoDashboard() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno')

  let leads: Awaited<ReturnType<typeof getMisLeads>> = []
  let error = ''
  try {
    leads = await getMisLeads(sesion.mondayPersonId)
  } catch (e) {
    error = e instanceof Error ? e.message : 'No se pudieron cargar tus leads.'
  }

  return (
    <main style={{ backgroundColor: C.off, color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '48px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 400, margin: 0 }}>Mis leads</h1>
          <Link href="/interno/nuevo-lead" style={{ background: C.dark, color: '#fff', padding: '12px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none' }}>
            + Nuevo lead
          </Link>
        </div>

        {error && (
          <div style={{ padding: '16px 18px', background: '#fdf0f0', borderLeft: '3px solid #e05252', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: '#c0392b', margin: 0 }}>{error}</p>
          </div>
        )}

        {!error && leads.length === 0 && (
          <p style={{ fontSize: 14, color: C.muted }}>Todavía no tienes leads cargados.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leads.map(lead => (
            <Link key={lead.id} href={`/interno/lead/${lead.id}`} style={{ display: 'block', padding: '16px 20px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, textDecoration: 'none', color: C.dark }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 15, fontWeight: 500 }}>{lead.nombre}</strong>
                <span style={{ fontSize: 12, color: C.muted }}>{new Date(lead.createdAt).toLocaleDateString('es-CL')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                {lead.estado && <span style={{ fontSize: 12, color: C.purpleMid }}>{lead.estado}</span>}
                {lead.carpetaDrive && <span style={{ fontSize: 12, color: C.muted }}>· Carpeta Drive ✓</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
