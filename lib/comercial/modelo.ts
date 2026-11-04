// Board de planificación comercial: proyectos en etapa comercial con su mes de montaje e hitos.
// Módulo puro (sin acceso a Sanity) para usarlo en servidor y cliente.

export const TIPOS_PROYECTO = {
  estructuras: { etiqueta: 'Solo estructuras', color: '#f2b597' },
  intermedia: { etiqueta: 'Intermedia', detalle: 'Estructura montada / obra gruesa', color: '#cdc7bf' },
  completa: { etiqueta: 'Obra completa', color: '#c9c3e0' },
  noki: { etiqueta: 'Noki', color: '#e6cfa6' },
  porDefinir: { etiqueta: 'Por definir', color: '#e3dfd8' },
} as const
export type TipoProyecto = keyof typeof TIPOS_PROYECTO

// Orden = orden habitual en que ocurren en un proyecto. Las fundaciones van generalmente en
// paralelo al pedido de madera. Las claves `anteproyecto` (Permisos), `presupuestoCierre`
// (Presupuesto avanzado) y `calculo` (BIM) se mantienen por los datos ya guardados.
export const HITOS = {
  analisis: { etiqueta: 'Análisis inicial', corto: 'Análisis', fondo: '#e4ddd0', texto: '#141210' },
  anteproyecto: { etiqueta: 'Permisos', corto: 'Permisos', fondo: '#d6cdea', texto: '#141210' },
  presupuestoInicial: { etiqueta: 'Presupuesto inicial', corto: 'Ppto. inicial', fondo: '#bccbe0', texto: '#141210' },
  presupuestoCierre: { etiqueta: 'Presupuesto avanzado', corto: 'Ppto. avanzado', fondo: '#6f8fbf', texto: '#ffffff' },
  calculo: { etiqueta: 'BIM (cálculo y modelado)', corto: 'BIM', fondo: '#aaa49b', texto: '#ffffff' },
  pedidoMadera: { etiqueta: 'Pedido de madera', corto: 'Madera', fondo: '#c99a5b', texto: '#141210' },
  fundaciones: { etiqueta: 'Fundaciones', corto: 'Fundaciones', fondo: '#8c8577', texto: '#ffffff' },
  fabrica: { etiqueta: 'Fábrica', corto: 'Fábrica', fondo: '#52448a', texto: '#ffffff' },
  montaje: { etiqueta: 'Montaje estructuras', corto: 'Montaje', fondo: '#f08a5d', texto: '#141210' },
  envolvente: { etiqueta: 'Envolvente', corto: 'Envolvente', fondo: '#7aa5a0', texto: '#141210' },
  terminaciones: { etiqueta: 'Terminaciones & Especialidades', corto: 'Terminaciones', fondo: '#a77ca0', texto: '#ffffff' },
  terminoObra: { etiqueta: 'Término de obra', corto: 'Término', fondo: '#5f8f6b', texto: '#ffffff' },
  otro: { etiqueta: 'Otro', corto: 'Otro', fondo: '#f3f0ea', texto: '#141210' },
} as const
export type TipoHito = keyof typeof HITOS

// Un hito ocupa desde un mes (y opcionalmente una semana) hasta otro. Las semanas del mes son
// fijas para que la vista sea simple: S1 días 1-7, S2 8-14, S3 15-21, S4 22 al fin de mes.
export type Hito = {
  _key: string
  tipo: TipoHito
  etiqueta?: string
  desde: string // 'YYYY-MM'
  semanaDesde?: number | null
  hasta?: string | null
  semanaHasta?: number | null
  hecho: boolean
  nota?: string
}

export type ProyectoComercial = {
  _id: string
  nombre: string
  cliente: string
  tipo: TipoProyecto
  superficie: string
  m2: number | null
  estado: string
  hitos: Hito[]
  // Probabilidad de éxito en % (0-100). Primer paso hacia el "camino de la confianza".
  probabilidad: number | null
  zona: string
  // UF/m² de logística para la zona del proyecto (campo antiguo; lo nuevo va en `indicadores`).
  logistica: number | null
  // Indicadores propios del proyecto; los que faltan usan el indicador general.
  indicadores: Partial<Indicadores>
  // UF/m² fijado a mano; null = se calcula con los indicadores según el tipo.
  ufM2: number | null
  // Solo estructuras: si el presupuesto suma el montaje.
  conMontaje: boolean
  mondayItemId?: string | null
  actualizadoPor?: string | null
}

