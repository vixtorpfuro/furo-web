'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  calcularMl, cargaFabrica, diasEntre, sumarDias, PARAMETROS, TIEMPOS_DECISION,
  type Alcance, type FaseId, type Hitos, type TiempoDecision,
} from '@/lib/planificacion/calculo'
import type { ProyectoPlanificado } from '@/lib/planificacion/datos'

const C = {
  dark: '#141210', off: '#f5f3ee', muted: '#8a8278', border: 'rgba(20,18,16,0.12)',
  purple: '#3a2d5e', purpleMid: '#52448a', rojo: '#c0392b', naranjo: '#d9822b', verde: '#3d8b5a',
}

const FASES: Record<FaseId, { etiqueta: string; color: string }> = {
  modelacion: { etiqueta: 'Modelación y cálculo', color: '#8b7fc0' },
  madera: { etiqueta: 'Pedido de madera', color: '#c9ad73' },
  fabricacion: { etiqueta: 'Fabricación', color: C.purple },
  montaje: { etiqueta: 'Montaje', color: '#d9822b' },
  terminaciones: { etiqueta: 'Terminaciones', color: '#6f9a72' },
}

const GRUPOS: { alcance: Alcance | null; titulo: string; detalle: string }[] = [
  { alcance: 'completo', titulo: 'Área proyecto — Proyecto completo', detalle: 'Incluye terminaciones o coordinación de constructores locales' },
  { alcance: 'montadas', titulo: 'Estructuras montadas', detalle: 'Fabricación + montaje' },
  { alcance: 'estructuras', titulo: 'Solo estructuras', detalle: 'Fabricación y despacho' },
  { alcance: null, titulo: 'Sin itemizado en Monday', detalle: 'Completa la columna Itemizado para calcular' },
]

const HITOS_ETIQUETA: Record<keyof Hitos, string> = {
  limitePresupuesto: 'Entrega de presupuesto',
  firmaAnticipo: 'Firma / anticipo',
  entradaFabrica: 'Entrada a fábrica',
  inicioFabricacion: 'Inicio fabricación',
  inicioMontaje: 'Inicio montaje / despacho',
  finObra: 'Fin de obra',
}

