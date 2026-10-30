import 'server-only'
import { db } from './db'

export type ProyectoCub = {
  id: string
  nombre: string
  cliente: string | null
  creadoEn: string
  revisiones: RevisionCub[]
}

export type RevisionCub = {
  id: string
  proyectoId: string
  etiqueta: string
  origen: 'dxf' | 'pdf' | 'ifc' | 'manual'
  archivoNombre: string | null
  estado: 'procesando' | 'lista' | 'error'
  error: string | null
  creadoPor: string | null
  creadoEn: string
  partidas: number
}

export type PartidaCub = {
  id: string
  orden: number
  grupo: string
  codigo: string
  descripcion: string
  unidad: string
  cantidad: number | null
  cantidadOriginal: number | null
  fuente: string | null
  confianza: 'alta' | 'media' | 'baja'
  editadaPor: string | null
}

export type ResumenRevision = {
  unidades?: string
  vistas?: { tipo: string; titulo: string }[]
  avisos?: string[]
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v))

export async function listarProyectos(): Promise<ProyectoCub[]> {
  const sql = db()
  const [proyectos, revisiones] = await Promise.all([
    sql`select id, nombre, cliente, creado_en from cub_proyectos order by creado_en desc`,
    sql`select r.id, r.proyecto_id, r.etiqueta, r.origen, r.archivo_nombre, r.estado, r.error, r.creado_por, r.creado_en,
               (select count(*) from cub_partidas p where p.revision_id = r.id)::int as partidas
          from cub_revisiones r order by r.creado_en desc`,
  ])
  return proyectos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    cliente: p.cliente,
    creadoEn: new Date(p.creado_en).toISOString(),
    revisiones: revisiones.filter(r => r.proyecto_id === p.id).map(aRevision),
  }))
}

function aRevision(r: Record<string, unknown>): RevisionCub {
  return {
    id: String(r.id),
    proyectoId: String(r.proyecto_id),
    etiqueta: String(r.etiqueta),
    origen: r.origen as RevisionCub['origen'],
    archivoNombre: (r.archivo_nombre as string) ?? null,
    estado: r.estado as RevisionCub['estado'],
    error: (r.error as string) ?? null,
    creadoPor: (r.creado_por as string) ?? null,
    creadoEn: new Date(r.creado_en as string).toISOString(),
    partidas: Number(r.partidas ?? 0),
  }
}

export async function leerRevision(id: string) {
  const sql = db()
  const [r] = await sql`
    select r.*, p.nombre as proyecto_nombre, p.cliente as proyecto_cliente,
           (select count(*) from cub_partidas x where x.revision_id = r.id)::int as partidas
      from cub_revisiones r join cub_proyectos p on p.id = r.proyecto_id
     where r.id = ${id}`
  if (!r) return null
  const partidas = await sql`select * from cub_partidas where revision_id = ${id} order by orden`
  return {
    revision: aRevision(r),
    proyecto: { nombre: String(r.proyecto_nombre), cliente: (r.proyecto_cliente as string) ?? null },
    resumen: (r.resumen ?? {}) as ResumenRevision,
    partidas: partidas.map((p): PartidaCub => ({
      id: p.id,
      orden: p.orden,
      grupo: p.grupo,
      codigo: p.codigo,
      descripcion: p.descripcion,
      unidad: p.unidad,
      cantidad: num(p.cantidad),
      cantidadOriginal: num(p.cantidad_original),
      fuente: p.fuente,
      confianza: p.confianza,
      editadaPor: p.editada_por,
    })),
  }
}

export async function crearProyecto(nombre: string, cliente: string, creadoPor: string) {
  const [p] = await db()`
    insert into cub_proyectos (nombre, cliente, creado_por)
    values (${nombre}, ${cliente || null}, ${creadoPor}) returning id`
  return String(p.id)
}

export async function proyectoExiste(id: string) {
  const [p] = await db()`select 1 from cub_proyectos where id = ${id}`
  return !!p
}

// Corrección manual de una partida: se guarda quién la cambió; cantidad_original queda intacta.
export async function actualizarPartida(id: string, cambios: { cantidad: number | null; descripcion: string }, por: string) {
  const [p] = await db()`
    update cub_partidas
       set cantidad = ${cambios.cantidad}, descripcion = ${cambios.descripcion},
           editada_por = ${por}, editada_en = now()
     where id = ${id}
     returning id`
  return !!p
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
