// Motor de planificación de proyectos FURŌ. Funciones puras (sin acceso a Monday ni Sanity) para
// poder probarlas y reutilizarlas. Las fechas son strings 'YYYY-MM-DD' interpretadas en UTC.

// ── Parámetros acordados con el equipo (octubre 2026) ────────────────────────────────────────
export const PARAMETROS = {
  diasHabilesSemana: 5,
  // Modelación y cálculo definitiva: parte con el pago del cliente y dura 3 semanas.
  modelacionDias: 15,
  // La madera se pide antes de terminar la modelación, cuando escuadrías y largos están listos.
  // Ese día es la "entrada a fábrica" (también se cobra el anticipo).
  pedidoMaderaEnDiaDeModelacion: 10,
  // Pedido de madera: 3-4 semanas. Se planifica con el punto medio.
  pedidoMaderaDias: 17,
  // Fábrica: hasta 50 ml/día, pero se planifica a 35 ml/día.
  mlPorDiaPlan: 35,
  mlPorDiaMax: 50,
  // Montaje: una cuadrilla monta ~15 m² de paneles FURŌ por día.
  m2PorDiaCuadrilla: 15,
  // Relación ml/m² del histórico de presupuestos (mediana, 43 presupuestos jun-oct 2026).
  mlPorM2: { residencial: 1.66, comercial: 0.9 },
} as const

export type Alcance = 'estructuras' | 'montadas' | 'completo'
export type Tipologia = keyof typeof PARAMETROS.mlPorM2

export const TIEMPOS_DECISION = {
  '2sem': { etiqueta: '2 semanas', dias: 14 },
  '1mes': { etiqueta: '1 mes', dias: 30 },
  '3meses': { etiqueta: '3 meses', dias: 91 },
  '6meses': { etiqueta: '6 meses', dias: 182 },
  '1anio': { etiqueta: '1 año', dias: 365 },
} as const
export type TiempoDecision = keyof typeof TIEMPOS_DECISION
export const TIEMPO_DECISION_DEFAULT: TiempoDecision = '1mes'

// ── Fechas hábiles ─────────────────────────────────────────────────────────────────────────
// Feriados no se descuentan todavía (pendiente de definir con el equipo).

function aDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function aIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10)
}

function esHabil(fecha: Date): boolean {
  const dia = fecha.getUTCDay()
  return dia !== 0 && dia !== 6
}

export function sumarDias(iso: string, dias: number): string {
  const f = aDate(iso)
  f.setUTCDate(f.getUTCDate() + dias)
  return aIso(f)
}

// Avanza (o retrocede, con n negativo) n días hábiles. Si la fecha de partida cae en fin de
// semana, primero se mueve al día hábil más cercano en la dirección del avance.
export function sumarHabiles(iso: string, n: number): string {
  const f = aDate(iso)
  const paso = n < 0 ? -1 : 1
  while (!esHabil(f)) f.setUTCDate(f.getUTCDate() + paso)
  let restantes = Math.abs(n)
  while (restantes > 0) {
    f.setUTCDate(f.getUTCDate() + paso)
    if (esHabil(f)) restantes--
  }
  return aIso(f)
}

// Si cae en fin de semana, retrocede al viernes anterior.
export function habilAnterior(iso: string): string {
  const f = aDate(iso)
  while (!esHabil(f)) f.setUTCDate(f.getUTCDate() - 1)
  return aIso(f)
}

export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aDate(hasta).getTime() - aDate(desde).getTime()) / 86_400_000)
}

// ── Cálculo por proyecto ───────────────────────────────────────────────────────────────────

export type EntradaPlan = {
  alcance: Alcance | null
  m2: number | null
  tipologia: Tipologia
  mlReales: number | null
  cuadrillas: number
  // Inicio de montaje objetivo (o despacho, si el alcance es solo estructuras). Lo fija el equipo.
  fechaObjetivo: string | null
  // Si el cliente necesita mover la entrada a fábrica, manda sobre el cálculo hacia atrás.
  entradaFabricaAjustada: string | null
  tiempoDecision: TiempoDecision
  terminacionesSemanas: number | null
}

export type FaseId = 'modelacion' | 'madera' | 'fabricacion' | 'montaje' | 'terminaciones'
export type Fase = { id: FaseId; inicio: string; fin: string; dias: number }

export type Hitos = {
  limitePresupuesto: string
  firmaAnticipo: string
  entradaFabrica: string
  inicioFabricacion: string
  inicioMontaje: string
  finObra: string
}

export type ResultadoPlan = {
  ml: number | null
  mlEstimado: boolean
  diasFabricacion: number | null
  diasMontaje: number | null
  modo: 'hacia-atras' | 'ajustada' | null
  hitos: Hitos | null
  fases: Fase[]
  // Diferencia (días corridos) entre el montaje resultante y el objetivo, cuando se ajustó la entrada.
  desfaseMontajeDias: number | null
  faltantes: string[]
}

export function calcularMl(e: Pick<EntradaPlan, 'm2' | 'tipologia' | 'mlReales'>) {
  if (e.mlReales && e.mlReales > 0) return { ml: e.mlReales, estimado: false }
  if (e.m2 && e.m2 > 0) return { ml: Math.round(e.m2 * PARAMETROS.mlPorM2[e.tipologia]), estimado: true }
  return { ml: null, estimado: true }
}