// Indicadores comerciales: utilidad en UF/m². Se editan desde la cabecera del board. Cada tipo de
// proyecto suma los anteriores: estructuras → + montaje → + partidas intermedia → + obra completa.
export type Indicadores = {
  estructuras: number; bim: number; montaje: number; envolvente: number; completa: number; logistica: number
}
// La envolvente parte en 0 hasta que se defina su valor.
export const INDICADORES_BASE: Indicadores = { estructuras: 1.75, bim: 1, montaje: 0.3, envolvente: 0, completa: 3.5, logistica: 0.2 }
export const INDICADORES_TEXTO: Record<keyof Indicadores, { etiqueta: string; detalle: string }> = {
  estructuras: { etiqueta: 'Solo estructuras', detalle: '50% madera · 25% llegada a fábrica · 25% despacho' },
  bim: { etiqueta: 'BIM', detalle: '50% al inicio · 50% al final' },
  montaje: { etiqueta: 'Montaje estructuras', detalle: '50% al iniciar · 50% al terminar el montaje' },
  envolvente: { etiqueta: 'Envolvente', detalle: 'Revestimiento ext., techumbre, ventanas y puertas exteriores' },
  completa: { etiqueta: 'Obra completa', detalle: 'Mes a mes, del montaje al fin de terminaciones' },
  logistica: { etiqueta: 'Logística', detalle: 'Mínimo Santiago; por zona en cada proyecto' },
}

type BaseValor = Pick<ProyectoComercial, 'tipo' | 'logistica' | 'ufM2' | 'conMontaje'> & { indicadores?: Partial<Indicadores> }

// Indicadores que valen para un proyecto: los propios y, donde no hay, los generales.
export function indicadoresDe(p: BaseValor, ind: Indicadores): Indicadores {
  const propios = Object.fromEntries(Object.entries(p.indicadores || {}).filter(([, v]) => typeof v === 'number'))
  return { ...ind, ...propios, logistica: p.indicadores?.logistica ?? p.logistica ?? ind.logistica }
}

export function tieneIndicadoresPropios(p: BaseValor) {
  return p.logistica != null || Object.values(p.indicadores || {}).some(v => typeof v === 'number')
}

// Partidas que suma cada tipo. Noki se valoriza como obra completa.
export function partidasDe(p: Pick<BaseValor, 'tipo' | 'conMontaje'>): (keyof Indicadores)[] {
  switch (p.tipo) {
    case 'estructuras': return p.conMontaje ? ['estructuras', 'bim', 'montaje', 'logistica'] : ['estructuras', 'bim', 'logistica']
    case 'intermedia': return ['estructuras', 'bim', 'montaje', 'envolvente', 'logistica']
    case 'completa':
    case 'noki': return ['estructuras', 'bim', 'montaje', 'envolvente', 'completa', 'logistica']
    default: return []
  }
}

export function desgloseProyecto(p: BaseValor, ind: Indicadores): { concepto: keyof Indicadores; uf: number }[] {
  const valores = indicadoresDe(p, ind)
  return partidasDe(p).map(k => ({ concepto: k, uf: valores[k] }))
}

// UF/m² del proyecto: fijo a mano o la suma de sus partidas.
export function ufM2Proyecto(p: BaseValor, ind: Indicadores): number | null {
  if (p.ufM2 != null) return p.ufM2
  const partidas = desgloseProyecto(p, ind)
  return partidas.length ? partidas.reduce((t, x) => t + x.uf, 0) : null
}

export function ufProyecto(p: ProyectoComercial, ind: Indicadores): number | null {
  const tarifa = ufM2Proyecto(p, ind)
  return tarifa != null && p.m2 ? tarifa * p.m2 : null
}

// Cobros de la utilidad, por partida:
// - BIM: 50% al inicio y 50% al final del hito BIM.
// - Estructuras: 50% con el pedido de madera, 25% cuando la madera llega a fábrica (inicio de
//   fábrica) y 25% al terminar de fabricar y despachar a obra (fin de fábrica).
// - Montaje y logística: 50% al iniciar y 50% al terminar el montaje (sin montaje, con el despacho).
// - Obra (envolvente y obra completa): mes a mes desde el inicio del montaje hasta el fin de
//   terminaciones (o de la envolvente). Si todo cae en un solo mes se asumen DURACION_OBRA_MESES.
export const DURACION_OBRA_MESES = 5
const PARTIDAS_OBRA: (keyof Indicadores)[] = ['envolvente', 'completa']

