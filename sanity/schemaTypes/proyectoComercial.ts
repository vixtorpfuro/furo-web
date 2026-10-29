// Proyecto en etapa comercial para el board /interno/comercial. Se llena a mano; mondayItemId
// queda reservado para conectarlo con el board Proyectos de Monday más adelante.

const proyectoComercial = {
  name: 'proyectoComercial',
  title: 'Planificación comercial — Proyectos',
  type: 'document',
  fields: [
    { name: 'nombre', title: 'Proyecto', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
    { name: 'cliente', title: 'Cliente / contraparte', type: 'string' },
    {
      name: 'tipo', title: 'Tipo de presupuesto', type: 'string',
      options: { list: [
        { title: 'Solo estructuras', value: 'estructuras' },
        { title: 'Intermedia (estructura montada / obra gruesa)', value: 'intermedia' },
        { title: 'Obra completa', value: 'completa' },
        { title: 'Noki', value: 'noki' },
        { title: 'Por definir', value: 'porDefinir' },
      ] },
    },
    { name: 'superficie', title: 'Superficie (texto de referencia)', type: 'string' },
    { name: 'm2', title: 'm²', type: 'number' },
    { name: 'estado', title: 'Estado / condición', type: 'text', rows: 3 },
    { name: 'probabilidad', title: 'Probabilidad de éxito (%)', type: 'number' },
    { name: 'zona', title: 'Zona', type: 'string' },
    { name: 'logistica', title: 'Logística UF/m² (vacío = indicador general)', type: 'number' },
    { name: 'conMontaje', title: 'Solo estructuras: incluye montaje', type: 'boolean' },
    { name: 'ufM2', title: 'UF/m² manual (vacío = según tipo)', type: 'number' },
    {
      name: 'hitos', title: 'Hitos', type: 'array',
      of: [{
        type: 'object', name: 'hito',
        fields: [
          {
            name: 'tipo', title: 'Tipo', type: 'string',
            options: { list: [
              { title: 'Análisis inicial', value: 'analisis' },
              { title: 'Ingreso anteproyecto', value: 'anteproyecto' },
              { title: 'Presupuesto inicial', value: 'presupuestoInicial' },
              { title: 'Presupuesto de cierre', value: 'presupuestoCierre' },
              { title: 'Cálculo', value: 'calculo' },
              { title: 'Fábrica', value: 'fabrica' },
              { title: 'Montaje', value: 'montaje' },
              { title: 'Término de obra', value: 'terminoObra' },
              { title: 'Otro', value: 'otro' },
            ] },
          },
          { name: 'etiqueta', title: 'Etiqueta (para "Otro")', type: 'string' },
          { name: 'desde', title: 'Desde (AAAA-MM)', type: 'string' },
          { name: 'semanaDesde', title: 'Semana desde (1-4)', type: 'number' },
          { name: 'hasta', title: 'Hasta (AAAA-MM)', type: 'string' },
          { name: 'semanaHasta', title: 'Semana hasta (1-4)', type: 'number' },
          { name: 'hecho', title: 'Cumplido', type: 'boolean' },
          { name: 'nota', title: 'Nota', type: 'string' },
        ],
        preview: { select: { title: 'tipo', subtitle: 'desde' } },
      }],
    },
    { name: 'mondayItemId', title: 'ID item Monday (futuro)', type: 'string' },
    { name: 'archivado', title: 'Archivado', type: 'boolean' },
    { name: 'actualizadoPor', title: 'Actualizado por', type: 'string', readOnly: true },
  ],
  preview: { select: { title: 'nombre', subtitle: 'cliente' } },
}

export default proyectoComercial
