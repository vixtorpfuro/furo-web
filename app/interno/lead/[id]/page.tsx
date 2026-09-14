import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { getLead } from '@/lib/interno/monday'
import { extraeFolderIdDeUrl, listarArchivosDeCarpeta } from '@/lib/interno/drive'
import InternoHeader from '../../InternoHeader'
import AdjuntarArchivos from './AdjuntarArchivos'

export const metadata: Metadata = {
  title: 'Lead — Interno FURŌ',
  robots: { index: false, follow: false },
}

const C = { dark: '#141210', off: '#f5f3ee', muted: '#8a8278', border: 'rgba(20,18,16,0.12)', purpleMid: '#52448a' }

const CAMPOS: { id: string; label: string }[] = [
  { id: 'lead_email', label: 'Email' },
  { id: 'lead_phone', label: 'Teléfono' },
  { id: 'text_mm6dfaa0', label: 'Empresa' },
  { id: 'text_mktk4r1f', label: 'Soy' },
  { id: 'text_mktkqpnz', label: '¿Cuándo quiere comenzar?' },
  { id: 'color_mkv0rxyx', label: '¿Cómo contactar?' },
  { id: 'dropdown_mkswtre', label: '¿Cómo supo de nosotros?' },
  { id: 'dropdown_mm6dj0qt', label: 'Tipo de proyecto' },
  { id: 'dropdown_mm6dkdz7', label: 'Servicio FURŌ' },
  { id: 'color_mm6dxxhe', label: 'Segmento' },
  { id: 'numeric_mm6defes', label: 'M²' },
  { id: 'location_mm6dmm5p', label: 'Ubicación' },
]

export default async function LeadDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) redirect(`/interno/login`)

  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()

  const folderId = lead.carpetaDrive ? extraeFolderIdDeUrl(lead.carpetaDrive) : null
  let archivos: Awaited<ReturnType<typeof listarArchivosDeCarpeta>> = []
  let errorDrive = ''
  if (folderId) {
    try {
      archivos = await listarArchivosDeCarpeta(folderId)
    } catch (e) {
      errorDrive = e instanceof Error ? e.message : 'No se pudieron cargar los archivos de Drive.'
    }
  }

  const comentarios = lead.columnValues['long_text_mm6d9214'] || ''

  return (
    <main style={{ backgroundColor: C.off, color: C.dark, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', padding: '48px 20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap'); *{box-sizing:border-box;}`}</style>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <InternoHeader nombre={sesion.nombre} />

        <Link href="/interno" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>← Mis leads</Link>
        <h1 style={{ fontSize: 26, fontWeight: 400, margin: '12px 0 4px' }}>{lead.nombre}</h1>
        {lead.estado && <p style={{ fontSize: 13, color: C.purpleMid, marginBottom: 28 }}>{lead.estado}</p>}

        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {CAMPOS.filter(c => lead.columnValues[c.id]).map(c => (
              <div key={c.id}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', color: C.muted, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 14 }}>{lead.columnValues[c.id]}</div>
              </div>
            ))}
          </div>
          {comentarios && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', color: C.muted, marginBottom: 6 }}>Notas / reunión</div>
              <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{comentarios}</div>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Antecedentes (Drive)</h2>
            {lead.carpetaDrive && (
              <a href={lead.carpetaDrive} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.purpleMid }}>
                Abrir carpeta ↗
              </a>
            )}
          </div>

          {!lead.carpetaDrive && <p style={{ fontSize: 13, color: C.muted }}>Este lead no tiene carpeta de Drive asociada.</p>}
          {errorDrive && <p style={{ fontSize: 13, color: '#c0392b' }}>{errorDrive}</p>}

          {archivos.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              {archivos.map(a => (
                <li key={a.id} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                  <a href={a.webViewLink || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.dark, textDecoration: 'none' }}>
                    {a.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {folderId && archivos.length === 0 && !errorDrive && (
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Sin archivos todavía.</p>
          )}

          {folderId && (
            <>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                Si la reunión fue online y grabaste con Gemini, súbela aquí (o arrástrala directo a la carpeta de Drive desde "Mi unidad › Grabaciones de Meet").
              </p>
              <AdjuntarArchivos leadId={lead.id} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