export type Cobro = { mes: string; uf: number; concepto: string }

export function cobrosProyecto(p: ProyectoComercial, ind: Indicadores): Cobro[] {
  const uf = ufProyecto(p, ind)
  if (!uf || !p.m2) return []
  const m2 = p.m2
  const inicio = (tipo: TipoHito) => p.hitos.filter(h => h.tipo === tipo).map(h => h.desde).sort()[0]
  const fin = (tipo: TipoHito) => p.hitos.filter(h => h.tipo === tipo).map(h => h.hasta || h.desde).sort().at(-1)
  const res: Cobro[] = []
  const cobrar = (mes: string | undefined, monto: number, concepto: string) => { if (mes && monto > 0) res.push({ mes, uf: monto, concepto }) }
  const mesMadera = inicio('pedidoMadera') || inicio('fabrica')

  const desglose = desgloseProyecto(p, ind)
  const suma = desglose.reduce((t, d) => t + d.uf, 0)
  if (!suma) {
    // Sin tipo definido (solo UF/m² manual): mitad con el pedido de madera, mitad al cerrar el montaje.
    cobrar(mesMadera, uf / 2, 'Anticipo')
    cobrar(fin('montaje'), uf / 2, 'Saldo')
    return res
  }
  // Con UF/m² manual se mantiene el reparto por partida, escalado al valor manual.
  const factor = p.ufM2 != null ? p.ufM2 / suma : 1
  const monto = (...ks: (keyof Indicadores)[]) => desglose.filter(d => ks.includes(d.concepto)).reduce((t, d) => t + d.uf, 0) * factor * m2

  const bim = monto('bim')
  cobrar(inicio('calculo'), bim / 2, 'BIM · inicio')
  cobrar(fin('calculo'), bim / 2, 'BIM · fin')

  const est = monto('estructuras')
  cobrar(mesMadera, est * 0.5, 'Estructuras · pedido de madera')
  cobrar(inicio('fabrica') || mesMadera, est * 0.25, 'Estructuras · madera en fábrica')
  cobrar(fin('fabrica') || mesMadera, est * 0.25, 'Estructuras · despacho a obra')

  // Sin hito de montaje (solo estructuras sin montaje), la logística se cobra con el despacho.
  const despacho = fin('fabrica') || mesMadera
  const montaje = monto('montaje', 'logistica')
  cobrar(inicio('montaje') || despacho, montaje / 2, 'Montaje y logística · inicio')
  cobrar(fin('montaje') || despacho, montaje / 2, 'Montaje y logística · término')

  const obra = monto(...PARTIDAS_OBRA)
  const iniMontaje = inicio('montaje')
  if (iniMontaje && obra > 0) {
    const finObra = [fin('montaje'), fin('envolvente'), fin('terminaciones')].filter((m): m is string => !!m).sort().at(-1)!
    const meses = finObra > iniMontaje
      ? mesesEntre(iniMontaje, finObra)
      : mesesEntre(iniMontaje, aMes(aNumero(iniMontaje) + DURACION_OBRA_MESES - 1))
    meses.forEach((mes, i) => cobrar(mes, obra / meses.length, `Obra · mes ${i + 1} de ${meses.length}`))
  }
  return res
}

// Rangos de probabilidad para repartir los totales de cada mes.
export const RANGOS_PROBABILIDAD = [
  { clave: 'alta', etiqueta: '70-100%', color: '#3a2d5e', min: 70 },
  { clave: 'media', etiqueta: '40-60%', color: '#8f84bd', min: 40 },
  { clave: 'baja', etiqueta: '0-30%', color: '#d9d3ea', min: 0 },
  { clave: 'sin', etiqueta: 'Sin %', color: '#d8d3cb', min: -1 },
] as const

export function rangoProbabilidad(prob: number | null) {
  if (prob == null) return 3
  return RANGOS_PROBABILIDAD.findIndex(r => prob >= r.min)
}

// Orden dentro de cada grupo: primero el montaje más próximo, luego la mayor probabilidad.
export function compararProyectos(a: ProyectoComercial, b: ProyectoComercial) {
  return (mesMontaje(a) || '9999').localeCompare(mesMontaje(b) || '9999')
    || (b.probabilidad ?? -1) - (a.probabilidad ?? -1)
    || a.nombre.localeCompare(b.nombre)
}

