// Datos manuales de planificación de un proyecto del board "Proyectos" de Monday (CRM nuevo).
// Nombre, estado, itemizado y m² se leen de Monday; aquí solo lo que el equipo define a mano,
// más las fechas reales y la línea base para analizar desviaciones a futuro.
// _id: `planificacion.<mondayItemId>`

const fechasHitos = [
  { name: 'limitePresupuesto', title: 'Entrega de presupuesto', type: 'date' },
  { name: 'firmaAnticipo', title: 'Firma / anticipo', type: 'date' },
  { name: 'entradaFabrica', title: 'Entrada a fábrica (pedido de madera)', type: 'date' },
  { name: 'inicioFabricacion', title: 'Inicio fabricación', type: 'date' },
  { name: 'inicioMontaje', title: 'Inicio montaje', type: 'date' },
  { name: 'finObra', title: 'Fin de obra', type: 'date' },
]

const planificacionProyecto = {
  name: 'planificacionProyecto',
  title: 'Planificación — Proyectos',
  type: 'document',
  fields: [
    { name: 'mondayItemId', title: 'ID item Monday', type: 'string', readOnly: true },
    { name: 'nombre', title: 'Nombre (copia de Monday)', type: 'string', readOnly: true },
    { name: 'fechaObjetivo', title: 'Inicio montaje / despacho objetivo', type: 'date' },
    {
      name: 'tiempoDecision', title: 'Tiempo de decisión del cliente', type: 'string',
      options: { list: [
        { title: '2 semanas', value: '2sem' }, { title: '1 mes', value: '1mes' },
        { title: '3 meses', value: '3meses' }, { title: '6 meses', value: '6meses' }, { title: '1 año', value: '1anio' },
      ] },
    },
    { name: 'entradaFabricaAjustada', title: 'Entrada a fábrica ajustada', type: 'date', description: 'Solo si el cliente necesita mover la fecha calculada.' },
    {
      name: 'tipologia', title: 'Tipología (ml/m²)', type: 'string',
      options: { list: [{ title: 'Residencial (1,66)', value: 'residencial' }, { title: 'Comercial / educacional (0,9)', value: 'comercial' }] },
    },
    { name: 'mlReales', title: 'ml reales (cotización)', type: 'number' },
    { name: 'cuadrillas', title: 'Cuadrillas de montaje', type: 'number', initialValue: 1 },
    { name: 'terminacionesSemanas', title: 'Meta terminaciones (semanas)', type: 'number' },
    { name: 'modeloPreliminar', title: 'Tiene modelo preliminar', type: 'boolean' },
    { name: 'notas', title: 'Notas', type: 'text', rows: 3 },
    { name: 'reales', title: 'Fechas reales', type: 'object', fields: fechasHitos },
    { name: 'lineaBase', title: 'Línea base (meta fijada)', type: 'object', readOnly: true, fields: [
      ...fechasHitos, { name: 'fijadaEn', title: 'Fijada el', type: 'datetime' }, { name: 'fijadaPor', title: 'Fijada por', type: 'string' },
    ] },
    { name: 'actualizadoPor', title: 'Actualizado por', type: 'string', readOnly: true },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'fechaObjetivo' },
  },
}

export default planificacionProyecto