const PX_DIA = 4
const ANCHO_IZQ = 290
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const fmt = (iso: string | null | undefined) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y.slice(2)}`
}

function lunes(iso: string) {
  const f = new Date(iso + 'T00:00:00Z')
  return sumarDias(iso, -((f.getUTCDay() + 6) % 7))
}

type Alerta = { texto: string; color: string }

function alertasDe(p: ProyectoPlanificado, hoy: string): Alerta[] {
  const a: Alerta[] = []
  const h = p.plan.hitos
  if (h && p.enEspera) {
    const dias = diasEntre(hoy, h.limitePresupuesto)
    if (dias < 0) a.push({ texto: `Presupuesto atrasado ${-dias} días`, color: C.rojo })
    else if (dias <= 14) a.push({ texto: `Entregar presupuesto en ${dias} días`, color: C.naranjo })
  }
  if (h && p.estado !== 'Ganado' && h.firmaAnticipo < hoy) {
    a.push({ texto: 'La firma ya debería haber ocurrido', color: C.rojo })
  }
  if (p.plan.desfaseMontajeDias) {
    const d = p.plan.desfaseMontajeDias
    a.push({ texto: `Montaje ${Math.abs(d)} días ${d > 0 ? 'después' : 'antes'} del objetivo`, color: d > 0 ? C.naranjo : C.muted })
  }
  return a
}

export default function Planificador({ proyectos, hoy }: { proyectos: ProyectoPlanificado[]; hoy: string }) {
  const [editando, setEditando] = useState<ProyectoPlanificado | null>(null)

  const { inicio, semanas, carga } = useMemo(() => {
    const fechas = proyectos.flatMap(p => p.plan.hitos ? [p.plan.hitos.limitePresupuesto, p.plan.hitos.finObra] : [])
    const minimo = [sumarDias(hoy, -28), ...fechas].sort()[0]
    const maximo = [sumarDias(hoy, 26 * 7), ...fechas].sort().at(-1)!
    const ini = lunes(minimo < sumarDias(hoy, -26 * 7) ? sumarDias(hoy, -26 * 7) : minimo)
    const fin = maximo > sumarDias(hoy, 104 * 7) ? sumarDias(hoy, 104 * 7) : maximo
    const nSemanas = Math.ceil((diasEntre(ini, fin) + 14) / 7)
    return { inicio: ini, semanas: nSemanas, carga: cargaFabrica(proyectos.map(p => p.plan), ini, nSemanas) }
  }, [proyectos, hoy])

  const ancho = semanas * 7 * PX_DIA
  const x = (iso: string) => diasEntre(inicio, iso) * PX_DIA

  const meses = useMemo(() => {
    const res: { iso: string; etiqueta: string }[] = []
    let [y, m] = inicio.split('-').map(Number)
    for (;;) {
      const iso = `${y}-${String(m).padStart(2, '0')}-01`
      if (diasEntre(inicio, iso) > semanas * 7) break
      // El mes de partida solo se rotula si queda espacio antes del siguiente.
      if (iso >= inicio || diasEntre(inicio, sumarDias(iso, 31)) > 12) {
        res.push({ iso: iso < inicio ? inicio : iso, etiqueta: `${MESES[m - 1]} ${String(y).slice(2)}` })
      }
      m++
      if (m > 12) { m = 1; y++ }
    }
    return res
  }, [inicio, semanas])

  const enEspera = proyectos.filter(p => p.enEspera)
  const atrasados = enEspera.filter(p => p.plan.hitos && p.plan.hitos.limitePresupuesto < hoy)
  const proximos = enEspera.filter(p => p.plan.hitos && p.plan.hitos.limitePresupuesto >= hoy && diasEntre(hoy, p.plan.hitos.limitePresupuesto) <= 30)
  const sinFecha = proyectos.filter(p => !p.plan.hitos)
  const sobrecarga = carga.filter(s => s.mlPorDia > PARAMETROS.mlPorDiaMax)

  return (
    <div>
      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Tarjeta titulo="En espera de presupuesto" valor={enEspera.length} />
        <Tarjeta titulo="Presupuestos atrasados" valor={atrasados.length} color={atrasados.length ? C.rojo : undefined} />
        <Tarjeta titulo="A entregar en 30 días" valor={proximos.length} color={proximos.length ? C.naranjo : undefined} />
        <Tarjeta titulo="Sin datos para calcular" valor={sinFecha.length} color={sinFecha.length ? C.muted : undefined} />
        <Tarjeta titulo="Semanas con fábrica sobrecargada" valor={sobrecarga.length} color={sobrecarga.length ? C.rojo : undefined} />
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: C.muted, marginBottom: 10 }}>
        {Object.values(FASES).map(f => (
          <span key={f.etiqueta} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 8, borderRadius: 4, background: f.color }} />{f.etiqueta}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Rombo color={C.purpleMid} />Entrega presupuesto</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Triangulo />Entrada a fábrica</span>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, overflowX: 'auto' }}>
        <div style={{ width: ANCHO_IZQ + ancho, position: 'relative' }}>
          {/* Encabezado de meses */}
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 3, background: '#fff', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: ANCHO_IZQ, flexShrink: 0, position: 'sticky', left: 0, background: '#fff', zIndex: 4, padding: '10px 14px', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Proyecto
            </div>
            <div style={{ position: 'relative', width: ancho, height: 36 }}>
              {meses.map(m => (
                <div key={m.iso} style={{ position: 'absolute', left: x(m.iso), top: 0, bottom: 0, borderLeft: `1px solid ${C.border}`, paddingLeft: 6, paddingTop: 11, fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {m.etiqueta}
                </div>
              ))}
            </div>
          </div>

          {/* Línea de hoy */}
          <div style={{ position: 'absolute', left: ANCHO_IZQ + x(hoy), top: 36, bottom: 0, width: 2, background: C.rojo, opacity: 0.5, zIndex: 2, pointerEvents: 'none' }} />

          {GRUPOS.map(g => {
            const filas = proyectos
              .filter(p => p.alcance === g.alcance)
              .sort((a, b) => (a.plan.hitos?.limitePresupuesto || '9999').localeCompare(b.plan.hitos?.limitePresupuesto || '9999'))
            if (!filas.length) return null
            return (
              <div key={g.titulo}>
                <div style={{ display: 'flex', background: C.off, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ position: 'sticky', left: 0, padding: '8px 14px', background: C.off, zIndex: 1 }}>
                    <strong style={{ fontSize: 13, fontWeight: 500 }}>{g.titulo}</strong>
                    <span style={{ fontSize: 12, color: C.muted }}> · {g.detalle} · {filas.length}</span>
                  </div>
                </div>
                {filas.map(p => (
                  <Fila key={p.id} p={p} hoy={hoy} x={x} ancho={ancho} onClick={() => setEditando(p)} />
                ))}
              </div>
            )
          })}

          {/* Carga de fábrica */}
          <div style={{ display: 'flex', borderTop: `2px solid ${C.dark}` }}>
            <div style={{ width: ANCHO_IZQ, flexShrink: 0, position: 'sticky', left: 0, background: '#fff', zIndex: 1, padding: '10px 14px' }}>
              <strong style={{ fontSize: 13, fontWeight: 500 }}>Carga de fábrica</strong>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
                ml/día promedio por semana<br />
                Plan {PARAMETROS.mlPorDiaPlan} · máx. {PARAMETROS.mlPorDiaMax} ml/día
              </div>
            </div>
            <div style={{ position: 'relative', width: ancho, height: 90 }}>
              {[PARAMETROS.mlPorDiaPlan, PARAMETROS.mlPorDiaMax].map(v => (
                <div key={v} style={{ position: 'absolute', left: 0, right: 0, bottom: 8 + v, borderTop: `1px dashed ${v === PARAMETROS.mlPorDiaMax ? C.rojo : C.muted}`, opacity: 0.6 }} />
              ))}
              {carga.map(s => s.mlPorDia > 0 && (
                <div
                  key={s.lunes}
                  title={`Semana del ${fmt(s.lunes)}: ${s.mlPorDia} ml/día · ${s.proyectos} proyecto(s)`}
                  style={{
                    position: 'absolute', left: x(s.lunes) + 2, width: 7 * PX_DIA - 4, bottom: 8,
                    height: Math.min(s.mlPorDia, 80),
                    background: s.mlPorDia > PARAMETROS.mlPorDiaMax ? C.rojo : s.mlPorDia > PARAMETROS.mlPorDiaPlan ? C.naranjo : C.verde,
                    borderRadius: '3px 3px 0 0',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
        Supuestos: modelación {PARAMETROS.modelacionDias} días hábiles; la madera se pide el día {PARAMETROS.pedidoMaderaEnDiaDeModelacion} de modelación y tarda {PARAMETROS.pedidoMaderaDias} días;
        fabricación a {PARAMETROS.mlPorDiaPlan} ml/día; montaje {PARAMETROS.m2PorDiaCuadrilla} m²/día por cuadrilla; sin ml de cotización se estima
        con {PARAMETROS.mlPorM2.residencial} ml/m² (residencial) o {PARAMETROS.mlPorM2.comercial} ml/m² (comercial). Semanas de 5 días, sin descontar feriados.
      </p>

      {editando && (
        <Editor
          key={editando.id}
          p={editando}
          hoy={hoy}
          onCerrar={() => setEditando(null)}
        />
      )}
    </div>
  )
}

function Tarjeta({ titulo, valor, color }: { titulo: string; valor: number; color?: string }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{titulo}</div>
      <div style={{ fontSize: 26, marginTop: 4, color: color || C.dark }}>{valor}</div>
    </div>
  )
}

function Rombo({ color }: { color: string }) {
  return <span style={{ width: 10, height: 10, background: color, transform: 'rotate(45deg)', display: 'inline-block' }} />
}

function Triangulo() {
  return <span style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `10px solid ${C.dark}`, display: 'inline-block' }} />
}

function Fila({ p, hoy, x, ancho, onClick }: {
  p: ProyectoPlanificado; hoy: string; x: (iso: string) => number; ancho: number; onClick: () => void
}) {
  const alertas = alertasDe(p, hoy)
  const h = p.plan.hitos
  const atrasado = h && p.enEspera && h.limitePresupuesto < hoy
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#faf9f6')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      <div style={{ width: ANCHO_IZQ, flexShrink: 0, position: 'sticky', left: 0, background: 'inherit', backgroundColor: '#fff', zIndex: 1, padding: '9px 14px', borderRight: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.nombre}>{p.nombre}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
          {p.m2 ? `${p.m2} m²` : 'sin m²'}
          {p.plan.ml ? ` · ${p.plan.ml} ml${p.plan.mlEstimado ? ' (est.)' : ''}` : ''}
          {p.responsable ? ` · ${p.responsable}` : ''}
        </div>
        <div style={{ fontSize: 11, marginTop: 3, color: p.enEspera ? C.purpleMid : C.verde }}>{p.estado}</div>
        {alertas.map(a => <div key={a.texto} style={{ fontSize: 11, color: a.color, marginTop: 2 }}>● {a.texto}</div>)}
        {h && p.plan.faltantes.length > 0 && (
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>○ Falta: {p.plan.faltantes.join(' · ')}</div>
        )}
      </div>
      <div style={{ position: 'relative', width: ancho, minHeight: 64 }}>
        {h ? (
          <>
            {p.plan.fases.map(f => (
              <div
                key={f.id}
                title={`${FASES[f.id].etiqueta}: ${fmt(f.inicio)} → ${fmt(f.fin)} (${f.dias} días hábiles)`}
                style={{
                  position: 'absolute', top: 26, height: 14, borderRadius: 7,
                  left: x(f.inicio), width: Math.max(PX_DIA, (diasEntre(f.inicio, f.fin) + 1) * PX_DIA),
                  background: FASES[f.id].color, opacity: f.id === 'madera' ? 0.85 : 1,
                }}
              />
            ))}
            <div title={`Entrega de presupuesto: ${fmt(h.limitePresupuesto)}`} style={{ position: 'absolute', top: 27, left: x(h.limitePresupuesto) - 6 }}>
              <Rombo color={atrasado ? C.rojo : C.purpleMid} />
            </div>
            {/* Tramo de decisión del cliente: del presupuesto a la firma */}
            <div style={{ position: 'absolute', top: 32, height: 2, left: x(h.limitePresupuesto) + 4, width: Math.max(0, x(h.firmaAnticipo) - x(h.limitePresupuesto) - 4), background: `repeating-linear-gradient(90deg, ${C.muted} 0 4px, transparent 4px 8px)` }} />
            <div title={`Entrada a fábrica: ${fmt(h.entradaFabrica)}`} style={{ position: 'absolute', top: 12, left: x(h.entradaFabrica) - 6 }}>
              <Triangulo />
            </div>
            <div style={{ position: 'absolute', top: 44, left: x(h.limitePresupuesto) - 20, fontSize: 10, color: atrasado ? C.rojo : C.muted, whiteSpace: 'nowrap' }}>
              {fmt(h.limitePresupuesto)}
            </div>
            <div style={{ position: 'absolute', top: 44, left: x(h.entradaFabrica) - 14, fontSize: 10, color: C.dark, whiteSpace: 'nowrap' }}>
              🏭 {fmt(h.entradaFabrica)}
            </div>
          </>
        ) : (
          <div style={{ position: 'sticky', left: ANCHO_IZQ, display: 'inline-block', margin: '20px 16px', padding: '2px 6px', background: '#fff', zIndex: 3, fontSize: 12, color: C.muted }}>
            Falta: {p.plan.faltantes.join(' · ')}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
  border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', color: C.dark,
}

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ display: 'block', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{etiqueta}</span>
      {children}
      {ayuda && <span style={{ display: 'block', fontSize: 11, color: C.muted, marginTop: 3 }}>{ayuda}</span>}
    </label>
  )
}

function Editor({ p, hoy, onCerrar }: { p: ProyectoPlanificado; hoy: string; onCerrar: () => void }) {
  const router = useRouter()
  const m = p.manual
  const [form, setForm] = useState({
    fechaObjetivo: m.fechaObjetivo || '',
    tiempoDecision: m.tiempoDecision,
    entradaFabricaAjustada: m.entradaFabricaAjustada || '',
    tipologia: m.tipologia || '',
    mlReales: m.mlReales?.toString() || '',
    cuadrillas: m.cuadrillas.toString(),
    terminacionesSemanas: m.terminacionesSemanas?.toString() || '',
    modeloPreliminar: m.modeloPreliminar,
    notas: m.notas,
    reales: { ...m.reales } as Partial<Record<keyof Hitos, string>>,
  })
  const [estado, setEstado] = useState<'' | 'guardando' | 'error'>('')
  const [error, setError] = useState('')

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))
  const num = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')))

  const enviar = async (body: Record<string, unknown>) => {
    setEstado('guardando')
    setError('')
    try {
      const res = await fetch(`/api/interno/planificacion/${p.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || `Error ${res.status}`)
      setEstado('')
      router.refresh()
      onCerrar()
    } catch (e) {
      setEstado('error')
      setError(e instanceof Error ? e.message : 'No se pudo guardar.')
    }
  }

  const guardar = () => enviar({
    fechaObjetivo: form.fechaObjetivo || null,
    tiempoDecision: form.tiempoDecision,
    entradaFabricaAjustada: form.entradaFabricaAjustada || null,
    tipologia: form.tipologia || null,
    mlReales: num(form.mlReales),
    cuadrillas: num(form.cuadrillas),
    terminacionesSemanas: num(form.terminacionesSemanas),
    modeloPreliminar: form.modeloPreliminar,
    notas: form.notas,
    reales: form.reales,
  })

  const h = p.plan.hitos
  const base = m.lineaBase

  return (
    <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,16,0.35)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 100%)', height: '100%', overflowY: 'auto', background: C.off, padding: '24px 24px 40px', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>{p.nombre}</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>
              {p.estado} · {p.m2 ? `${p.m2} m²` : 'sin m²'} · Horizonte Monday: {p.horizonte || '—'}
            </p>
            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.purpleMid }}>Abrir en Monday ↗</a>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.muted }}>×</button>
        </div>

        {p.plan.faltantes.length > 0 && (
          <div style={{ marginTop: 14, padding: '10px 12px', background: '#fff8ec', borderLeft: `3px solid ${C.naranjo}`, fontSize: 12 }}>
            Falta: {p.plan.faltantes.join(' · ')}
            {!p.alcance && <div style={{ color: C.muted, marginTop: 4 }}>El itemizado (alcance) se edita en Monday.</div>}
          </div>
        )}

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, margin: '20px 0 10px' }}>Planificación</h3>
        <Campo etiqueta={p.alcance === 'estructuras' ? 'Despacho objetivo' : 'Inicio de montaje objetivo'} ayuda="Desde esta fecha se calculan todas las demás hacia atrás.">
          <input type="date" value={form.fechaObjetivo} onChange={e => set('fechaObjetivo', e.target.value)} style={inputStyle} />
        </Campo>
        <Campo etiqueta="Tiempo de decisión del cliente" ayuda="Entre la entrega del presupuesto y la firma con anticipo.">
          <select value={form.tiempoDecision} onChange={e => set('tiempoDecision', e.target.value as TiempoDecision)} style={inputStyle}>
            {Object.entries(TIEMPOS_DECISION).map(([k, v]) => <option key={k} value={k}>{v.etiqueta}</option>)}
          </select>
        </Campo>
        <Campo etiqueta="Entrada a fábrica ajustada (opcional)" ayuda="Solo si el cliente necesita mover la entrada. Manda sobre el cálculo hacia atrás.">
          <input type="date" value={form.entradaFabricaAjustada} onChange={e => set('entradaFabricaAjustada', e.target.value)} style={inputStyle} />
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Campo etiqueta="ml reales (cotización)" ayuda={`Si se deja vacío: ${calcularMl({ m2: p.m2, tipologia: p.tipologia, mlReales: null }).ml ?? '—'} ml estimados`}>
            <input inputMode="decimal" value={form.mlReales} onChange={e => set('mlReales', e.target.value)} style={inputStyle} />
          </Campo>
          <Campo etiqueta="Tipología" ayuda={`Automática: ${p.tipologia}`}>
            <select value={form.tipologia} onChange={e => set('tipologia', e.target.value)} style={inputStyle}>
              <option value="">Automática</option>
              <option value="residencial">Residencial ({PARAMETROS.mlPorM2.residencial} ml/m²)</option>
              <option value="comercial">Comercial ({PARAMETROS.mlPorM2.comercial} ml/m²)</option>
            </select>
          </Campo>
          {p.alcance !== 'estructuras' && (
            <Campo etiqueta="Cuadrillas de montaje" ayuda={`${PARAMETROS.m2PorDiaCuadrilla} m²/día cada una`}>
              <input inputMode="numeric" value={form.cuadrillas} onChange={e => set('cuadrillas', e.target.value)} style={inputStyle} />
            </Campo>
          )}
          {p.alcance === 'completo' && (
            <Campo etiqueta="Meta terminaciones (semanas)">
              <input inputMode="decimal" value={form.terminacionesSemanas} onChange={e => set('terminacionesSemanas', e.target.value)} style={inputStyle} />
            </Campo>
          )}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 12 }}>
          <input type="checkbox" checked={form.modeloPreliminar} onChange={e => set('modeloPreliminar', e.target.checked)} />
          Tiene modelo preliminar para cotizar
        </label>
        <Campo etiqueta="Notas">
          <textarea value={form.notas} onChange={e => set('notas', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </Campo>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, margin: '20px 0 10px' }}>Meta, plan y real</h3>
        <p style={{ fontSize: 11, color: C.muted, margin: '0 0 8px' }}>
          El plan muestra lo guardado; los cambios del formulario se recalculan al guardar.
          Registra las fechas reales a medida que ocurren para analizar desviaciones.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', border: `1px solid ${C.border}` }}>
          <thead>
            <tr style={{ color: C.muted, textAlign: 'left' }}>
              <th style={{ padding: '6px 8px', fontWeight: 500 }}>Hito</th>
              <th style={{ padding: '6px 8px', fontWeight: 500 }}>Meta</th>
              <th style={{ padding: '6px 8px', fontWeight: 500 }}>Plan</th>
              <th style={{ padding: '6px 8px', fontWeight: 500 }}>Real</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(HITOS_ETIQUETA) as (keyof Hitos)[]).map(k => {
              const real = form.reales[k]
              const ref = base?.[k] || h?.[k]
              const desvio = real && ref ? diasEntre(ref, real) : null
              return (
                <tr key={k} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: '6px 8px' }}>{HITOS_ETIQUETA[k]}</td>
                  <td style={{ padding: '6px 8px', color: C.muted }}>{fmt(base?.[k])}</td>
                  <td style={{ padding: '6px 8px' }}>{fmt(h?.[k])}</td>
                  <td style={{ padding: '4px 8px' }}>
                    <input type="date" value={real || ''} max={hoy}
                      onChange={e => set('reales', { ...form.reales, [k]: e.target.value || undefined })}
                      style={{ ...inputStyle, padding: '4px 6px', fontSize: 12 }} />
                    {desvio !== null && desvio !== 0 && (
                      <span style={{ fontSize: 10, color: desvio > 0 ? C.rojo : C.verde }}>{desvio > 0 ? '+' : ''}{desvio} días</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
          {base?.fijadaEn
            ? `Meta fijada el ${fmt(base.fijadaEn.slice(0, 10))}${base.fijadaPor ? ` por ${base.fijadaPor}` : ''}.`
            : 'Aún no hay meta fijada. Fíjala cuando el plan esté acordado (por ejemplo, al ganar el proyecto).'}
        </p>

        {error && <p style={{ fontSize: 13, color: C.rojo, marginTop: 14 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button onClick={guardar} disabled={estado === 'guardando'} style={{ background: C.dark, color: '#fff', border: 'none', padding: '11px 22px', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer' }}>
            {estado === 'guardando' ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            onClick={() => { if (confirm('¿Fijar las fechas del plan actual como meta? Reemplaza la meta anterior.')) enviar({ accion: 'fijarLineaBase' }) }}
            disabled={!h || estado === 'guardando'}
            title={h ? '' : 'Guarda primero una fecha objetivo'}
            style={{ background: 'none', border: `1px solid ${C.dark}`, color: C.dark, padding: '10px 18px', fontSize: 13, borderRadius: 6, cursor: h ? 'pointer' : 'not-allowed', opacity: h ? 1 : 0.4 }}
          >
            Fijar plan actual como meta
          </button>
        </div>
      </div>
    </div>
  )
}
