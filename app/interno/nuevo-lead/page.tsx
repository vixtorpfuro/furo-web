import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import InternoHeader from '../InternoHeader'
import LeadForm from './LeadForm'

export const metadata: Metadata = {
  title: 'Nuevo lead — Interno FURŌ',
  robots: { index: false, follow: false },
}

export default async function NuevoLeadPage() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno/nuevo-lead')

  return (
    <main style={{ backgroundColor: '#f5f3ee', color: '#141210', fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '48px 20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        *{box-sizing:border-box;}
        input:focus,select:focus,textarea:focus{border-color:#52448a !important;}
        input::placeholder,textarea::placeholder{color:#c8c4bc;}
      `}</style>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <LeadForm />
      </div>
    </main>
  )
}