export function formatoUF(n: number) {
  return `${Math.round(n).toLocaleString('es-CL')} UF`
}

export const SEMANAS_POR_MES = 4
export const RANGO_VISIBLE = { desde: '2026-11', hasta: '2027-12' }
// Meses disponibles al editar (más amplio que lo visible).
export const RANGO_EDICION = { desde: '2026-01', hasta: '2028-12' }

const NOMBRES_MES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export function nombreMes(mes: string, corto = false) {
  const [y, m] = mes.split('-').map(Number)
  const n = NOMBRES_MES[m - 1]
  return corto ? `${n.slice(0, 3)} ${String(y).slice(2)}` : n
}

export function mesesEntre(desde: string, hasta: string): string[] {
  const res: string[] = []
  let [y, m] = desde.split('-').map(Number)
  const [yf, mf] = hasta.split('-').map(Number)
  while (y < yf || (y === yf && m <= mf)) {
    res.push(`${y}-${String(m).padStart(2, '0')}`)
    m++
    if (m > 12) { m = 1; y++ }
  }
  return res
}

export function semanaDeDia(dia: number) {
  return Math.min(SEMANAS_POR_MES, Math.floor((dia - 1) / 7) + 1)
}

// Posición (en columnas) de un hito dentro del rango visible. En vista de meses cada mes es una
// columna; en vista de semanas cada mes son 4. Devuelve null si cae completamente fuera.
export function columnasHito(h: Hito, meses: string[], vista: 'meses' | 'semanas') {
  const hasta = h.hasta && h.hasta >= h.desde ? h.hasta : h.desde
  if (hasta < meses[0] || h.desde > meses[meses.length - 1]) return null
  const porMes = vista === 'semanas' ? SEMANAS_POR_MES : 1
  const idx = (mes: string) => {
    if (mes < meses[0]) return -1
    if (mes > meses[meses.length - 1]) return meses.length
    return meses.indexOf(mes)
  }
  const iDesde = idx(h.desde)
  const iHasta = idx(hasta)
  let inicio = iDesde < 0 ? 0 : iDesde * porMes
  let fin = iHasta >= meses.length ? meses.length * porMes - 1 : iHasta * porMes + porMes - 1
  if (vista === 'semanas') {
    if (iDesde >= 0 && h.semanaDesde) inicio = iDesde * porMes + h.semanaDesde - 1
    if (iHasta < meses.length && (h.semanaHasta || (!h.hasta && h.semanaDesde))) {
      fin = iHasta * porMes + (h.semanaHasta || h.semanaDesde!) - 1
    }
  }
  return { inicio, fin: Math.max(inicio, fin), cortaInicio: iDesde < 0, cortaFin: iHasta >= meses.length }
}

const aNumero = (mes: string) => { const [y, m] = mes.split('-').map(Number); return y * 12 + m - 1 }
const aMes = (n: number) => `${Math.floor(n / 12)}-${String((n % 12) + 1).padStart(2, '0')}`

// Desplaza un hito `delta` columnas. En meses mantiene las semanas; en semanas el hito pasa a
// tener semana de inicio y fin (si era de mes completo, ocupa S1-S4 antes de moverse).
export function moverHito(h: Hito, delta: number, vista: 'meses' | 'semanas'): Hito {
  if (!delta) return h
  if (vista === 'meses') {
    return { ...h, desde: aMes(aNumero(h.desde) + delta), hasta: h.hasta ? aMes(aNumero(h.hasta) + delta) : h.hasta }
  }
  const finMes = h.hasta || h.desde
  const semFin = h.semanaHasta || (h.hasta ? SEMANAS_POR_MES : h.semanaDesde || SEMANAS_POR_MES)
  const inicio = aNumero(h.desde) * SEMANAS_POR_MES + (h.semanaDesde || 1) - 1 + delta
  const fin = aNumero(finMes) * SEMANAS_POR_MES + semFin - 1 + delta
  const desde = aMes(Math.floor(inicio / SEMANAS_POR_MES))
  const hasta = aMes(Math.floor(fin / SEMANAS_POR_MES))
  const semanaDesde = (inicio % SEMANAS_POR_MES) + 1
  const semanaHasta = (fin % SEMANAS_POR_MES) + 1
  if (inicio === fin) return { ...h, desde, semanaDesde, hasta: null, semanaHasta: null }
  return { ...h, desde, semanaDesde, hasta, semanaHasta }
}

