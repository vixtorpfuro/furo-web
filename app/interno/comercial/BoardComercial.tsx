'use client'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  HITOS, INDICADORES_TEXTO, RANGO_EDICION, RANGO_VISIBLE, SEMANAS_POR_MES, TIPOS_PROYECTO,
  RANGOS_PROBABILIDAD, CATEGORIAS, resumenMes, columnasHito, rangoProbabilidad, compararProyectos, conDuracionPorDefecto, formatoUF, mesesEntre, mesMontaje, moverHito, nombreMes, nuevaClave, semanaDeDia, textoPeriodo, inicioTrasAnterior, partidasDe, rellenarAntesDeFabrica, tieneIndicadoresPropios,
  desgloseProyecto, ufM2Proyecto, ufProyecto,
  type ResumenMes, type Hito, type Indicadores, type ProyectoComercial, type TipoHito, type TipoProyecto,
} from '@/lib/comercial/modelo'

const C = { dark: '#141210', off: '#f5f3ee', fondo: '#efece5', muted: '#8a8278', linea: 'rgba(20,18,16,0.10)', purpleMid: '#52448a', rojo: '#c0392b', trimestre: '#c99a5b' }
const PROBABILIDAD_SEGURA = 70

type Vista = 'meses' | 'semanas'
const ANCHO_COL = { meses: 132, semanas: 46 }
const ANCHO_BANDA = 34
const ANCHO_NOMBRE = 270
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

const PROBABILIDADES = Array.from({ length: 11 }, (_, i) => i * 10)

// Lo que viaja al PUT: el proyecto completo sin campos de solo lectura.
function datosParaGuardar(p: ProyectoComercial) {
  const { _id, actualizadoPor, ...datos } = p
  void _id; void actualizadoPor
  return datos
}

