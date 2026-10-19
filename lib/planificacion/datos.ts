import 'server-only'
import { mondayFetch } from '@/lib/interno/monday'
import { writeClient } from '@/sanity/lib/writeClient'
import {
  calcularPlan, TIEMPO_DECISION_DEFAULT, TIEMPOS_DECISION,
  type Alcance, type Hitos, type ResultadoPlan, type TiempoDecision, type Tipologia,
} from './calculo'

// Board "Proyectos" del workspace CRM nuevo. Los proyectos nacen en el estado
// "En espera de presupuesto o Carta hon." y se siguen mostrando al pasar a "Presupuesto entregado".
// Los "Ganado" solo aparecen si ya tienen planificación guardada.
const BOARD_PROYECTOS = '9586473667'
const COL = {
  estado: 'color_mksy436r',
  itemizado: 'color_mm1t1n7a',
  m2: 'numeric_mksw5r6f',
  responsable: 'multiple_person_mkwzvh07',
  horizonte: 'color_mkzzw77',
  tipoProyecto: 'dropdown_mksyyp8k',
} as const
const ESTADO = { enEspera: 4, entregado: 6, ganado: 1 } as const

const ALCANCE_POR_ITEMIZADO: Record<string, Alcance> = {
  'Estructuras': 'estructuras',
  'Estructuras montadas': 'montadas',
  'Proyecto completo': 'completo',
}

const TIPOS_COMERCIALES = /restaurante|colegio|universidad|hotel|oficina|centro comercial|edificio|estado|concurso/i

export type PlanManual = {
  fechaObjetivo: string | null
  tiempoDecision: TiempoDecision
  entradaFabricaAjustada: string | null
  tipologia: Tipologia | null
  mlReales: number | null
  cuadrillas: number
  terminacionesSemanas: number | null
  modeloPreliminar: boolean
  notas: string
  reales: Partial<Hitos>
  lineaBase: (Partial<Hitos> & { fijadaEn?: string; fijadaPor?: string }) | null
  actualizadoPor: string | null
}

export type ProyectoPlanificado = {
  id: string
  nombre: string
  url: string
  estado: string
  enEspera: boolean
  alcance: Alcance | null
  m2: number | null
  responsable: string
  horizonte: string
  tipoProyecto: string
  tipologia: Tipologia
  manual: PlanManual
  plan: ResultadoPlan
}

type ItemMonday = { id: string; name: string; url: string; column_values: { id: string; text: string | null }[] }

async function leerProyectosMonday(): Promise<ItemMonday[]> {
  const data = await mondayFetch(
    `query ($boardId: ID!, $estados: CompareValue!) {
      boards(ids: [$boardId]) {
        items_page(limit: 500, query_params: { rules: [{ column_id: "${COL.estado}", compare_value: $estados, operator: any_of }] }) {
          items { id name url column_values(ids: ${JSON.stringify(Object.values(COL))}) { id text } }
        }
      }
    }`,
    { boardId: BOARD_PROYECTOS, estados: [ESTADO.enEspera, ESTADO.entregado, ESTADO.ganado] }
  )
  return data.boards?.[0]?.items_page?.items || []
}

type DocPlan = Partial<Omit<PlanManual, 'tiempoDecision' | 'tipologia'>> & {
  mondayItemId: string
  tiempoDecision?: string
  tipologia?: string
}

async function leerPlanesSanity(): Promise<Map<string, DocPlan>> {
  const docs: DocPlan[] = await writeClient.fetch(
    `*[_type == "planificacionProyecto"]{ mondayItemId, fechaObjetivo, tiempoDecision, entradaFabricaAjustada,
      tipologia, mlReales, cuadrillas, terminacionesSemanas, modeloPreliminar, notas, reales, lineaBase, actualizadoPor }`
  )
  return new Map(docs.map(d => [d.mondayItemId, d]))
}

function normalizarManual(doc: DocPlan | undefined): PlanManual {
  const td = doc?.tiempoDecision
  const tip = doc?.tipologia
  return {
    fechaObjetivo: doc?.fechaObjetivo || null,
    tiempoDecision: td && td in TIEMPOS_DECISION ? (td as TiempoDecision) : TIEMPO_DECISION_DEFAULT,
    entradaFabricaAjustada: doc?.entradaFabricaAjustada || null,
    tipologia: tip === 'residencial' || tip === 'comercial' ? tip : null,
    mlReales: typeof doc?.mlReales === 'number' ? doc.mlReales : null,
    cuadrillas: typeof doc?.cuadrillas === 'number' && doc.cuadrillas > 0 ? doc.cuadrillas : 1,
    terminacionesSemanas: typeof doc?.terminacionesSemanas === 'number' ? doc.terminacionesSemanas : null,
    modeloPreliminar: !!doc?.modeloPreliminar,
    notas: doc?.notas || '',
    reales: doc?.reales || {},
    lineaBase: doc?.lineaBase || null,
    actualizadoPor: doc?.actualizadoPor || null,
  }
}

export async function obtenerPlanificacion(): Promise<ProyectoPlanificado[]> {
  const [items, planes] = await Promise.all([leerProyectosMonday(), leerPlanesSanity()])

  return items
    .map(item => {
      const v = (id: string) => item.column_values.find(c => c.id === id)?.text?.trim() || ''
      const estado = v(COL.estado)
      const m2 = Number(v(COL.m2)) || null
      const tipoProyecto = v(COL.tipoProyecto)
      const doc = planes.get(item.id)
      const manual = normalizarManual(doc)
      const tipologia: Tipologia = manual.tipologia ?? (TIPOS_COMERCIALES.test(tipoProyecto) ? 'comercial' : 'residencial')
      const alcance = ALCANCE_POR_ITEMIZADO[v(COL.itemizado)] ?? null

      return {
        doc,
        proyecto: {
          id: item.id,
          nombre: item.name,
          url: item.url,
          estado,
          enEspera: estado.startsWith('En espera'),
          alcance,
          m2,
          responsable: v(COL.responsable),
          horizonte: v(COL.horizonte),
          tipoProyecto,
          tipologia,
          manual,
          plan: calcularPlan({
            alcance, m2, tipologia,
            mlReales: manual.mlReales,
            cuadrillas: manual.cuadrillas,
            fechaObjetivo: manual.fechaObjetivo,
            entradaFabricaAjustada: manual.entradaFabricaAjustada,
            tiempoDecision: manual.tiempoDecision,
            terminacionesSemanas: manual.terminacionesSemanas,
          }),
        } satisfies ProyectoPlanificado,
      }
    })
    .filter(({ doc, proyecto }) => proyecto.estado !== 'Ganado' || !!doc)
    .map(({ proyecto }) => proyecto)
}

export function idDocPlan(mondayItemId: string) {
  return `planificacion.${mondayItemId}`
}

export { BOARD_PROYECTOS }
