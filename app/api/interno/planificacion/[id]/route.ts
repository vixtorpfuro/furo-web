import { NextResponse } from 'next/server'
import { obtenerSesionInterno } from '@/lib/interno/sesion'
import { solicitudMismoOrigen } from '@/lib/interno/solicitud'
import { writeClient } from '@/sanity/lib/writeClient'
import { idDocPlan, obtenerPlanificacion } from '@/lib/planificacion/datos'
import { TIEMPOS_DECISION } from '@/lib/planificacion/calculo'

const FECHA = /^\d{4}-\d{2}-\d{2}$/
const HITOS = ['limitePresupuesto', 'firmaAnticipo', 'entradaFabrica', 'inicioFabricacion', 'inicioMontaje', 'finObra'] as const

const fecha = (v: unknown) => (typeof v === 'string' && FECHA.test(v) ? v : null)
const numero = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : null

// Guarda los datos manuales de planificación de un proyecto. Con { accion: 'fijarLineaBase' }
// congela las fechas calculadas actuales como meta, para comparar después con las reales.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesion = await obtenerSesionInterno()
  if (!sesion) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  if (!solicitudMismoOrigen(req)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 })

  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'ID de proyecto inválido.' }, { status: 400 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })

  try {
    const proyecto = (await obtenerPlanificacion()).find(p => p.id === id)
    if (!proyecto) return NextResponse.json({ error: 'El proyecto no está en la planificación.' }, { status: 404 })

    const _id = idDocPlan(id)
    await writeClient.createIfNotExists({ _id, _type: 'planificacionProyecto', mondayItemId: id })

    if (body.accion === 'fijarLineaBase') {
      if (!proyecto.plan.hitos) return NextResponse.json({ error: 'Faltan datos para calcular las fechas.' }, { status: 400 })
      await writeClient.patch(_id).set({
        nombre: proyecto.nombre,
        lineaBase: { ...proyecto.plan.hitos, fijadaEn: new Date().toISOString(), fijadaPor: sesion.nombre },
        actualizadoPor: sesion.nombre,
      }).commit()
      return NextResponse.json({ ok: true })
    }

    const td = typeof body.tiempoDecision === 'string' && body.tiempoDecision in TIEMPOS_DECISION ? body.tiempoDecision : null
    const tipologia = body.tipologia === 'residencial' || body.tipologia === 'comercial' ? body.tipologia : null
    const reales: Record<string, string> = {}
    for (const h of HITOS) {
      const f = fecha(body.reales?.[h])
      if (f) reales[h] = f
    }

    const valores = {
      nombre: proyecto.nombre,
      fechaObjetivo: fecha(body.fechaObjetivo),
      tiempoDecision: td,
      entradaFabricaAjustada: fecha(body.entradaFabricaAjustada),
      tipologia,
      mlReales: numero(body.mlReales, 1, 100_000),
      cuadrillas: numero(body.cuadrillas, 1, 20),
      terminacionesSemanas: numero(body.terminacionesSemanas, 0.5, 104),
      modeloPreliminar: body.modeloPreliminar === true,
      notas: typeof body.notas === 'string' ? body.notas.slice(0, 2000) : '',
      reales,
      actualizadoPor: sesion.nombre,
    }
    // Los campos vacíos se borran del documento en vez de guardarse como null.
    const set = Object.fromEntries(Object.entries(valores).filter(([, v]) => v !== null))
    const unset = Object.entries(valores).filter(([, v]) => v === null).map(([k]) => k)
    await writeClient.patch(_id).set(set).unset(unset).commit()

    return NextResponse.json({ ok: true })
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'No se pudo guardar la planificación.'
    return NextResponse.json({ error: mensaje }, { status: 502 })
  }
}