// Tiempo base de cada hito, en semanas (4 semanas = 1 mes). Se aplica al crear el hito.
export const SEMANAS_BASE: Partial<Record<TipoHito, number>> = {
  analisis: 1, presupuestoInicial: 1, presupuestoCierre: 2, calculo: 4, pedidoMadera: 3,
  fabrica: 4, montaje: 4, envolvente: 5, terminaciones: 12,
}

const semanaInicio = (h: Hito) => aNumero(h.desde) * SEMANAS_POR_MES + (h.semanaDesde || 1) - 1

// Hito que ocupa de la semana `inicio` a la `fin` (semanas absolutas).
function enSemanas<T extends Hito>(h: T, inicio: number, fin: number): T {
  return {
    ...h, desde: aMes(Math.floor(inicio / SEMANAS_POR_MES)), semanaDesde: (inicio % SEMANAS_POR_MES) + 1,
    hasta: aMes(Math.floor(fin / SEMANAS_POR_MES)), semanaHasta: (fin % SEMANAS_POR_MES) + 1,
  }
}

export function conDuracionPorDefecto(h: Hito): Hito {
  const semanas = SEMANAS_BASE[h.tipo]
  if (!semanas || h.hasta) return h
  const inicio = semanaInicio(h)
  return enSemanas(h, inicio, inicio + semanas - 1)
}

// Al ingresar la fábrica se completan hacia atrás los hitos que faltan, cada uno con su tiempo
// base y terminando justo antes del siguiente. Los que ya existen se respetan.
const ANTES_DE_FABRICA: TipoHito[] = ['analisis', 'presupuestoInicial', 'presupuestoCierre', 'calculo', 'pedidoMadera']

export function rellenarAntesDeFabrica(hitos: Hito[], fabrica: Hito): Hito[] {
  const nuevos: Hito[] = []
  let cursor = semanaInicio(fabrica)
  for (const tipo of [...ANTES_DE_FABRICA].reverse()) {
    const existente = hitos.filter(h => h.tipo === tipo).sort((a, b) => semanaInicio(a) - semanaInicio(b))[0]
    if (existente) { cursor = Math.min(cursor, semanaInicio(existente)); continue }
    const semanas = SEMANAS_BASE[tipo]!
    nuevos.push(enSemanas({ _key: nuevaClave(), tipo, desde: '', hecho: false }, cursor - semanas, cursor - 1))
    cursor -= semanas
  }
  return nuevos
}

// Cada hito de la secuencia parte la semana siguiente al término del anterior.
export const HITO_ANTERIOR: Partial<Record<TipoHito, TipoHito>> = {
  presupuestoInicial: 'analisis', presupuestoCierre: 'presupuestoInicial', calculo: 'presupuestoCierre',
  pedidoMadera: 'calculo', fabrica: 'pedidoMadera', montaje: 'fabrica', envolvente: 'montaje', terminaciones: 'envolvente',
}

export function inicioTrasAnterior(hitos: Hito[], tipo: TipoHito): { desde: string; semanaDesde: number } | null {
  const anterior = HITO_ANTERIOR[tipo]
  const fines = hitos.filter(h => h.tipo === anterior).map(h => {
    const mes = h.hasta || h.desde
    const semana = h.semanaHasta || (h.hasta ? SEMANAS_POR_MES : h.semanaDesde || SEMANAS_POR_MES)
    return aNumero(mes) * SEMANAS_POR_MES + semana - 1
  })
  if (!fines.length) return null
  const siguiente = Math.max(...fines) + 1
  return { desde: aMes(Math.floor(siguiente / SEMANAS_POR_MES)), semanaDesde: (siguiente % SEMANAS_POR_MES) + 1 }
}

export function textoPeriodo(h: Hito) {
  const p = (mes: string, s?: number | null) => `${nombreMes(mes, true)}${s ? ` S${s}` : ''}`
  const desde = p(h.desde, h.semanaDesde)
  if (!h.hasta || (h.hasta === h.desde && h.semanaHasta === h.semanaDesde)) return desde
  return `${desde} → ${p(h.hasta, h.semanaHasta)}`
}

export function mesMontaje(p: ProyectoComercial): string | null {
  return p.hitos.filter(h => h.tipo === 'montaje').map(h => h.desde).sort()[0] ?? null
}

export function nuevaClave() {
  return Math.random().toString(36).slice(2, 10)
}
