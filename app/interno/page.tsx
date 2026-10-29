import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import InternoHeader from './InternoHeader'

export const metadata: Metadata = {
  title: 'Interno FURŌ',
  robots: { index: false, follow: false },
}

const C = { dark: '#141210', off: '#f5f3ee', muted: '#8a8278', border: 'rgba(20,18,16,0.12)' }

type Acceso = { href: string; titulo: string; detalle: string; color: string; html?: boolean }

const PRINCIPALES: Acceso[] = [
  { href: '/interno/nuevo-lead', titulo: 'Formulario de proyecto', detalle: 'Primera reunión o nuevo lead: datos del cliente, notas, próximos pasos y antecedentes a Drive.', color: '#f2b597' },
  { href: '/interno/comercial', titulo: 'Planificación comercial', detalle: 'Board de proyectos en etapa comercial: mes de montaje e hitos de noviembre a junio.', color: '#c9c3e0' },
]

const OTROS: Acceso[] = [
  { href: '/interno/leads', titulo: 'Mis leads', detalle: 'Leads de Monday asignados a ti.', color: '#e6cfa6' },
  // El cotizador es HTML servido por un route handler: va con <a>, no con <Link>.
  { href: '/interno/cotizador', titulo: 'Cotizador obra gruesa', detalle: 'Cotizador V3 por volúmenes.', color: '#cdc7bf', html: true },
  { href: '/interno/planificacion', titulo: 'Planificación de fábrica', detalle: 'Fechas calculadas desde Monday: modelación, madera, fábrica y montaje.', color: '#bccbe0' },
]

function Tarjeta({ a, grande }: { a: Acceso; grande?: boolean }) {
  const estilo: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14, textDecoration: 'none', color: C.dark,
    background: '#fff', borderRadius: 12, padding: grande ? '26px 26px 22px' : '18px 20px', minHeight: grande ? 190 : 0,
    borderTop: `6px solid ${a.color}`,
  }
  const contenido = (
    <>
      <div>
        <div style={{ fontSize: grande ? 22 : 16, fontWeight: 400 }}>{a.titulo}</div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: '8px 0 0' }}>{a.detalle}</p>
      </div>
      <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Abrir →</span>
    </>
  )
  return a.html ? <a href={a.href} style={estilo}>{contenido}</a> : <Link href={a.href} style={estilo}>{contenido}</Link>
}

export default async function InternoHome() {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect('/interno/login?next=/interno')

  return (
    <main style={{ backgroundColor: '#efece5', color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '48px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />
        <p style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, margin: '8px 0 4px' }}>Interno FURŌ</p>
        <h1 style={{ fontSize: 34, fontWeight: 400, margin: '0 0 28px' }}>Hola, {sesion.nombre.split(' ')[0]}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {PRINCIPALES.map(a => <Tarjeta key={a.href} a={a} grande />)}
        </div>

        <h2 style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, fontWeight: 500, margin: '34px 0 12px' }}>Otras herramientas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {OTROS.map(a => <Tarjeta key={a.href} a={a} />)}
        </div>
      </div>
    </main>
  )
}
