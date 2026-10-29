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

// Orden = orden habitual en que ocurren en un proyecto.
export const HITOS = {
  analisis: { etiqueta: 'Análisis inicial', corto: 'Análisis', fondo: '#e4ddd0', texto: '#141210' },
  anteproyecto: { etiqueta: 'Ingreso anteproyecto', corto: 'Anteproyecto', fondo: '#d6cdea', texto: '#141210' },
  presupuestoInicial: { etiqueta: 'Presupuesto inicial', corto: 'Ppto. inicial', fondo: '#bccbe0', texto: '#141210' },
  presupuestoCierre: { etiqueta: 'Presupuesto de cierre', corto: 'Ppto. cierre', fondo: '#6f8fbf', texto: '#ffffff' },
  calculo: { etiqueta: 'Cálculo', corto: 'Cálculo', fondo: '#aaa49b', texto: '#ffffff' },
  fabrica: { etiqueta: 'Fábrica', corto: 'Fábrica', fondo: '#52448a', texto: '#ffffff' },
  montaje: { etiqueta: 'Montaje', corto: 'Montaje', fondo: '#f08a5d', texto: '#141210' },
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
  mondayItemId?: string | null
  actualizadoPor?: string | null
}

export const SEMANAS_POR_MES = 4
export const RANGO_VISIBLE = { desde: '2026-11', hasta: '2027-06' }
// Meses disponibles al editar (más amplio que lo visible).
export const RANGO_EDICION = { desde: '2026-09', hasta: '2028-06' }

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
