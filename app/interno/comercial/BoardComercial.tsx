'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  HITOS, RANGO_EDICION, RANGO_VISIBLE, SEMANAS_POR_MES, TIPOS_PROYECTO,
  columnasHito, mesesEntre, mesMontaje, nombreMes, nuevaClave, semanaDeDia, textoPeriodo,
  type Hito, type ProyectoComercial, type TipoHito, type TipoProyecto,
} from '@/lib/comercial/modelo'

const C = { dark: '#141210', off: '#f5f3ee', fondo: '#efece5', muted: '#8a8278', linea: 'rgba(20,18,16,0.10)', purpleMid: '#52448a', rojo: '#c0392b' }

type Vista = 'meses' | 'semanas'
const ANCHO_COL = { meses: 132, semanas: 46 }
const ANCHO_BANDA = 34
const ANCHO_NOMBRE = 230
const ALTO_PILDORA = 26
const ORDEN_TIPOS = Object.keys(TIPOS_PROYECTO) as TipoProyecto[]

type Edicion = { proyecto: ProyectoComercial | null; enfocarHito?: string; hitoNuevo?: Hito }

// Reparte los hitos en carriles para que no se tapen entre sí dentro de una fila.
function carriles(hitos: Hito[], meses: string[], vista: Vista) {
  const items = hitos
    .map(h => ({ h, pos: columnasHito(h, meses, vista) }))
    .filter((x): x is { h: Hito; pos: NonNullable<ReturnType<typeof columnasHito>> } => !!x.pos)
    .sort((a, b) => a.pos.inicio - b.pos.inicio || b.pos.fin - a.pos.fin)
  const finCarril: number[] = []
  const res = items.map(it => {
    let c = finCarril.findIndex(fin => fin < it.pos.inicio)
    if (c === -1) { c = finCarril.length; finCarril.push(it.pos.fin) } else finCarril[c] = it.pos.fin
    return { ...it, carril: c }
  })
  return { items: res, n: Math.max(1, finCarril.length) }
}

