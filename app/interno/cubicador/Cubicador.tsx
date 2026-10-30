'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ProyectoCub } from '@/lib/cubicador/datos'

const C = { dark: '#141210', muted: '#8a8278', purple: '#3a2d5e', border: 'rgba(20,18,16,0.12)' }
const input: React.CSSProperties = { font: 'inherit', fontSize: 14, padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff' }
const boton: React.CSSProperties = { font: 'inherit', fontSize: 13, padding: '8px 14px', border: 0, borderRadius: 6, background: C.purple, color: '#fff', cursor: 'pointer' }

const ESTADO = { lista: '#2f7d4f', procesando: '#c99a5b', error: '#c0392b' } as const

export default function Cubicador({ proyectos, urlServicio, token }: { proyectos: ProyectoCub[]; urlServicio: string; token: string }) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [cliente, setCliente] = useState('')
  const [error, setError] = useState('')
  const [creando, setCreando] = useState(false)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setCreando(true)
    setError('')
    const res = await fetch('/api/interno/cubicador/proyectos', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nombre, cliente }),
    }).catch(() => null)
    const datos = await res?.json().catch(() => null)
    setCreando(false)
    if (!res?.ok) return setError(datos?.error ?? 'No se pudo crear el proyecto.')
    setNombre('')
    setCliente('')
    router.refresh()
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form onSubmit={crear} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: '#fff', borderRadius: 10, padding: 16 }}>
        <strong style={{ fontSize: 14, fontWeight: 500, marginRight: 8 }}>Nuevo proyecto</strong>
        <input style={{ ...input, flex: '1 1 220px' }} placeholder="Nombre, p. ej. Quincho Puerto Laurel" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input style={{ ...input, flex: '1 1 160px' }} placeholder="Cliente (opcional)" value={cliente} onChange={e => setCliente(e.target.value)} />
        <button style={boton} disabled={creando}>{creando ? 'Creando…' : 'Crear'}</button>
        {error && <p style={{ flexBasis: '100%', color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
      </form>

      {proyectos.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>Todavía no hay proyectos. Crea uno y sube su DXF.</p>}

      {proyectos.map(p => (
        <section key={p.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>{p.nombre}</h2>
            {p.cliente && <span style={{ fontSize: 13, color: C.muted }}>{p.cliente}</span>}
          </div>
          {p.revisiones.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: 6 }}>
              {p.revisiones.map(r => (
                <li key={r.id} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 14, flexWrap: 'wrap' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: ESTADO[r.estado], display: 'inline-block' }} />
                  <Link href={`/interno/cubicador/${r.id}`} style={{ color: C.dark, fontWeight: 500 }}>{r.etiqueta}</Link>
                  <span style={{ color: C.muted }}>{r.archivoNombre}</span>
                  <span style={{ color: C.muted }}>{r.estado === 'error' ? r.error : `${r.partidas} partidas`}</span>
                  <span style={{ color: C.muted, marginLeft: 'auto', fontSize: 12 }}>
                    {r.creadoPor} · {new Date(r.creadoEn).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Subida proyectoId={p.id} urlServicio={urlServicio} token={token} siguiente={`R${String(p.revisiones.length + 1).padStart(2, '0')}`} />
        </section>
      ))}
    </div>
  )
}

function Subida({ proyectoId, urlServicio, token, siguiente }: { proyectoId: string; urlServicio: string; token: string; siguiente: string }) {
  const router = useRouter()
  const [etiqueta, setEtiqueta] = useState(siguiente)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [estado, setEstado] = useState<'' | 'subiendo'>('')
  const [error, setError] = useState('')

  async function subir(e: React.FormEvent) {
    e.preventDefault()
    if (!archivo) return
    setEstado('subiendo')
    setError('')
    const form = new FormData()
    form.append('proyecto_id', proyectoId)
    form.append('etiqueta', etiqueta)
    form.append('archivo', archivo)
    const res = await fetch(`${urlServicio}/revisiones`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }).catch(() => null)
    const datos = await res?.json().catch(() => null)
    setEstado('')
    if (!res) return setError('No se pudo conectar con el servicio de cubicación.')
    if (!res.ok) {
      router.refresh()
      return setError(typeof datos?.detail === 'string' ? datos.detail : 'No se pudo procesar el plano.')
    }
    router.push(`/interno/cubicador/${datos.id}`)
  }

  return (
    <form onSubmit={subir} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.muted }}>Subir revisión</span>
      <input style={{ ...input, width: 80 }} value={etiqueta} onChange={e => setEtiqueta(e.target.value)} aria-label="Etiqueta de la revisión" required />
      <input type="file" accept=".dxf" onChange={e => setArchivo(e.target.files?.[0] ?? null)} style={{ fontSize: 13 }} aria-label="Archivo DXF" />
      <button style={{ ...boton, opacity: archivo ? 1 : 0.5 }} disabled={!archivo || estado === 'subiendo'}>
        {estado === 'subiendo' ? 'Leyendo plano…' : 'Cubicar'}
      </button>
      {error && <p style={{ flexBasis: '100%', color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
    </form>
  )
}
