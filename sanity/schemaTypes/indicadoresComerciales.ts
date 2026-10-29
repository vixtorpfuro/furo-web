// Indicadores UF/m² del board comercial. Documento único (_id "comercial.indicadores"), se edita desde /interno/comercial.

const indicadoresComerciales = {
  name: 'indicadoresComerciales',
  title: 'Planificación comercial — Indicadores',
  type: 'document',
  fields: [
    { name: 'estructuras', title: 'Solo estructuras (UF/m²)', type: 'number' },
    { name: 'montaje', title: 'Montaje de estructuras (UF/m²)', type: 'number' },
    { name: 'revestimiento', title: 'Revestimiento exterior (UF/m², intermedia)', type: 'number' },
    { name: 'techumbre', title: 'Techumbre (UF/m², intermedia)', type: 'number' },
    { name: 'ventanas', title: 'Ventanas (UF/m², intermedia)', type: 'number' },
    { name: 'completa', title: 'Obra completa (UF/m², se suma a lo anterior)', type: 'number' },
    { name: 'logistica', title: 'Logística mínima Santiago (UF/m²)', type: 'number' },
    { name: 'actualizadoPor', title: 'Actualizado por', type: 'string', readOnly: true },
  ],
  preview: { prepare: () => ({ title: 'Indicadores comerciales' }) },
}

export default indicadoresComerciales
