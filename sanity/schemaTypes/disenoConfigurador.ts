const disenoConfigurador = {
  name: 'disenoConfigurador',
  title: 'Diseños — Configurador',
  type: 'document',
  fields: [
    { name: 'nombre', title: 'Nombre', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
    { name: 'creadoEn', title: 'Creado en', type: 'datetime' },
    {
      name: 'paneles',
      title: 'Paneles colocados',
      type: 'array',
      of: [{
        type: 'object',
        name: 'panelColocado',
        fields: [
          { name: 'catalogoId', title: 'ID de catálogo', type: 'string' },
          { name: 'tipo', title: 'Tipo', type: 'string', options: { list: ['piso', 'muro', 'techo', 'vano', 'bastidor'] } },
          { name: 'x', title: 'X (grilla)', type: 'number' },
          { name: 'y', title: 'Y (grilla)', type: 'number' },
          { name: 'nivel', title: 'Nivel', type: 'number' },
          { name: 'rotacion', title: 'Rotación', type: 'number' },
          { name: 'altoM', title: 'Alto (m)', type: 'number' },
        ],
      }],
    },
    {
      name: 'resumen',
      title: 'Resumen',
      type: 'object',
      fields: [
        { name: 'areaM2', title: 'Área (m²)', type: 'number' },
        { name: 'costoEstimado', title: 'Costo estimado (CLP)', type: 'number' },
        { name: 'cumpleEstructura', title: 'Cumple estructura', type: 'boolean' },
      ],
    },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'creadoEn' },
  },
}

export default disenoConfigurador