export function calcularPlan(e: EntradaPlan): ResultadoPlan {
  const P = PARAMETROS
  const faltantes: string[] = []
  if (!e.alcance) faltantes.push('Itemizado (alcance)')
  if (!e.m2 && !e.mlReales) faltantes.push('m²')
  if (!e.fechaObjetivo && !e.entradaFabricaAjustada) faltantes.push('Fecha objetivo de montaje')

  const { ml, estimado } = calcularMl(e)
  const diasFabricacion = ml ? Math.max(1, Math.ceil(ml / P.mlPorDiaPlan)) : null
  const conMontaje = e.alcance === 'montadas' || e.alcance === 'completo'
  const diasMontaje = conMontaje && e.m2
    ? Math.max(1, Math.ceil(e.m2 / (P.m2PorDiaCuadrilla * Math.max(1, e.cuadrillas))))
    : conMontaje ? null : 0
  if (conMontaje && !e.m2) faltantes.push('m² para montaje')

  const vacio: ResultadoPlan = {
    ml, mlEstimado: estimado, diasFabricacion, diasMontaje, modo: null, hitos: null, fases: [],
    desfaseMontajeDias: null, faltantes,
  }
  if (!diasFabricacion || diasMontaje === null || !e.alcance) return vacio

  let entradaFabrica: string
  let modo: ResultadoPlan['modo']
  if (e.entradaFabricaAjustada) {
    entradaFabrica = sumarHabiles(e.entradaFabricaAjustada, 0)
    modo = 'ajustada'
  } else if (e.fechaObjetivo) {
    // Hacia atrás: objetivo − fabricación − pedido de madera.
    const inicioFab = sumarHabiles(e.fechaObjetivo, -diasFabricacion)
    entradaFabrica = sumarHabiles(inicioFab, -P.pedidoMaderaDias)
    modo = 'hacia-atras'
  } else {
    return vacio
  }

  const inicioModelacion = sumarHabiles(entradaFabrica, -P.pedidoMaderaEnDiaDeModelacion)
  const finModelacion = sumarHabiles(inicioModelacion, P.modelacionDias - 1)
  const finMadera = sumarHabiles(entradaFabrica, P.pedidoMaderaDias - 1)
  // La fabricación parte cuando llega la madera y la modelación está terminada.
  const inicioFab = sumarHabiles(finMadera > finModelacion ? finMadera : finModelacion, 1)
  const finFab = sumarHabiles(inicioFab, diasFabricacion - 1)
  const inicioMontaje = sumarHabiles(finFab, 1)

  const fases: Fase[] = [
    { id: 'modelacion', inicio: inicioModelacion, fin: finModelacion, dias: P.modelacionDias },
    { id: 'madera', inicio: entradaFabrica, fin: finMadera, dias: P.pedidoMaderaDias },
    { id: 'fabricacion', inicio: inicioFab, fin: finFab, dias: diasFabricacion },
  ]
  let finObra = finFab
  if (diasMontaje > 0) {
    const finMontaje = sumarHabiles(inicioMontaje, diasMontaje - 1)
    fases.push({ id: 'montaje', inicio: inicioMontaje, fin: finMontaje, dias: diasMontaje })
    finObra = finMontaje
  }
  if (e.alcance === 'completo') {
    if (e.terminacionesSemanas && e.terminacionesSemanas > 0) {
      const dias = Math.round(e.terminacionesSemanas * P.diasHabilesSemana)
      const inicioTerm = sumarHabiles(finObra, 1)
      const finTerm = sumarHabiles(inicioTerm, dias - 1)
      fases.push({ id: 'terminaciones', inicio: inicioTerm, fin: finTerm, dias })
      finObra = finTerm
    } else {
      faltantes.push('Meta de terminaciones')
    }
  }

  const firmaAnticipo = inicioModelacion
  const limitePresupuesto = habilAnterior(sumarDias(firmaAnticipo, -TIEMPOS_DECISION[e.tiempoDecision].dias))

  return {
    ml, mlEstimado: estimado, diasFabricacion, diasMontaje, modo,
    hitos: { limitePresupuesto, firmaAnticipo, entradaFabrica, inicioFabricacion: inicioFab, inicioMontaje, finObra },
    fases,
    desfaseMontajeDias: modo === 'ajustada' && e.fechaObjetivo ? diasEntre(e.fechaObjetivo, inicioMontaje) : null,
    faltantes,
  }
}

// ── Carga de fábrica ───────────────────────────────────────────────────────────────────────

export type CargaSemana = { lunes: string; mlPorDia: number; proyectos: number }

function lunesDe(iso: string): string {
  const f = aDate(iso)
  const dia = (f.getUTCDay() + 6) % 7
  f.setUTCDate(f.getUTCDate() - dia)
  return aIso(f)
}

// Promedio de ml/día que suman los proyectos en fabricación cada semana. Cada proyecto aporta
// su ml repartido en sus días de fabricación (≈ 35 ml/día), así la superposición se ve directo.
export function cargaFabrica(planes: ResultadoPlan[], desde: string, semanas: number): CargaSemana[] {
  const inicio = lunesDe(desde)
  const res: CargaSemana[] = []
  for (let s = 0; s < semanas; s++) {
    const lunes = sumarDias(inicio, s * 7)
    const viernes = sumarDias(lunes, 4)
    let mlSemana = 0
    let proyectos = 0
    for (const p of planes) {
      const fab = p.fases.find(f => f.id === 'fabricacion')
      if (!fab || !p.ml || fab.fin < lunes || fab.inicio > viernes) continue
      proyectos++
      const mlDia = p.ml / fab.dias
      for (let d = 0; d < 5; d++) {
        const dia = sumarDias(lunes, d)
        if (dia >= fab.inicio && dia <= fab.fin) mlSemana += mlDia
      }
    }
    res.push({ lunes, mlPorDia: Math.round(mlSemana / 5), proyectos })
  }
  return res
}