export default function BoardComercial({ proyectos: iniciales, indicadores, hoy, totalSemilla }: {
  proyectos: ProyectoComercial[]; indicadores: Indicadores; hoy: string; totalSemilla: number
}) {
  const router = useRouter()
  // Copia local para que mover un hito o cambiar la probabilidad se vea al instante; se
  // reemplaza cuando llegan los datos del servidor.
  const [proyectos, setProyectos] = useState(iniciales)
  useEffect(() => setProyectos(iniciales), [iniciales])
  const [ind, setInd] = useState(indicadores)
  useEffect(() => setInd(indicadores), [indicadores])
  const [errorGuardado, setErrorGuardado] = useState('')
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

  // Con el cursor sobre los nombres, la rueda mueve la página completa; sobre la grilla, el board.
  // Va con un listener nativo porque React registra la rueda como pasiva y no deja cancelarla.
  const hayBoard = proyectos.length > 0
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const alGirar = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (!(e.target as Element).closest?.('[data-zona-pagina]')) return
      e.preventDefault()
      window.scrollBy({ top: e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY })
    }
    el.addEventListener('wheel', alGirar, { passive: false })
    return () => el.removeEventListener('wheel', alGirar)
  }, [hayBoard])

  const mesHoy = hoy.slice(0, 7)
  // Al abrir, el mes actual queda en la primera columna visible.
  useEffect(() => {
    const i = meses.indexOf(mesHoy)
    if (i > 0 && scrollRef.current) scrollRef.current.scrollLeft = i * col
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const xHoy = meses.includes(mesHoy)
    ? (meses.indexOf(mesHoy) + (Number(hoy.slice(8, 10)) - 1) / 31) * porMes * col
    : null

  const guardarProyecto = async (p: ProyectoComercial) => {
    setProyectos(prev => prev.map(x => (x._id === p._id ? p : x)))
    setErrorGuardado('')
    try {
      const res = await fetch(`/api/interno/comercial/${p._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosParaGuardar(p)) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || `Error ${res.status}`)
    } catch (e) {
      setErrorGuardado(`No se guardó "${p.nombre}": ${e instanceof Error ? e.message : 'error'}`)
    }
    router.refresh()
  }

  const filtrados = proyectos.filter(p =>
    tiposVisibles.has(p.tipo) &&
    (!buscar.trim() || `${p.nombre} ${p.cliente}`.toLowerCase().includes(buscar.trim().toLowerCase()))
  )
  const grupos = ORDEN_TIPOS
    .map(tipo => ({
      tipo,
      filas: filtrados
        .filter(p => p.tipo === tipo)
        .sort(compararProyectos),
    }))
    .filter(g => g.filas.length)

  // Montajes por semana, al pie de la vista de semanas.
  const porSemana = meses.flatMap(() => Array.from({ length: SEMANAS_POR_MES }, () => 0))
  if (vista === 'semanas') {
    for (const p of filtrados) {
      for (const h of p.hitos.filter(x => x.tipo === 'montaje')) {
        const pos = columnasHito(h, meses, 'semanas')
        if (pos) for (let i = pos.inicio; i <= pos.fin; i++) porSemana[i]++
      }
    }
  }

  // Resumen de cada mes por rango de probabilidad: 70-100% bajo el mes, el resto y el total al pie.
  const porRango = RANGOS_PROBABILIDAD.map((_, i) => {
    const lista = filtrados.filter(p => rangoProbabilidad(p.probabilidad) === i)
    return { n: lista.length, meses: meses.map(m => resumenMes(lista, ind, m)) }
  })
  const totalMeses = meses.map(m => resumenMes(filtrados, ind, m))
  // Líneas trimestrales: al inicio de enero, abril, julio y octubre.
  const inicioTrimestre = meses.flatMap((m, i) => (['01', '04', '07', '10'].includes(m.slice(5)) ? [i] : []))

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
    setEdicion({ proyecto: p, hitoNuevo: conDuracionPorDefecto({ _key: nuevaClave(), tipo, desde: mes, semanaDesde: semana, hecho: false }) })
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
        {edicion && <Editor edicion={edicion} meses={meses} ind={ind} onCerrar={() => setEdicion(null)} />}
      </div>
    )
  }

  return (
    <div>
      <PanelIndicadores ind={ind} onCambio={setInd} proyectos={filtrados} />

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
        <span>· Clic en una celda vacía para agregar un hito · Arrastra un hito para moverlo · Clic en un mes para verlo por semanas</span>
      </div>
      {errorGuardado && <p style={{ color: C.rojo, fontSize: 13, margin: '0 0 10px' }}>{errorGuardado}</p>}

      {/* Scroll propio en ambos ejes: el encabezado de meses queda fijo al bajar y los nombres al correr a la derecha. */}
      <div ref={scrollRef} style={{ overflow: 'auto', maxHeight: 'calc(100vh - 24px)', paddingBottom: 6, overscrollBehavior: 'contain' }}>
        <div style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8 + anchoGrilla, position: 'relative' }}>
          {/* Encabezado */}
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 5, background: C.fondo, paddingBottom: 8 }}>
            <div data-zona-pagina style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8, flexShrink: 0, position: 'sticky', left: 0, background: C.fondo, zIndex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', fontSize: 11, color: C.muted, paddingLeft: 4, paddingBottom: vista === 'semanas' ? 18 : 0 }}>
              <span>Bajo cada mes, proyectos con <strong style={{ fontWeight: 500, color: C.dark }}>70-100%</strong> ({porRango[0].n}): m² en curso y UF que se cobran ese mes, por categoría</span>
              <span style={{ marginTop: 2 }}>Mad.+Fáb.: madera y fábrica · Mont.+Log.: montaje y logística · Obra: obra completa</span>
              <span style={{ marginTop: 2 }}>Los demás rangos y el total van al pie</span>
              {sinMontaje > 0 && <span style={{ marginTop: 2 }}>{sinMontaje} sin mes de montaje</span>}
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              {meses.map((mes, iMes) => (
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
                    {/* Con más de un año a la vista, el año va en el primer mes y en cada enero. */}
                    {vista === 'meses' && (iMes === 0 || mes.endsWith('-01')) && <span style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0 }}> ’{mes.slice(2, 4)}</span>}
                  </button>
                  <TablaMes r={porRango[0].meses[iMes]} oscuro={mes === mesHoy} />
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

          {/* Líneas trimestrales */}
          {inicioTrimestre.map(i => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: ANCHO_BANDA + ANCHO_NOMBRE + 8 + i * porMes * col - 1, borderLeft: `2px dashed ${C.trimestre}`, zIndex: 1, pointerEvents: 'none' }} />
          ))}

          {/* Línea de hoy */}
          {xHoy !== null && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: ANCHO_BANDA + ANCHO_NOMBRE + 8 + xHoy, width: 2, background: C.rojo, opacity: 0.35, zIndex: 1, pointerEvents: 'none' }} />
          )}

          {grupos.map(g => (
            <div key={g.tipo} style={{ display: 'flex', marginBottom: 10 }}>
              {/* Banda del grupo, como en la referencia */}
              <div data-zona-pagina style={{
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
                    key={p._id} p={p} meses={meses} vista={vista} col={col} anchoGrilla={anchoGrilla} ind={ind}
                    onEditar={enfocarHito => setEdicion({ proyecto: p, enfocarHito })}
                    onCelda={c => abrirCelda(p, c)}
                    onProbabilidad={v => guardarProyecto({ ...p, probabilidad: v })}
                    onMover={(key, delta) => guardarProyecto({ ...p, hitos: p.hitos.map(h => (h._key === key ? moverHito(h, delta, vista) : h)) })}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Pie: los demás rangos de probabilidad y el total del mes */}
          <div style={{ marginTop: 6, borderTop: `2px solid ${C.dark}`, paddingTop: 8 }}>
            {[
              ...porRango.slice(1).map((r, i) => ({ clave: RANGOS_PROBABILIDAD[i + 1].clave, titulo: RANGOS_PROBABILIDAD[i + 1].etiqueta, color: RANGOS_PROBABILIDAD[i + 1].color, n: r.n, datos: r.meses, detalle: '' })),
              { clave: 'total', titulo: 'Total', color: C.dark, n: filtrados.length, datos: totalMeses, detalle: 'Todos los rangos, incluido 70-100%' },
            ].map(fila => (
              <div key={fila.clave} style={{ display: 'flex', marginBottom: 6 }}>
                <div data-zona-pagina style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8, flexShrink: 0, position: 'sticky', left: 0, background: C.fondo, zIndex: 3, fontSize: 13, paddingLeft: 4 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                    <span style={{ width: 10, height: 10, background: fila.color, borderRadius: 2 }} />{fila.titulo}
                  </span>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{fila.n} proyecto{fila.n === 1 ? '' : 's'}</div>
                  {fila.detalle && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{fila.detalle}</div>}
                </div>
                <div style={{ display: 'flex' }}>
                  {meses.map((mes, iMes) => (
                    <div key={mes} style={{ width: porMes * col, flexShrink: 0, paddingRight: 4 }}>
                      <TablaMes r={fila.datos[iMes]} oscuro={false} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Montajes por semana */}
          {vista === 'semanas' && (
            <div style={{ display: 'flex', marginTop: 6, borderTop: `2px solid ${C.dark}`, paddingTop: 8 }}>
              <div data-zona-pagina style={{ width: ANCHO_BANDA + ANCHO_NOMBRE + 8, flexShrink: 0, position: 'sticky', left: 0, background: C.fondo, zIndex: 3, fontSize: 12, paddingLeft: 4 }}>
                <strong style={{ fontWeight: 500 }}>Montajes por semana</strong>
              </div>
              <div style={{ display: 'flex' }}>
                {porSemana.map((n, i) => (
                  <div key={i} style={{ width: col, textAlign: 'center', fontSize: 13, color: n ? C.dark : C.muted, opacity: n ? 1 : 0.4 }}>{n}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {edicion && <Editor edicion={edicion} meses={meses} ind={ind} onCerrar={() => setEdicion(null)} />}
    </div>
  )
}

const miles = (n: number) => Math.round(n).toLocaleString('es-CL')

// Resumen de un mes: m² en curso y UF que se cobran, por categoría.
function TablaMes({ r, oscuro }: { r: ResumenMes; oscuro: boolean }) {
  const celda = (n: number): string => (n ? miles(n) : '–')
  const fin: React.CSSProperties = { textAlign: 'right' }
  return (
    <div style={{
      background: oscuro ? '#2a2622' : 'rgba(255,255,255,0.55)', color: oscuro ? '#fff' : C.dark, opacity: r.total || CATEGORIAS.some(c => r.filas[c.clave].m2) ? 1 : 0.5,
      display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 4, fontSize: 10, lineHeight: 1.55, padding: '4px 5px 5px', whiteSpace: 'nowrap',
    }}>
      <span /><span style={{ ...fin, opacity: 0.6 }}>m²</span><span style={{ ...fin, opacity: 0.6, minWidth: 24 }}>UF</span>
      {CATEGORIAS.map(c => (
        <Fragment key={c.clave}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.etiqueta}</span>
          <span style={fin}>{celda(r.filas[c.clave].m2)}</span>
          <span style={fin}>{celda(r.filas[c.clave].uf)}</span>
        </Fragment>
      ))}
      <strong style={{ fontWeight: 600, gridColumn: '1 / 3', borderTop: `1px solid ${oscuro ? 'rgba(255,255,255,0.25)' : C.linea}`, marginTop: 2 }}>Cobro del mes</strong>
      <strong style={{ ...fin, fontWeight: 600, borderTop: `1px solid ${oscuro ? 'rgba(255,255,255,0.25)' : C.linea}`, marginTop: 2 }}>{celda(r.total)}</strong>
    </div>
  )
}

function PanelIndicadores({ ind, onCambio, proyectos }: { ind: Indicadores; onCambio: (i: Indicadores) => void; proyectos: ProyectoComercial[] }) {
  const [textos, setTextos] = useState(() => Object.fromEntries(Object.entries(ind).map(([k, v]) => [k, String(v).replace('.', ',')])) as Record<keyof Indicadores, string>)
  const [estado, setEstado] = useState('')

  const guardar = async (k: keyof Indicadores) => {
    const v = Number(textos[k].replace(',', '.'))
    if (!Number.isFinite(v) || v < 0 || v > 100) { setEstado('Valor no válido'); return }
    if (v === ind[k]) return
    const nuevos = { ...ind, [k]: v }
    onCambio(nuevos)
    setEstado('Guardando…')
    try {
      const res = await fetch('/api/interno/comercial/indicadores', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevos) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || `Error ${res.status}`)
      setEstado('Guardado')
    } catch (e) {
      setEstado(e instanceof Error ? e.message : 'No se pudo guardar')
    }
  }

  let total = 0, seguro = 0, sinValor = 0
  const porRango = RANGOS_PROBABILIDAD.map(() => ({ uf: 0, n: 0 }))
  for (const p of proyectos) {
    const uf = ufProyecto(p, ind)
    if (uf == null) { sinValor++; continue }
    total += uf
    if ((p.probabilidad ?? -1) >= PROBABILIDAD_SEGURA) seguro += uf
    const r = porRango[rangoProbabilidad(p.probabilidad)]
    r.uf += uf
    r.n++
  }
  const sinProb = proyectos.filter(p => p.probabilidad == null).length

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
      {(Object.keys(INDICADORES_TEXTO) as (keyof Indicadores)[]).map(k => (
        <label key={k} style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', minWidth: 150, flex: '1 1 150px' }}>
          <span style={{ display: 'block', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{INDICADORES_TEXTO[k].etiqueta}</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <input
              inputMode="decimal" value={textos[k]}
              onChange={e => setTextos(t => ({ ...t, [k]: e.target.value }))}
              onBlur={() => guardar(k)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              style={{ width: 64, fontSize: 24, fontFamily: 'inherit', border: 'none', borderBottom: `1px dashed ${C.linea}`, background: 'transparent', color: C.dark, padding: 0 }}
            />
            <span style={{ fontSize: 12, color: C.muted }}>UF/m²</span>
          </span>
          <span style={{ display: 'block', fontSize: 11, color: C.muted, marginTop: 2 }}>
            {INDICADORES_TEXTO[k].detalle}{ind[k] === 0 && <span style={{ color: C.rojo }}> · por definir</span>}
          </span>
        </label>
      ))}
      <div style={{ background: C.dark, color: '#fff', borderRadius: 10, padding: '10px 16px', minWidth: 460, flex: '2 1 460px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 180px' }}>
          <span style={{ display: 'block', fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cartera visible</span>
          <div style={{ fontSize: 24, marginTop: 4 }}>{formatoUF(seguro)} <span style={{ fontSize: 12, opacity: 0.7 }}>70-100%{total > 0 ? ` · ${Math.round(seguro / total * 100)}% del total` : ''}</span></div>
          <div style={{ fontSize: 13, marginTop: 2 }}>{formatoUF(total - seguro)} <span style={{ fontSize: 12, opacity: 0.7 }}>bajo 70%{sinProb ? `, incluye ${sinProb} sin %` : ''}</span></div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
            {formatoUF(total)} total{sinValor ? ` · ${sinValor} sin valorizar` : ''}
          </div>
          {estado && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Indicadores: {estado}</div>}
        </div>
        {/* Total sin ponderar por rango de probabilidad */}
        <div style={{ flex: '1 1 220px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 20 }}>
          <span style={{ display: 'block', fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total por probabilidad</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', columnGap: 10, rowGap: 2, marginTop: 6, fontSize: 13, alignItems: 'center' }}>
            {RANGOS_PROBABILIDAD.map((r, i) => (
              <Fragment key={r.clave}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, background: r.color, borderRadius: 2, border: '1px solid rgba(255,255,255,0.3)' }} />{r.etiqueta}
                </span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{porRango[i].n} proy.</span>
                <span style={{ textAlign: 'right' }}>{formatoUF(porRango[i].uf)}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Fila({ p, meses, vista, col, anchoGrilla, ind, onEditar, onCelda, onProbabilidad, onMover }: {
  p: ProyectoComercial; meses: string[]; vista: Vista; col: number; anchoGrilla: number; ind: Indicadores
  onEditar: (hito?: string) => void; onCelda: (columna: number) => void
  onProbabilidad: (v: number | null) => void; onMover: (key: string, delta: number) => void
}) {
  const { items, n } = carriles(p.hitos, meses, vista)
  // Arrastre de hitos: se mueve en pantalla y al soltar se ajusta a la columna más cercana.
  const [arrastre, setArrastre] = useState<{ key: string; x0: number; dx: number } | null>(null)
  const uf = ufProyecto(p, ind)
  const alto = Math.max(46, n * (ALTO_PILDORA + 6) + 14)
  const fuera = p.hitos.filter(h => !columnasHito(h, meses, vista))
  const porMes = vista === 'semanas' ? SEMANAS_POR_MES : 1
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, borderBottom: `1px solid ${C.linea}` }}>
      <div data-zona-pagina style={{
        width: ANCHO_NOMBRE, flexShrink: 0, position: 'sticky', left: ANCHO_BANDA + 4, zIndex: 2, display: 'flex', alignItems: 'stretch',
        background: `color-mix(in srgb, ${TIPOS_PROYECTO[p.tipo].color} 55%, #fff)`, borderBottom: `3px solid ${C.fondo}`, marginRight: 4,
      }}>
        <button onClick={() => onEditar()} style={{ flex: 1, minWidth: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none', padding: '8px 4px 8px 12px', color: C.dark }}>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.25 }}>{p.nombre}</div>
          <div style={{ fontSize: 11, color: '#5e574e', marginTop: 2 }}>
            {[p.cliente, p.m2 ? `${p.m2.toLocaleString('es-CL')} m²` : '', p.zona].filter(Boolean).join(' · ') || '—'}
          </div>
          {uf != null && <div style={{ fontSize: 11, color: C.purpleMid, marginTop: 2 }}>{formatoUF(uf)}{tieneIndicadoresPropios(p) && <span title="Este proyecto tiene indicadores propios" style={{ color: C.muted }}> · indicadores propios</span>}</div>}
          {fuera.length > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>+{fuera.length} hito(s) fuera de {nombreMes(meses[0], true)}–{nombreMes(meses[meses.length - 1], true)}</div>}
        </button>
        <label title="Probabilidad de éxito" style={{ display: 'flex', alignItems: 'center', paddingRight: 8 }}>
          <select
            value={p.probabilidad ?? ''} onChange={e => onProbabilidad(e.target.value === '' ? null : Number(e.target.value))}
            style={{
              fontFamily: 'inherit', fontSize: 12, fontWeight: 500, border: 'none', borderRadius: 999, padding: '4px 6px', cursor: 'pointer',
              background: p.probabilidad == null ? 'rgba(255,255,255,0.6)' : colorProbabilidad(p.probabilidad), color: p.probabilidad != null && p.probabilidad >= 60 ? '#fff' : C.dark,
            }}
          >
            <option value="">— %</option>
            {PROBABILIDADES.map(v => <option key={v} value={v}>{v}%</option>)}
          </select>
        </label>
      </div>
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
          const dx = arrastre?.key === h._key ? arrastre.dx : 0
          return (
            <button
              key={h._key}
              onClick={e => e.stopPropagation()}
              onPointerDown={e => { if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); setArrastre({ key: h._key, x0: e.clientX, dx: 0 }) }}
              onPointerMove={e => { if (arrastre?.key === h._key) setArrastre({ ...arrastre, dx: e.clientX - arrastre.x0 }) }}
              onPointerCancel={() => setArrastre(null)}
              onPointerUp={() => {
                if (arrastre?.key !== h._key) return
                const delta = Math.round(arrastre.dx / col)
                setArrastre(null)
                if (Math.abs(arrastre.dx) < 4) onEditar(h._key)
                else if (delta) onMover(h._key, delta)
              }}
              title={`${h.etiqueta || estilo.etiqueta} · ${textoPeriodo(h)}${h.hecho ? ' · cumplido' : ''}${h.nota ? ` · ${h.nota}` : ''}`}
              style={{
                position: 'absolute', zIndex: 1,
                top: 7 + carril * (ALTO_PILDORA + 6) + (n === 1 ? (alto - 14 - ALTO_PILDORA) / 2 : 0),
                left: pos.inicio * col + 3, width: (pos.fin - pos.inicio + 1) * col - 6, height: ALTO_PILDORA,
                borderRadius: pos.cortaInicio ? `0 ${ALTO_PILDORA}px ${ALTO_PILDORA}px 0` : pos.cortaFin ? `${ALTO_PILDORA}px 0 0 ${ALTO_PILDORA}px` : ALTO_PILDORA,
                background: estilo.fondo, color: estilo.texto, opacity: h.hecho ? 0.55 : 1,
                border: h.tipo === 'otro' ? `1px solid ${C.linea}` : revisar ? '1px dashed rgba(20,18,16,0.45)' : 'none',
                fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'inherit',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 8px', cursor: dx ? 'grabbing' : 'grab',
                transform: dx ? `translateX(${dx}px)` : undefined, boxShadow: dx ? '0 4px 12px rgba(0,0,0,0.2)' : undefined, touchAction: 'none',
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

// Rojo suave → morado FURŌ a medida que sube la probabilidad.
function colorProbabilidad(v: number) {
  if (v >= 80) return '#3a2d5e'
  if (v >= 60) return '#52448a'
  if (v >= 40) return '#c9c3e0'
  if (v >= 20) return '#f2d3c2'
  return '#f3c6c0'
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

// Lee números escritos a mano ("1,56", "1.200"). `miles` trata el punto como separador de miles.
function numero(texto: string, miles = false): number | null {
  const t = texto.trim()
  if (!t) return null
  const v = Number((miles ? t.replace(/\./g, '') : t).replace(',', '.'))
  return Number.isFinite(v) ? v : null
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

// Agrega un hito y, si es Fábrica, los hitos anteriores que falten con su tiempo base.
function conRelleno(hitos: Hito[], nuevo?: Hito): Hito[] {
  if (!nuevo) return hitos
  return [...hitos, ...(nuevo.tipo === 'fabrica' ? rellenarAntesDeFabrica(hitos, nuevo) : []), nuevo]
}

function Editor({ edicion, meses, ind, onCerrar }: { edicion: Edicion; meses: string[]; ind: Indicadores; onCerrar: () => void }) {
  const router = useRouter()
  const base = edicion.proyecto
  const [form, setForm] = useState(() => ({
    nombre: base?.nombre || '',
    cliente: base?.cliente || '',
    tipo: (base?.tipo || 'porDefinir') as TipoProyecto,
    superficie: base?.superficie || '',
    m2: base?.m2?.toString() || '',
    estado: base?.estado || '',
    probabilidad: base?.probabilidad?.toString() ?? '',
    zona: base?.zona || '',
    // Indicadores propios como texto; vacío = usa el general. La logística antigua se trae acá.
    indicadores: Object.fromEntries((Object.keys(ind) as (keyof Indicadores)[]).map(k => {
      const v = k === 'logistica' ? base?.indicadores?.logistica ?? base?.logistica : base?.indicadores?.[k]
      return [k, v != null ? String(v).replace('.', ',') : '']
    })) as Record<keyof Indicadores, string>,
    ufM2: base?.ufM2?.toString().replace('.', ',') ?? '',
    conMontaje: base?.conMontaje ?? false,
    hitos: conRelleno(base?.hitos || [], edicion.hitoNuevo),
  }))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const enfocado = edicion.enfocarHito || edicion.hitoNuevo?._key
  const refEnfocado = useRef<HTMLDivElement>(null)
  useEffect(() => { refEnfocado.current?.scrollIntoView({ block: 'center' }) }, [])

  const setCampo = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))
  const setHito = (key: string, cambios: Partial<Hito>) =>
    setForm(f => {
      const otros = f.hitos.filter(h => h._key !== key)
      const actual = f.hitos.find(h => h._key === key)!
      const nuevo = cambios.tipo ? conDuracionPorDefecto({ ...actual, ...cambios, hasta: null, semanaHasta: null }) : { ...actual, ...cambios }
      // Al pasar un hito a Fábrica se completan los anteriores que falten.
      if (cambios.tipo === 'fabrica') return { ...f, hitos: conRelleno(otros, nuevo) }
      return { ...f, hitos: f.hitos.map(h => (h._key === key ? nuevo : h)) }
    })
  const agregarHito = (tipo: TipoHito) => {
    const mesActual = new Date().toISOString().slice(0, 7)
    const desde = meses.includes(mesActual) ? mesActual : meses[0]
    setForm(f => {
      // Parte la semana siguiente al hito anterior de la secuencia, si ya está (fábrica tras madera, etc.).
      const inicio = inicioTrasAnterior(f.hitos, tipo) || { desde, semanaDesde: semanaDeDia(new Date().getDate()) }
      return { ...f, hitos: conRelleno(f.hitos, conDuracionPorDefecto({ _key: nuevaClave(), tipo, hecho: false, ...inicio })) }
    })
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
    const datos = {
      ...form, m2: numero(form.m2, true), probabilidad: numero(form.probabilidad), logistica: null, indicadores: indicadoresForm, ufM2: numero(form.ufM2),
      mondayItemId: base?.mondayItemId || null,
    }
    if (base) llamar(`/api/interno/comercial/${base._id}`, 'PUT', datos)
    else llamar('/api/interno/comercial', 'POST', datos)
  }

  const indicadoresForm = Object.fromEntries(
    Object.entries(form.indicadores).map(([k, v]) => [k, numero(v)]).filter(([, v]) => v != null)
  ) as Partial<Indicadores>
  const vista = { tipo: form.tipo, logistica: null, indicadores: indicadoresForm, ufM2: numero(form.ufM2), conMontaje: form.conMontaje }
  const desglose = desgloseProyecto(vista, ind)
  const tarifa = ufM2Proyecto(vista, ind)
  const tarifaCalculada = ufM2Proyecto({ ...vista, ufM2: null }, ind)
  const m2 = numero(form.m2, true)

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
          <label><Etiqueta>Probabilidad de éxito</Etiqueta>
            <select value={form.probabilidad} onChange={e => setCampo('probabilidad', e.target.value)} style={{ ...inputStyle, width: '100%' }}>
              <option value="">Sin definir</option>
              {PROBABILIDADES.map(v => <option key={v} value={v}>{v}%</option>)}
            </select>
          </label>
          <label><Etiqueta>Zona</Etiqueta>
            <input value={form.zona} onChange={e => setCampo('zona', e.target.value)} placeholder="Ej: Santiago, Pucón" style={{ ...inputStyle, width: '100%' }} />
          </label>
          <label><Etiqueta>UF/m² manual</Etiqueta>
            <input inputMode="decimal" value={form.ufM2} onChange={e => setCampo('ufM2', e.target.value)} placeholder={tarifaCalculada != null ? `${tarifaCalculada.toFixed(2).replace('.', ',')} según tipo` : 'Define el tipo'} style={{ ...inputStyle, width: '100%' }} />
          </label>
          {form.tipo === 'estructuras' && (
            <label style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.conMontaje} onChange={e => setCampo('conMontaje', e.target.checked)} /> Incluye montaje de estructuras
            </label>
          )}
          {partidasDe(form).length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Etiqueta>Indicadores del proyecto (UF/m², vacío = general)</Etiqueta>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                {partidasDe(form).map(k => (
                  <label key={k} style={{ fontSize: 12, color: C.muted }}>
                    {INDICADORES_TEXTO[k].etiqueta}
                    <input
                      inputMode="decimal" value={form.indicadores[k]}
                      onChange={e => setForm(f => ({ ...f, indicadores: { ...f.indicadores, [k]: e.target.value } }))}
                      placeholder={`${String(ind[k]).replace('.', ',')} general`}
                      style={{ ...inputStyle, width: '100%', marginTop: 3, borderColor: form.indicadores[k].trim() ? C.purpleMid : C.linea }}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
          {form.ufM2.trim() === '' && desglose.length > 0 && (
            <p style={{ gridColumn: '1 / -1', fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
              {desglose.map(d => `${INDICADORES_TEXTO[d.concepto].etiqueta} ${d.uf.toFixed(2).replace('.', ',')}`).join(' + ')}
            </p>
          )}
          <p style={{ gridColumn: '1 / -1', fontSize: 12, color: C.muted, margin: 0 }}>
            {tarifa != null
              ? <>Valor estimado: <strong style={{ color: C.dark, fontWeight: 500 }}>{tarifa.toFixed(2).replace('.', ',')} UF/m²</strong>{m2 ? <> × {m2.toLocaleString('es-CL')} m² = <strong style={{ color: C.dark, fontWeight: 500 }}>{formatoUF(tarifa * m2)}</strong></> : ' (faltan m²)'}</>
              : 'Sin valor estimado: elige un tipo o escribe un UF/m² manual.'}
          </p>
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
