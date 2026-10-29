import 'server-only'
import { writeClient } from '@/sanity/lib/writeClient'
import { HITOS, INDICADORES_BASE, TIPOS_PROYECTO, nuevaClave, type Hito, type Indicadores, type ProyectoComercial, type TipoHito, type TipoProyecto } from './modelo'

const CAMPOS = `_id, nombre, cliente, tipo, superficie, m2, estado, hitos, probabilidad, zona, logistica, ufM2, mondayItemId, actualizadoPor`
const ID_INDICADORES = 'comercial.indicadores'

export async function listarProyectos(): Promise<ProyectoComercial[]> {
  const docs: Partial<ProyectoComercial>[] = await writeClient.fetch(
    `*[_type == "proyectoComercial" && archivado != true] | order(nombre asc) { ${CAMPOS} }`
  )
  return docs.map(d => ({
    _id: d._id!,
    nombre: d.nombre || '(sin nombre)',
    cliente: d.cliente || '',
    tipo: d.tipo && d.tipo in TIPOS_PROYECTO ? d.tipo : 'porDefinir',
    superficie: d.superficie || '',
    m2: typeof d.m2 === 'number' ? d.m2 : null,
    estado: d.estado || '',
    hitos: (d.hitos || []).map(h => limpiarHito(h)).filter((h): h is Hito => !!h),
    probabilidad: typeof d.probabilidad === 'number' ? d.probabilidad : null,
    zona: d.zona || '',
    logistica: typeof d.logistica === 'number' ? d.logistica : null,
    ufM2: typeof d.ufM2 === 'number' ? d.ufM2 : null,
    mondayItemId: d.mondayItemId || null,
    actualizadoPor: d.actualizadoPor || null,
  }))
}

export async function leerIndicadores(): Promise<Indicadores> {
  const doc: Partial<Indicadores> | null = await writeClient.fetch(`*[_id == $id][0]`, { id: ID_INDICADORES })
  return limpiarIndicadores(doc) || INDICADORES_BASE
}

// Cada indicador es UF/m² entre 0 y 100; lo que no venga o no sea válido queda en su valor base.
export function limpiarIndicadores(entrada: unknown): Indicadores | null {
  if (!entrada || typeof entrada !== 'object') return null
  const o = entrada as Record<string, unknown>
  const res = { ...INDICADORES_BASE }
  for (const k of Object.keys(res) as (keyof Indicadores)[]) {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100) res[k] = v
  }
  return res
}

export async function guardarIndicadores(ind: Indicadores, usuario: string) {
  await writeClient.createOrReplace({ _id: ID_INDICADORES, _type: 'indicadoresComerciales', ...ind, actualizadoPor: usuario })
}

export async function contarProyectos(): Promise<number> {
  return writeClient.fetch(`count(*[_type == "proyectoComercial"])`)
}

const MES = /^20\d{2}-(0[1-9]|1[0-2])$/
const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const ufm2 = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100 ? v : null)
const semana = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 4 ? v : null)

function limpiarHito(entrada: unknown): Hito | null {
  if (!entrada || typeof entrada !== 'object') return null
  const h = entrada as Record<string, unknown>
  const tipo = typeof h.tipo === 'string' && h.tipo in HITOS ? (h.tipo as TipoHito) : null
  const desde = typeof h.desde === 'string' && MES.test(h.desde) ? h.desde : null
  if (!tipo || !desde) return null
  const hasta = typeof h.hasta === 'string' && MES.test(h.hasta) && h.hasta >= desde ? h.hasta : null
  return {
    _key: typeof h._key === 'string' && /^[\w-]{1,40}$/.test(h._key) ? h._key : nuevaClave(),
    tipo,
    etiqueta: texto(h.etiqueta, 60) || undefined,
    desde,
    semanaDesde: semana(h.semanaDesde),
    hasta,
    semanaHasta: hasta ? semana(h.semanaHasta) : null,
    hecho: h.hecho === true,
    nota: texto(h.nota, 300) || undefined,
  }
}

export type DatosProyecto = Omit<ProyectoComercial, '_id' | 'actualizadoPor'>

// Valida lo que llega del navegador. Devuelve null si falta el nombre.
export function limpiarProyecto(entrada: unknown): DatosProyecto | null {
  if (!entrada || typeof entrada !== 'object') return null
  const o = entrada as Record<string, unknown>
  const nombre = texto(o.nombre, 120)
  if (!nombre) return null
  const m2 = typeof o.m2 === 'number' && Number.isFinite(o.m2) && o.m2 > 0 && o.m2 < 1_000_000 ? o.m2 : null
  return {
    nombre,
    cliente: texto(o.cliente, 120),
    tipo: typeof o.tipo === 'string' && o.tipo in TIPOS_PROYECTO ? (o.tipo as TipoProyecto) : 'porDefinir',
    superficie: texto(o.superficie, 120),
    m2,
    estado: texto(o.estado, 1000),
    hitos: Array.isArray(o.hitos) ? o.hitos.slice(0, 40).map(limpiarHito).filter((h): h is Hito => !!h) : [],
    probabilidad: typeof o.probabilidad === 'number' && Number.isFinite(o.probabilidad) ? Math.min(100, Math.max(0, Math.round(o.probabilidad))) : null,
    zona: texto(o.zona, 80),
    logistica: ufm2(o.logistica),
    ufM2: ufm2(o.ufM2),
    mondayItemId: typeof o.mondayItemId === 'string' && /^\d+$/.test(o.mondayItemId) ? o.mondayItemId : null,
  }
}

// Sanity no guarda null: los campos vacíos se omiten.
export function aDocumento(datos: DatosProyecto, usuario: string) {
  const hitos = datos.hitos.map(h => Object.fromEntries(Object.entries({ ...h, _type: 'hito' }).filter(([, v]) => v !== null && v !== undefined)))
  return Object.fromEntries(
    Object.entries({ ...datos, hitos, actualizadoPor: usuario }).filter(([, v]) => v !== null && v !== undefined)
  )
}