export default function BoardComercial({ proyectos, hoy, totalSemilla }: { proyectos: ProyectoComercial[]; hoy: string; totalSemilla: number }) {
  const router = useRouter()
  const [vista, setVista] = useState<Vista>('meses')
  const [tiposVisibles, setTiposVisibles] = useState<Set<TipoProyecto>>(new Set(ORDEN_TIPOS))
  const [buscar, setBuscar] = useState('')
  const [edicion, setEdicion] = useState<Edicion | null>(null)
  const [cargando, setCargando] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const mesAEnfocar = useRef<string | null>(null)

  const meses = useMemo(() => mesesEntre(RANGO_VISIBLE.desde, RANGO_VISIBLE.hasta), [])
  const porMes = vista === 'semanas' ? SEMANAS_POR_MES : 1
  const col = ANCHO_COL[vista]
  const anchoGrilla = meses.length * porMes * col

  // Al pasar a semanas desde un mes, lo dejamos a la vista.
  useEffect(() => {
    const mes = mesAEnfocar.current
    if (vista === 'semanas' && mes && scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, meses.indexOf(mes) * SEMANAS_POR_MES * col - 20)
      mesAEnfocar.current = null
    }
  }, [vista, meses, col])

  const mesHoy = hoy.slice(0, 7)
  const xHoy = meses.includes(mesHoy)
    ? (meses.indexOf(mesHoy) + (Number(hoy.slice(8, 10)) - 1) / 31) * porMes * col
    : null

  const filtrados = proyectos.filter(p =>
    tiposVisibles.has(p.tipo) &&
    (!buscar.trim() || `${p.nombre} ${p.cliente}`.toLowerCase().includes(buscar.trim().toLowerCase()))
  )
  const grupos = ORDEN_TIPOS
    .map(tipo => ({
      tipo,
      filas: filtrados
        .filter(p => p.tipo === tipo)
        .sort((a, b) => (mesMontaje(a) || '9999').localeCompare(mesMontaje(b) || '9999') || a.nombre.localeCompare(b.nombre)),
    }))
    .filter(g => g.filas.length)

  // Montajes por columna, para ver cómo se carga cada mes/semana.
  const montajes = useMemo(() => {
    const total = meses.length * porMes
    const cuenta = Array.from({ length: total }, () => ({ n: 0, m2: 0 }))
    for (const p of filtrados) {
      for (const h of p.hitos.filter(x => x.tipo === 'montaje')) {
        const pos = columnasHito(h, meses, vista)
        if (!pos) continue
        for (let i = pos.inicio; i <= pos.fin; i++) { cuenta[i].n++; cuenta[i].m2 += p.m2 || 0 }
      }
    }
    return cuenta
  }, [filtrados, meses, vista, porMes])

  const sinMontaje = filtrados.filter(p => !mesMontaje(p)).length

  const cargarSemilla = async () => {
    setCargando(true)
    setErrorCarga('')
    try {
      const res = await fetch('/api/interno/comercial/semilla', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || `Error ${res.status}`)
      router.refresh()
    } catch (e) {
      setErrorCarga(e instanceof Error ? e.message : 'No se pudo cargar.')
    } finally {
      setCargando(false)
    }
  }

  const abrirCelda = (p: ProyectoComercial, columna: number) => {
    const mes = meses[Math.floor(columna / porMes)]
    const semana = vista === 'semanas' ? (columna % porMes) + 1 : null
    const tipo: TipoHito = p.hitos.some(h => h.tipo === 'montaje') ? 'fabrica' : 'montaje'
    setEdicion({ proyecto: p, hitoNuevo: { _key: nuevaClave(), tipo, desde: mes, semanaDesde: semana, hecho: false } })
  }

  const toggleTipo = (t: TipoProyecto) => setTiposVisibles(prev => {
    const s = new Set(prev)
    if (s.has(t)) s.delete(t); else s.add(t)
    return s.size ? s : new Set(ORDEN_TIPOS)
  })

  if (proyectos.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', maxWidth: 620 }}>
        <h2 style={{ fontSize: 20, fontWeight: 400, margin: '0 0 8px' }}>El board está vacío</h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: '0 0 18px' }}>
          Puedes cargar la cartera actual: {totalSemilla} proyectos del cuadro del 29-10-2026 con los meses de fábrica y montaje de tu croquera.
          Los hitos con lectura dudosa quedan marcados con la nota “Croquera, revisar”. Después todo se edita a mano.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={cargarSemilla} disabled={cargando} style={botonPrimario}>{cargando ? 'Cargando…' : `Cargar ${totalSemilla} proyectos`}</button>
          <button onClick={() => setEdicion({ proyecto: null })} style={botonSecundario}>Empezar con un proyecto nuevo</button>
        </div>
        {errorCarga && <p style={{ color: C.rojo, fontSize: 13, marginTop: 12 }}>{errorCarga}</p>}
        {edicion && <Editor edicion={edicion} meses={meses} onCerrar={() => setEdicion(null)} />}
      </div>
    )
  }

  return (
    <div>
      {/* Barra de herramientas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button onClick={() => setEdicion({ proyecto: null })} style={botonPrimario}>+ Proyecto</button>
        <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 999, padding: 3, border: `1px solid ${C.linea}` }}>
          {(['meses', 'semanas'] as Vista[]).map(v => (
            <button key={v} onClick={() => setVista(v)} style={{
              border: 'none', borderRadius: 999, padding: '7px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              background: vista === v ? C.dark : 'transparent', color: vista === v ? '#fff' : C.dark,
            }}>{v === 'meses' ? 'Meses' : 'Semanas'}</button>
          ))}
        </div>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar proyecto o cliente" style={{ ...inputStyle, width: 220, borderRadius: 999 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ORDEN_TIPOS.map(t => {
            const activo = tiposVisibles.has(t)
            const n = proyectos.filter(p => p.tipo === t).length
            return (
              <button key={t} onClick={() => toggleTipo(t)} style={{
                border: `1px solid ${activo ? 'transparent' : C.linea}`, borderRadius: 999, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                background: activo ? TIPOS_PROYECTO[t].color : '#fff', color: C.dark, opacity: activo ? 1 : 0.55,
              }}>{TIPOS_PROYECTO[t].etiqueta} · {n}</button>
            )
          })}
        </div>
      </div>

      {/* Leyenda de hitos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11, color: C.muted, marginBottom: 12 }}>
        {(Object.keys(HITOS) as TipoHito[]).map(t => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 16, height: 9, borderRadius: 5, background: HITOS[t].fondo, border: t === 'otro' ? `1px solid ${C.linea}` : 'none' }} />
            {HITOS[t].etiqueta}
          </span>
        ))}
        <span>· Clic en una celda vacía para agregar un hito · Clic en un mes para verlo por semanas</span>
      </div>

      <div ref={scrollRef} style={{ overflowX: 'auto', paddingBottom: 6 }}>
        <div style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8 + anchoGrilla, position: 'relative' }}>
          {/* Encabezado */}
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 5, background: C.fondo, paddingBottom: 8 }}>
            <div style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8, flexShrink: 0, position: 'sticky', left: 0, background: C.fondo, zIndex: 6 }} />
            <div style={{ display: 'flex', gap: 0 }}>
              {meses.map(mes => (
                <div key={mes} style={{ width: porMes * col, flexShrink: 0, paddingRight: 4 }}>
                  <button
                    onClick={() => { if (vista === 'meses') { mesAEnfocar.current = mes; setVista('semanas') } else setVista('meses') }}
                    title={vista === 'meses' ? 'Ver por semanas' : 'Volver a meses'}
                    style={{
                      width: '100%', background: mes === mesHoy ? C.dark : '#fff', color: mes === mesHoy ? '#fff' : C.dark,
                      border: 'none', padding: '13px 4px', fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {vista === 'semanas' ? nombreMes(mes, true) : nombreMes(mes)}
                  </button>
                  {vista === 'semanas' && (
                    <div style={{ display: 'flex' }}>
                      {Array.from({ length: SEMANAS_POR_MES }, (_, s) => (
                        <div key={s} style={{ width: col, fontSize: 10, color: C.muted, textAlign: 'center', paddingTop: 4 }}>S{s + 1}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea de hoy */}
          {xHoy !== null && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: ANCHO_BANDA + ANCHO_NOMBRE + 8 + xHoy, width: 2, background: C.rojo, opacity: 0.35, zIndex: 1, pointerEvents: 'none' }} />
          )}

          {grupos.map(g => (
            <div key={g.tipo} style={{ display: 'flex', marginBottom: 10 }}>
              {/* Banda del grupo, como en la referencia */}
              <div style={{
                width: ANCHO_BANDA, flexShrink: 0, position: 'sticky', left: 0, zIndex: 3, background: TIPOS_PROYECTO[g.tipo].color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4,
              }}>
                <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '10px 0' }}>
                  {TIPOS_PROYECTO[g.tipo].etiqueta}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {g.filas.map(p => (
                  <Fila
                    key={p._id} p={p} meses={meses} vista={vista} col={col} anchoGrilla={anchoGrilla}
                    onEditar={enfocarHito => setEdicion({ proyecto: p, enfocarHito })}
                    onCelda={c => abrirCelda(p, c)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Montajes por columna */}
          <div style={{ display: 'flex', marginTop: 6, borderTop: `2px solid ${C.dark}`, paddingTop: 8 }}>
            <div style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8, flexShrink: 0, position: 'sticky', left: 0, background: C.fondo, zIndex: 3, fontSize: 12, paddingLeft: 4 }}>
              <strong style={{ fontWeight: 500 }}>Montajes</strong>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>proyectos · m² conocidos</div>
              {sinMontaje > 0 && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{sinMontaje} sin mes de montaje</div>}
            </div>
            <div style={{ display: 'flex' }}>
              {montajes.map((m, i) => (
                <div key={i} style={{ width: col, textAlign: 'center', fontSize: 11, color: m.n ? C.dark : C.muted, opacity: m.n ? 1 : 0.4 }}>
                  <div style={{ fontSize: vista === 'meses' ? 18 : 13 }}>{m.n}</div>
                  {vista === 'meses' && m.m2 > 0 && <div style={{ color: C.muted }}>{Math.round(m.m2).toLocaleString('es-CL')} m²</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {edicion && <Editor edicion={edicion} meses={meses} onCerrar={() => setEdicion(null)} />}
    </div>
  )
}

function Fila({ p, meses, vista, col, anchoGrilla, onEditar, onCelda }: {
  p: ProyectoComercial; meses: string[]; vista: Vista; col: number; anchoGrilla: number
  onEditar: (hito?: string) => void; onCelda: (columna: number) => void
}) {
  const { items, n } = carriles(p.hitos, meses, vista)
  const alto = Math.max(46, n * (ALTO_PILDORA + 6) + 14)
  const fuera = p.hitos.filter(h => !columnasHito(h, meses, vista))
  const porMes = vista === 'semanas' ? SEMANAS_POR_MES : 1
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, borderBottom: `1px solid ${C.linea}` }}>
      <button
        onClick={() => onEditar()}
        style={{
          width: ANCHO_NOMBRE, flexShrink: 0, position: 'sticky', left: ANCHO_BANDA + 4, zIndex: 2, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
          background: `color-mix(in srgb, ${TIPOS_PROYECTO[p.tipo].color} 55%, #fff)`, border: 'none', borderBottom: `3px solid ${C.fondo}`,
          padding: '8px 12px', marginRight: 4, color: C.dark,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.25 }}>{p.nombre}</div>
        <div style={{ fontSize: 11, color: '#5e574e', marginTop: 2 }}>
          {[p.cliente, p.m2 ? `${p.m2.toLocaleString('es-CL')} m²` : ''].filter(Boolean).join(' · ') || '—'}
        </div>
        {fuera.length > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>+{fuera.length} hito(s) fuera de nov–jun</div>}
      </button>
      <div style={{ position: 'relative', width: anchoGrilla, minHeight: alto }}>
        {/* Celdas clicables y líneas guía */}
        {Array.from({ length: meses.length * porMes }, (_, i) => (
          <div
            key={i}
            onClick={() => onCelda(i)}
            title="Agregar hito aquí"
            style={{
              position: 'absolute', top: 0, bottom: 0, left: i * col, width: col, cursor: 'copy',
              borderLeft: i % porMes === 0 ? `1px solid ${C.linea}` : `1px dashed rgba(20,18,16,0.05)`,
            }}
          />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px solid rgba(255,255,255,0.9)', pointerEvents: 'none' }} />
        {items.map(({ h, pos, carril }) => {
          const estilo = HITOS[h.tipo]
          const texto = h.etiqueta || (vista === 'semanas' && pos.fin === pos.inicio ? estilo.corto.slice(0, 6) : estilo.corto)
          const revisar = h.nota?.toLowerCase().includes('revisar')
          return (
            <button
              key={h._key}
              onClick={e => { e.stopPropagation(); onEditar(h._key) }}
              title={`${h.etiqueta || estilo.etiqueta} · ${textoPeriodo(h)}${h.hecho ? ' · cumplido' : ''}${h.nota ? ` · ${h.nota}` : ''}`}
              style={{
                position: 'absolute', zIndex: 1,
                top: 7 + carril * (ALTO_PILDORA + 6) + (n === 1 ? (alto - 14 - ALTO_PILDORA) / 2 : 0),
                left: pos.inicio * col + 3, width: (pos.fin - pos.inicio + 1) * col - 6, height: ALTO_PILDORA,
                borderRadius: pos.cortaInicio ? `0 ${ALTO_PILDORA}px ${ALTO_PILDORA}px 0` : pos.cortaFin ? `${ALTO_PILDORA}px 0 0 ${ALTO_PILDORA}px` : ALTO_PILDORA,
                background: estilo.fondo, color: estilo.texto, opacity: h.hecho ? 0.55 : 1,
                border: h.tipo === 'otro' ? `1px solid ${C.linea}` : revisar ? '1px dashed rgba(20,18,16,0.45)' : 'none',
                fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'inherit',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 8px', cursor: 'pointer',
              }}
            >
              {h.hecho ? '✓ ' : ''}{texto}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', border: `1px solid ${C.linea}`, borderRadius: 6, background: '#fff', color: C.dark,
}
const botonPrimario: React.CSSProperties = {
  background: C.dark, color: '#fff', border: 'none', padding: '10px 18px', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
  textTransform: 'uppercase', borderRadius: 999, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
}
const botonSecundario: React.CSSProperties = {
  background: 'transparent', color: C.dark, border: `1px solid ${C.dark}`, padding: '9px 16px', fontSize: 13, borderRadius: 999, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span style={{ display: 'block', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{children}</span>
}

const MESES_EDICION = mesesEntre(RANGO_EDICION.desde, RANGO_EDICION.hasta)

function SelectorPeriodo({ mes, semana, onMes, onSemana, opcional }: {
  mes: string | null | undefined; semana: number | null | undefined
  onMes: (m: string | null) => void; onSemana: (s: number | null) => void; opcional?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <select value={mes || ''} onChange={e => onMes(e.target.value || null)} style={{ ...inputStyle, flex: 1, padding: '6px 8px' }}>
        {opcional && <option value="">—</option>}
        {MESES_EDICION.map(m => <option key={m} value={m}>{nombreMes(m)} {m.slice(0, 4)}</option>)}
      </select>
      <select value={semana || ''} onChange={e => onSemana(e.target.value ? Number(e.target.value) : null)} disabled={!mes} style={{ ...inputStyle, width: 82, padding: '6px 8px' }}>
        <option value="">Mes</option>
        {Array.from({ length: SEMANAS_POR_MES }, (_, i) => <option key={i} value={i + 1}>S{i + 1}</option>)}
      </select>
    </div>
  )
}

function Editor({ edicion, meses, onCerrar }: { edicion: Edicion; meses: string[]; onCerrar: () => void }) {
  const router = useRouter()
  const base = edicion.proyecto
  const [form, setForm] = useState(() => ({
    nombre: base?.nombre || '',
    cliente: base?.cliente || '',
    tipo: (base?.tipo || 'porDefinir') as TipoProyecto,
    superficie: base?.superficie || '',
    m2: base?.m2?.toString() || '',
    estado: base?.estado || '',
    hitos: [...(base?.hitos || []), ...(edicion.hitoNuevo ? [edicion.hitoNuevo] : [])] as Hito[],
  }))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const enfocado = edicion.enfocarHito || edicion.hitoNuevo?._key
  const refEnfocado = useRef<HTMLDivElement>(null)
  useEffect(() => { refEnfocado.current?.scrollIntoView({ block: 'center' }) }, [])

  const setCampo = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))
  const setHito = (key: string, cambios: Partial<Hito>) =>
    setForm(f => ({ ...f, hitos: f.hitos.map(h => (h._key === key ? { ...h, ...cambios } : h)) }))
  const agregarHito = (tipo: TipoHito) => {
    const mesActual = new Date().toISOString().slice(0, 7)
    const desde = meses.includes(mesActual) ? mesActual : meses[0]
    setForm(f => ({ ...f, hitos: [...f.hitos, { _key: nuevaClave(), tipo, desde, hecho: false, semanaDesde: semanaDeDia(new Date().getDate()) }] }))
  }

  const llamar = async (url: string, method: string, body?: unknown) => {
    setGuardando(true)
    setError('')
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : '{}' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || `Error ${res.status}`)
      router.refresh()
      onCerrar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar.')
      setGuardando(false)
    }
  }

  const guardar = () => {
    const m2 = form.m2.trim() ? Number(form.m2.replace(/\./g, '').replace(',', '.')) : null
    const datos = { ...form, m2, mondayItemId: base?.mondayItemId || null }
    if (base) llamar(`/api/interno/comercial/${base._id}`, 'PUT', datos)
    else llamar('/api/interno/comercial', 'POST', datos)
  }

  const hitosOrdenados = [...form.hitos].sort((a, b) => a.desde.localeCompare(b.desde) || (a.semanaDesde || 0) - (b.semanaDesde || 0))

  return (
    <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,16,0.35)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(560px, 100%)', height: '100%', overflowY: 'auto', background: C.off, padding: '24px 24px 40px', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>{base ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.muted }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          <label style={{ gridColumn: '1 / -1' }}><Etiqueta>Proyecto *</Etiqueta>
            <input value={form.nombre} onChange={e => setCampo('nombre', e.target.value)} style={{ ...inputStyle, width: '100%' }} autoFocus={!base} />
          </label>
          <label><Etiqueta>Cliente / contraparte</Etiqueta>
            <input value={form.cliente} onChange={e => setCampo('cliente', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </label>
          <label><Etiqueta>Tipo de presupuesto</Etiqueta>
            <select value={form.tipo} onChange={e => setCampo('tipo', e.target.value as TipoProyecto)} style={{ ...inputStyle, width: '100%' }}>
              {ORDEN_TIPOS.map(t => <option key={t} value={t}>{TIPOS_PROYECTO[t].etiqueta}</option>)}
            </select>
          </label>
          <label><Etiqueta>m²</Etiqueta>
            <input inputMode="decimal" value={form.m2} onChange={e => setCampo('m2', e.target.value)} style={{ ...inputStyle, width: '100%' }} />
          </label>
          <label><Etiqueta>Superficie (detalle)</Etiqueta>
            <input value={form.superficie} onChange={e => setCampo('superficie', e.target.value)} placeholder="Ej: 210 m² + 100 m² terraza" style={{ ...inputStyle, width: '100%' }} />
          </label>
          <label style={{ gridColumn: '1 / -1' }}><Etiqueta>Estado / condición</Etiqueta>
            <textarea value={form.estado} onChange={e => setCampo('estado', e.target.value)} rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical' }} />
          </label>
        </div>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.muted, margin: '22px 0 8px' }}>Hitos</h3>
        {hitosOrdenados.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Sin hitos todavía. Agrega el montaje y los pasos que faltan para que el proyecto salga adelante.</p>}
        {hitosOrdenados.map(h => (
          <div
            key={h._key}
            ref={h._key === enfocado ? refEnfocado : undefined}
            style={{
              background: '#fff', borderRadius: 8, padding: 12, marginBottom: 8,
              borderLeft: `5px solid ${HITOS[h.tipo].fondo}`, boxShadow: h._key === enfocado ? `0 0 0 2px ${C.purpleMid}` : 'none',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={h.tipo} onChange={e => setHito(h._key, { tipo: e.target.value as TipoHito })} style={{ ...inputStyle, flex: 1, padding: '6px 8px', fontWeight: 500 }}>
                {(Object.keys(HITOS) as TipoHito[]).map(t => <option key={t} value={t}>{HITOS[t].etiqueta}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={h.hecho} onChange={e => setHito(h._key, { hecho: e.target.checked })} /> Cumplido
              </label>
              <button onClick={() => setForm(f => ({ ...f, hitos: f.hitos.filter(x => x._key !== h._key) }))} title="Quitar hito" style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <input
              value={h.etiqueta || ''} onChange={e => setHito(h._key, { etiqueta: e.target.value || undefined })}
              placeholder={h.tipo === 'otro' ? 'Nombre del hito (ej: Mock up, Fundaciones)' : 'Etiqueta opcional (ej: Montaje etapa 2)'}
              style={{ ...inputStyle, width: '100%', marginTop: 8, padding: '6px 8px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <div><Etiqueta>Desde</Etiqueta>
                <SelectorPeriodo mes={h.desde} semana={h.semanaDesde} onMes={m => m && setHito(h._key, { desde: m, hasta: h.hasta && h.hasta < m ? null : h.hasta })} onSemana={s => setHito(h._key, { semanaDesde: s })} />
              </div>
              <div><Etiqueta>Hasta (opcional)</Etiqueta>
                <SelectorPeriodo opcional mes={h.hasta} semana={h.semanaHasta} onMes={m => setHito(h._key, { hasta: m && m >= h.desde ? m : null, semanaHasta: m ? h.semanaHasta : null })} onSemana={s => setHito(h._key, { semanaHasta: s })} />
              </div>
            </div>
            <input value={h.nota || ''} onChange={e => setHito(h._key, { nota: e.target.value || undefined })} placeholder="Nota" style={{ ...inputStyle, width: '100%', marginTop: 8, padding: '6px 8px', fontSize: 12 }} />
          </div>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {(Object.keys(HITOS) as TipoHito[]).map(t => (
            <button key={t} onClick={() => agregarHito(t)} style={{ border: 'none', borderRadius: 999, padding: '6px 11px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', background: HITOS[t].fondo, color: HITOS[t].texto }}>
              + {HITOS[t].etiqueta}
            </button>
          ))}
        </div>

        {error && <p style={{ fontSize: 13, color: C.rojo, marginTop: 14 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={guardar} disabled={guardando || !form.nombre.trim()} style={{ ...botonPrimario, opacity: form.nombre.trim() ? 1 : 0.4 }}>{guardando ? 'Guardando…' : 'Guardar'}</button>
          <button onClick={onCerrar} style={botonSecundario}>Cancelar</button>
          {base && (
            <button
              onClick={() => { if (confirm(`¿Archivar "${base.nombre}"? Deja de verse en el board.`)) llamar(`/api/interno/comercial/${base._id}`, 'DELETE') }}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.rojo, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >Archivar</button>
          )}
        </div>
        {base?.actualizadoPor && <p style={{ fontSize: 11, color: C.muted, marginTop: 14 }}>Última edición: {base.actualizadoPor}</p>}
      </div>
    </div>
  )
}
